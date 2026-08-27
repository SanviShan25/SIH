import { Router, Response } from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import exifParser from 'exif-parser';
import { store as store } from '../store';

const router = Router();
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'data/uploads');
mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'].includes(file.mimetype)),
});

type Detection = { class: string; confidence: number; bbox: number[] };
type InferenceResult = { detections: Detection[]; annotatedImage?: string; floodMaskImage?: string; framesProcessed?: number; mediaType?: 'IMAGE' | 'VIDEO' };
type Coordinates = { latitude: number; longitude: number } | null;

function errorResponse(res: Response, error: unknown, status = 500) {
  return res.status(status).json({ success: false, error: error instanceof Error ? error.message : 'Request failed' });
}

function parseLocation(value: unknown): Coordinates {
  if (typeof value !== 'string') return null;
  const match = value.match(/([+-]?\d+(?:\.\d+)?)[,/]\s*([+-]?\d+(?:\.\d+)?)|([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)/);
  if (!match) return null;
  const latitude = Number(match[1] || match[3]);
  const longitude = Number(match[2] || match[4]);
  return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 ? { latitude, longitude } : null;
}

async function extractMediaCoordinates(filePath: string, mediaType: string): Promise<Coordinates> {
  if (mediaType.startsWith('image/')) {
    try {
      const tags = exifParser.create(await readFile(filePath)).parse().tags;
      if (typeof tags.GPSLatitude === 'number' && typeof tags.GPSLongitude === 'number') return { latitude: tags.GPSLatitude * (tags.GPSLatitudeRef === 'S' ? -1 : 1), longitude: tags.GPSLongitude * (tags.GPSLongitudeRef === 'W' ? -1 : 1) };
    } catch { return null; }
    return null;
  }
  return new Promise((resolve) => {
    const child = spawn('ffprobe', ['-v', 'quiet', '-show_entries', 'format_tags=location:stream_tags=location', '-of', 'default=noprint_wrappers=1:nokey=1', filePath]);
    let output = '';
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.on('close', () => resolve(parseLocation(output.trim())));
    child.on('error', () => resolve(null));
  });
}

async function runInference(imagePath: string): Promise<InferenceResult> {
  await mkdir(uploadDir, { recursive: true });
  return new Promise((resolve, reject) => {
    const localPython = path.resolve(__dirname, '../../.venv/bin/python');
    const child = spawn(process.env.PYTHON_BIN || (existsSync(localPython) ? localPython : 'python3'), [
      path.resolve(__dirname, '../../../ml/inference.py'),
      imagePath,
      uploadDir,
      process.env.YOLO_MODEL_PATH || path.resolve(__dirname, '../../../ml/yolov11_flood.pt'),
    ]);
    let output = '';
    let error = '';
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { error += chunk.toString(); });
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(error || `Inference exited with code ${code}`));
      try { return resolve(JSON.parse(output) as InferenceResult); } catch { return reject(new Error('Inference service returned invalid JSON')); }
    });
  });
}

function floodMetrics(detections: Detection[]) {
  const flood = detections.filter((d) => /flood|water|inundat/i.test(d.class));
  const coveragePercentage = Math.min(100, flood.reduce((total, d) => total + Math.max(0, d.bbox[2] * d.bbox[3]), 0) * 100);
  const severity = coveragePercentage <= 20 ? 'LOW' : coveragePercentage <= 50 ? 'MODERATE' : coveragePercentage <= 75 ? 'HIGH' : 'CRITICAL';
  const centers = flood.map((d) => ({ x: d.bbox[0] + d.bbox[2] / 2, y: d.bbox[1] + d.bbox[3] / 2 }));
  const direction = centers.length ? (centers.reduce((sum, point) => sum + point.x, 0) / centers.length > 0.5 ? 'EAST' : 'WEST') : 'UNKNOWN';
  return { coveragePercentage, severity, direction, floodDetections: flood };
}

function assetUrl(filePath?: string | null) {
  return filePath ? `/uploads/${path.relative(uploadDir, filePath).split(path.sep).join('/')}` : '';
}

async function affectedSettlements(detections: Detection[]) {
  const settlements = await store.settlement.findMany();
  const floodBoxes = detections.filter((d) => /flood|water|inundat/i.test(d.class)).map((d) => d.bbox);
  if (!floodBoxes.length || !settlements.length) return [];
  const latitudes = settlements.map((item) => item.latitude);
  const longitudes = settlements.map((item) => item.longitude);
  const minLat = Math.min(...latitudes); const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes); const maxLon = Math.max(...longitudes);
  return settlements.filter((item) => {
    const x = (item.longitude - minLon) / (maxLon - minLon || 1);
    const y = (item.latitude - minLat) / (maxLat - minLat || 1);
    return floodBoxes.some(([left, top, width, height]) => x >= left && x <= left + width && y >= top && y <= top + height);
  }).map((item) => ({ ...item, overlapPercentage: 100, severity: 'CRITICAL', evacuationPriority: 'IMMEDIATE' }));
}

