import { API_BASE_URL } from './config';

export interface Detection {
  class: string;
  confidence: number;
  bbox: number[];
}

export interface FloodAssessment {
  coveragePercentage: number;
  severity: string;
  direction: string;
  trend: string;
  floodAreaSqKm: number;
  annotatedImage: string;
  floodMaskImage: string;
}

export interface SettlementAssessment {
  observedCount: number;
  criticalAttention: number;
  highAttention: number;
  moderateAttention: number;
  settlements: Array<{ id: string; name: string; population: number; latitude: number; longitude: number; severity: string; evacuationPriority: string }>;
}

export interface RoadAssessment {
  openRoads: number;
  blockedRoads: number;
  submergedRoads: number;
  accessibilityPercentage: number;
  blockedPercentage: number;
  submergedPercentage: number;
  roads: Array<{ id: string; name: string; status: string; alternativeRoute?: string | null; geometryJson?: string | null }>;
}

export interface InfrastructureAssessment {
  accessible: number;
  atRisk: number;
  flooded: number;
  assets: Array<{ id: string; asset: string; type: string; status: string; confidence: number }>;
}

export interface ResponsePlan {
  priority: string;
  actions: string[];
  resources: Record<string, number>;
}

export interface LatestAssessment {
  imagePath: string;
  mediaType: 'IMAGE' | 'VIDEO';
  framesProcessed: number;
  latitude: number | null;
  longitude: number | null;
  annotatedImagePath: string;
  floodMaskImagePath: string;
  detections: Detection[];
  recordedAt: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || `Request failed: ${response.status}`);
  return body.data as T;
}

export function getFloodAssessment() { return request<FloodAssessment>('/assessment/flood'); }
export function getSettlementAssessment() { return request<SettlementAssessment>('/assessment/settlements'); }
export function getRoadAssessment() { return request<RoadAssessment>('/assessment/roads'); }
export function getInfrastructureAssessment() { return request<InfrastructureAssessment>('/assessment/infrastructure'); }
export function getResponsePlan() { return request<ResponsePlan>('/assessment/response-plan'); }
export function getLatestAssessment() { return request<LatestAssessment>('/analysis/latest'); }

export function assetUrl(assetPath: string) {
  if (!assetPath) return '';
  if (assetPath.startsWith('http')) return assetPath;
  return `${API_BASE_URL.replace(/\/api\/v1$/, '')}${assetPath}`;
}

export async function uploadDroneImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  return request<{ snapshotId: string; responsePlanId: string; coveragePercentage: number; severity: string; direction: string; trend: string; detections: Detection[] }>('/analysis/upload', { method: 'POST', body: form });
}

export async function uploadDroneSurvey(file: File, latitude?: string, longitude?: string) {
  const form = new FormData();
  form.append('image', file);
  if (latitude) form.append('latitude', latitude);
  if (longitude) form.append('longitude', longitude);
  return request<{ snapshotId: string; responsePlanId: string; mediaType: 'IMAGE' | 'VIDEO'; framesProcessed: number; latitude: number | null; longitude: number | null; coveragePercentage: number; severity: string; direction: string; trend: string; detections: Detection[] }>('/analysis/upload', { method: 'POST', body: form });
}

export async function downloadReport() {
  const response = await fetch(`${API_BASE_URL}/report/download`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Report generation failed: ${response.status}`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)/)?.[1] || 'sky-guardians-assessment.pdf';
  link.click();
  URL.revokeObjectURL(url);
}
