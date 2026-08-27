import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

type Snapshot = {
  id: string;
  recordedAt: Date;
  imagePath: string;
  mediaType: string;
  framesProcessed: number;
  latitude: number | null;
  longitude: number | null;
  annotatedImagePath?: string | null;
  floodMaskImagePath?: string | null;
  coveragePercentage: number;
  severity: string;
  floodAreaSqKm: number;
  spreadTrend: string;
  direction: string;
  detectionsJson: string;
};
type Settlement = { id: string; name: string; population: number; latitude: number; longitude: number; severity: string; evacuationPriority: string };
type RoadRoute = { id: string; name: string; status: string; alternativeRoute?: string | null; geometryJson?: string | null };
type InfrastructureAsset = { id: string; asset: string; type: string; status: string; confidence: number; latitude: number; longitude: number };
type ResponsePlan = { id: string; createdAt: Date; priority: string; actionsJson: string; resourcesJson: string; snapshotId: string };
type AssessmentReport = { id: string; eventId: string; generatedAt: Date; surveyArea: string; overallRisk: string; parametersJson: string; pdfPath?: string | null };
type StoreData = { floodSnapshots: Snapshot[]; settlements: Settlement[]; roadRoutes: RoadRoute[]; infrastructureAssets: InfrastructureAsset[]; responsePlans: ResponsePlan[]; assessmentReports: AssessmentReport[] };

const storePath = path.resolve(process.env.DATA_STORE_PATH || 'data/assessment-store.json');
const emptyStore: StoreData = { floodSnapshots: [], settlements: [], roadRoutes: [], infrastructureAssets: [], responsePlans: [], assessmentReports: [] };
let writeQueue = Promise.resolve();

function revive(data: StoreData): StoreData {
  return { ...emptyStore, ...data, floodSnapshots: (data.floodSnapshots || []).map((item) => ({ ...item, recordedAt: new Date(item.recordedAt) })), responsePlans: (data.responsePlans || []).map((item) => ({ ...item, createdAt: new Date(item.createdAt) })), assessmentReports: (data.assessmentReports || []).map((item) => ({ ...item, generatedAt: new Date(item.generatedAt) })) };
}
async function readStore(): Promise<StoreData> {
  if (!existsSync(storePath)) return { ...emptyStore };
  return revive(JSON.parse(await readFile(storePath, 'utf8')) as StoreData);
}
async function saveStore(data: StoreData) {
  await mkdir(path.dirname(storePath), { recursive: true });
  writeQueue = writeQueue.then(() => writeFile(storePath, JSON.stringify(data, null, 2)));
  await writeQueue;
}
function newest<T extends { recordedAt?: Date; createdAt?: Date }>(items: T[], before?: Date): T | null {
  return items.filter((item) => !before || (item.recordedAt || item.createdAt)! < before).sort((a, b) => Number((b.recordedAt || b.createdAt)) - Number((a.recordedAt || a.createdAt)))[0] || null;
}

export const store = {
  floodSnapshot: {
    findFirst: async (options?: { where?: { recordedAt?: { lt: Date } }; orderBy?: unknown }) => newest((await readStore()).floodSnapshots, options?.where?.recordedAt?.lt),
    create: async ({ data }: { data: Omit<Snapshot, 'id' | 'recordedAt'> & Partial<Pick<Snapshot, 'recordedAt'>> }) => { const current = await readStore(); const item = { ...data, id: randomUUID(), recordedAt: data.recordedAt || new Date() }; current.floodSnapshots.push(item); await saveStore(current); return item; },
  },
  settlement: { findMany: async (_options?: unknown) => (await readStore()).settlements },
  roadRoute: {
    findMany: async (_options?: unknown) => (await readStore()).roadRoutes,
    count: async ({ where }: { where?: { status?: string } }) => (await readStore()).roadRoutes.filter((item) => !where?.status || item.status === where.status).length,
  },
  infrastructureAsset: {
    findMany: async (_options?: unknown) => (await readStore()).infrastructureAssets,
    count: async ({ where }: { where?: { type?: string; status?: { in: string[] } } }) => (await readStore()).infrastructureAssets.filter((item) => (!where?.type || item.type === where.type) && (!where?.status?.in || where.status.in.includes(item.status))).length,
  },
  responsePlan: {
    findFirst: async (_options?: unknown) => newest((await readStore()).responsePlans.map((item) => ({ ...item, recordedAt: item.createdAt }))),
    create: async ({ data }: { data: Omit<ResponsePlan, 'id' | 'createdAt'> & Partial<Pick<ResponsePlan, 'createdAt'>> }) => { const current = await readStore(); const item = { ...data, id: randomUUID(), createdAt: data.createdAt || new Date() }; current.responsePlans.push(item); await saveStore(current); return item; },
  },
  assessmentReport: {
    create: async ({ data }: { data: Omit<AssessmentReport, 'id' | 'generatedAt'> & Partial<Pick<AssessmentReport, 'generatedAt'>> }) => { const current = await readStore(); const item = { ...data, id: randomUUID(), generatedAt: data.generatedAt || new Date() }; current.assessmentReports.push(item); await saveStore(current); return item; },
  },
};

export async function clearStore() { await saveStore({ ...emptyStore }); }