async function latestSnapshot() {
  const snapshot = await store.floodSnapshot.findFirst({ orderBy: { recordedAt: 'desc' } });
  if (!snapshot) return null;
  const previous = await store.floodSnapshot.findFirst({ where: { recordedAt: { lt: snapshot.recordedAt } }, orderBy: { recordedAt: 'desc' } });
  return { ...snapshot, imagePath: assetUrl(snapshot.imagePath), annotatedImagePath: assetUrl(snapshot.annotatedImagePath), floodMaskImagePath: assetUrl(snapshot.floodMaskImagePath), spreadTrend: previous ? (snapshot.coveragePercentage > previous.coveragePercentage ? 'INCREASING' : snapshot.coveragePercentage < previous.coveragePercentage ? 'DECREASING' : 'STABLE') : 'UNKNOWN', detections: JSON.parse(snapshot.detectionsJson) as Detection[] };
}

async function createResponsePlan(snapshotId: string, coveragePercentage: number, severity: string, settlements: number, blockedRoads: number, affectedHospitals: number) {
  const actions = [
    ...(severity === 'CRITICAL' ? ['Flood-affected areas appear significant in the surveyed imagery and may warrant authority review.'] : []),
    ...(blockedRoads > 0 ? ['Road access appears partially restricted in surveyed sections; alternate routes may require field verification.'] : []),
    ...(affectedHospitals > 0 ? ['Hospital assets appear within highlighted areas and may require inspection by responsible authorities.'] : []),
    ...(settlements > 0 ? ['Settlement clusters appear within highlighted areas; field verification may be prioritized.'] : []),
  ];
  const resources = { rescueTeams: Math.max(1, Math.ceil(settlements / 3)), boats: Math.max(1, Math.ceil(coveragePercentage / 20)), medicalKits: settlements * 25, foodPackets: settlements * 100 };
  return store.responsePlan.create({ data: { snapshotId, priority: severity, actionsJson: JSON.stringify(actions), resourcesJson: JSON.stringify(resources) } });
}

router.post('/analysis/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return errorResponse(res, 'A JPG, JPEG, or supported video file is required', 400);
  try {
    const result = await runInference(req.file.path);
    const metrics = floodMetrics(result.detections || []);
    const previous = await store.floodSnapshot.findFirst({ orderBy: { recordedAt: 'desc' } });
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video/' : 'image/';
    const coordinates = await extractMediaCoordinates(req.file.path, mediaType);
    const snapshot = await store.floodSnapshot.create({ data: { imagePath: req.file.path, mediaType: result.mediaType || (mediaType === 'video/' ? 'VIDEO' : 'IMAGE'), framesProcessed: result.framesProcessed || 1, latitude: coordinates?.latitude ?? null, longitude: coordinates?.longitude ?? null, annotatedImagePath: result.annotatedImage, floodMaskImagePath: result.floodMaskImage, coveragePercentage: metrics.coveragePercentage, severity: metrics.severity, floodAreaSqKm: 0, spreadTrend: previous ? (metrics.coveragePercentage > previous.coveragePercentage ? 'INCREASING' : metrics.coveragePercentage < previous.coveragePercentage ? 'DECREASING' : 'STABLE') : 'UNKNOWN', direction: metrics.direction, detectionsJson: JSON.stringify(result.detections) } });
    const [settlements, blockedRoads, hospitals] = await Promise.all([affectedSettlements(result.detections), store.roadRoute.count({ where: { status: 'BLOCKED' } }), store.infrastructureAsset.count({ where: { type: 'HOSPITAL', status: { in: ['AT RISK', 'DAMAGED'] } } })]);
    const plan = await createResponsePlan(snapshot.id, metrics.coveragePercentage, metrics.severity, settlements.length, blockedRoads, hospitals);
    return res.status(201).json({ success: true, data: { snapshotId: snapshot.id, responsePlanId: plan.id, mediaType: snapshot.mediaType, framesProcessed: snapshot.framesProcessed, latitude: snapshot.latitude, longitude: snapshot.longitude, coveragePercentage: metrics.coveragePercentage, severity: metrics.severity, direction: metrics.direction, trend: snapshot.spreadTrend, annotatedImage: assetUrl(result.annotatedImage), floodMaskImage: assetUrl(result.floodMaskImage), detections: result.detections } });
  } catch (error) { await unlink(req.file.path).catch(() => undefined); return errorResponse(res, error, 422); }
});

router.get('/analysis/latest', async (_req, res) => { const snapshot = await latestSnapshot(); if (!snapshot) return errorResponse(res, 'No image assessment has been completed', 404); return res.json({ success: true, data: snapshot }); });
router.get('/assessment/flood', async (_req, res) => { const snapshot = await latestSnapshot(); if (!snapshot) return errorResponse(res, 'No flood assessment available', 404); return res.json({ success: true, data: { coveragePercentage: snapshot.coveragePercentage, severity: snapshot.severity, direction: snapshot.direction, trend: snapshot.spreadTrend, floodAreaSqKm: snapshot.floodAreaSqKm, annotatedImage: snapshot.annotatedImagePath || '', floodMaskImage: snapshot.floodMaskImagePath || '' } }); });
router.get('/assessment/settlements', async (_req, res) => { const snapshot = await latestSnapshot(); const settlements = snapshot ? await affectedSettlements(snapshot.detections) : []; return res.json({ success: true, data: { observedCount: settlements.length, criticalAttention: settlements.filter((item) => item.severity === 'CRITICAL').length, highAttention: settlements.filter((item) => item.severity === 'HIGH').length, moderateAttention: settlements.filter((item) => item.severity === 'MODERATE').length, settlements } }); });
router.get('/assessment/roads', async (_req, res) => { const roads = await store.roadRoute.findMany(); const open = roads.filter((item) => item.status === 'OPEN').length; const blocked = roads.filter((item) => item.status === 'BLOCKED').length; const submerged = roads.filter((item) => item.status === 'SUBMERGED').length; return res.json({ success: true, data: { roads, openRoads: open, blockedRoads: blocked, submergedRoads: submerged, accessibilityPercentage: roads.length ? (open / roads.length) * 100 : 0, blockedPercentage: roads.length ? (blocked / roads.length) * 100 : 0, submergedPercentage: roads.length ? (submerged / roads.length) * 100 : 0 } }); });
router.get('/assessment/infrastructure', async (_req, res) => { const assets = await store.infrastructureAsset.findMany(); return res.json({ success: true, data: { assets, accessible: assets.filter((item) => item.status === 'SAFE').length, atRisk: assets.filter((item) => item.status === 'AT RISK').length, flooded: assets.filter((item) => item.status === 'DAMAGED').length } }); });
router.get('/assessment/response-plan', async (_req, res) => { const plan = await store.responsePlan.findFirst({ orderBy: { createdAt: 'desc' } }); if (!plan) return errorResponse(res, 'No response support notes available', 404); return res.json({ success: true, data: { ...plan, actions: JSON.parse(plan.actionsJson), resources: JSON.parse(plan.resourcesJson) } }); });

router.get('/report/download', async (_req, res) => { try { const snapshot = await latestSnapshot(); if (!snapshot) return errorResponse(res, 'No assessment available for report generation', 404); const [settlements, roads, assets, plan] = await Promise.all([store.settlement.findMany(), store.roadRoute.findMany(), store.infrastructureAsset.findMany(), store.responsePlan.findFirst({ orderBy: { createdAt: 'desc' } })]); const reportId = `SG-${Date.now()}`; const lines = ['SKY GUARDIANS', 'Drone-Assisted Flood Impact Assessment Report', `Generated Date: ${new Date().toISOString()}`, 'Location: Surveyed drone area', `Report ID: ${reportId}`, '', 'SECTION 1 - FLOOD ASSESSMENT', `Water Coverage: ${snapshot.coveragePercentage.toFixed(2)}%`, `Flood Severity: ${snapshot.severity}`, `Spread Direction: ${snapshot.direction}`, `Change Trend: ${snapshot.spreadTrend}`, '', 'SECTION 2 - AFFECTED SETTLEMENTS', `Settlements Observed: ${settlements.length}`, ...settlements.map((item) => `${item.name} | Attention: ${item.severity}`), '', 'SECTION 3 - ROAD ACCESSIBILITY', `Accessible: ${roads.filter((item) => item.status === 'OPEN').length}`, `Partially Affected: ${roads.filter((item) => item.status === 'BLOCKED').length}`, `Submerged: ${roads.filter((item) => item.status === 'SUBMERGED').length}`, '', 'SECTION 4 - INFRASTRUCTURE ASSESSMENT', ...assets.map((item) => `${item.asset} | ${item.type} | ${item.status}`), '', 'SECTION 5 - RESPONSE SUPPORT NOTES', ...(plan ? JSON.parse(plan.actionsJson) : ['No response support notes are available.']), '', 'SECTION 6 - AI ANALYSIS', `Objects Observed: ${snapshot.detections.length}`, ...snapshot.detections.map((item) => `${item.class} | confidence ${item.confidence.toFixed(3)}`), `Annotated Drone Survey Image: ${snapshot.annotatedImagePath || 'not returned by inference'}`, '', 'This report summarizes observations derived from drone imagery and automated image-analysis tools.', 'The report is intended to support disaster-management authorities in reducing manual survey effort and improving situational awareness.', 'Final operational decisions remain the responsibility of relevant government and disaster-management agencies.']; const filePath = path.join(uploadDir, `${reportId}.pdf`); await writeFile(filePath, buildPdf(lines)); await store.assessmentReport.create({ data: { eventId: reportId, surveyArea: 'Surveyed drone area', overallRisk: snapshot.severity, parametersJson: JSON.stringify({ snapshot, settlements, roads, assets, plan }), pdfPath: filePath } }); res.type('application/pdf').setHeader('Content-Disposition', `attachment; filename="${reportId}.pdf"`); return res.send(await readFile(filePath)); } catch (error) { return errorResponse(res, error); } });

function pdfEscape(value: string) { return value.replace(/[()\\]/g, '\\$&').replace(/[^\x20-\x7E]/g, ''); }
function buildPdf(lines: string[]) { const commands = ['BT', '/F1 10 Tf', '50 780 Td', ...lines.flatMap((line) => [`(${pdfEscape(line)}) Tj`, '0 -15 Td']), 'ET'].join('\n'); const objects = [`<< /Type /Catalog /Pages 2 0 R >>`, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${Buffer.byteLength(commands)} >>\nstream\n${commands}\nendstream`]; let pdf = '%PDF-1.4\n'; const offsets = [0]; objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const xref = Buffer.byteLength(pdf); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`; return Buffer.from(pdf); }

router.get('/report/download', async (_req, res) => { try { const snapshot = await latestSnapshot(); if (!snapshot) return errorResponse(res, 'No assessment available for report generation', 404); const [settlements, roads, assets, plan] = await Promise.all([store.settlement.findMany(), store.roadRoute.findMany(), store.infrastructureAsset.findMany(), store.responsePlan.findFirst({ orderBy: { createdAt: 'desc' } })]); const reportId = `SG-${Date.now()}`; const lines = ['SKY GUARDIANS', 'Drone-Assisted Flood Impact Assessment Report', `Generated Date: ${new Date().toISOString()}`, 'Location: Assessment area', `Report ID: ${reportId}`, '', 'SECTION 1 - FLOOD ASSESSMENT', `Flood Coverage: ${snapshot.coveragePercentage.toFixed(2)}%`, `Flood Severity: ${snapshot.severity}`, `Spread Direction: ${snapshot.direction}`, `Trend: ${snapshot.spreadTrend}`, '', 'SECTION 2 - AFFECTED SETTLEMENTS', `Population Affected: ${settlements.reduce((sum, item) => sum + item.population, 0)}`, ...settlements.map((item) => `${item.name} | ${item.severity} | ${item.population}`), '', 'SECTION 3 - ROAD ACCESSIBILITY', `Open: ${roads.filter((item) => item.status === 'OPEN').length}`, `Blocked: ${roads.filter((item) => item.status === 'BLOCKED').length}`, `Submerged: ${roads.filter((item) => item.status === 'SUBMERGED').length}`, `Accessibility: ${roads.length ? ((roads.filter((item) => item.status === 'OPEN').length / roads.length) * 100).toFixed(2) : '0.00'}%`, '', 'SECTION 4 - INFRASTRUCTURE IMPACT', ...assets.map((item) => `${item.asset} | ${item.type} | ${item.status} | confidence ${item.confidence}`), '', 'SECTION 5 - RESPONSE PLAN', `Priority: ${plan?.priority || snapshot.severity}`, ...(plan ? JSON.parse(plan.actionsJson) : []), ...(plan ? [`Resources: ${plan.resourcesJson}`] : []), '', 'SECTION 6 - AI ANALYSIS', `Detection count: ${snapshot.detections.length}`, ...snapshot.detections.map((item) => `${item.class} | confidence ${item.confidence.toFixed(3)}`), `Annotated image: ${snapshot.annotatedImagePath || 'not returned by inference'}`, '', 'Generated automatically using drone imagery and AI-assisted flood assessment.']; const filePath = path.join(uploadDir, `${reportId}.pdf`); await writeFile(filePath, buildPdf(lines)); await store.assessmentReport.create({ data: { eventId: reportId, surveyArea: 'Assessment area', overallRisk: snapshot.severity, parametersJson: JSON.stringify({ snapshot, settlements, roads, assets, plan }), pdfPath: filePath } }); res.type('application/pdf').setHeader('Content-Disposition', `attachment; filename="${reportId}.pdf"`); return res.send(await readFile(filePath)); } catch (error) { return errorResponse(res, error); } });

export default router;
