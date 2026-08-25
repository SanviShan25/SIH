import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// GET /api/v1/map/google-config
router.get('/google-config', (req: Request, res: Response) => {
  return sendSuccess(res, {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDQ9RcBM265XRW3KXJDqecHs2STMk0jvk8',
    defaultCenter: { lat: 28.6139, lng: 77.2090 },
    defaultZoom: 14,
    sector: 'Sector 12 / Lower Basin District',
  }, 'Google Maps configuration retrieved');
});

// GET /api/v1/map/layers (Full layers metadata for interactive toggle mesh)
router.get('/layers', async (req: Request, res: Response) => {
  try {
    const [settlements, roads, infrastructure, missions] = await Promise.all([
      prisma.settlement.findMany(),
      prisma.roadRoute.findMany(),
      prisma.infrastructureAsset.findMany(),
      prisma.mission.findMany({ where: { status: 'Active' } }),
    ]);

    const layersData = {
      floodedAreas: {
        count: 5,
        vector: 'South-East (+13%)',
        criticalZones: ['Sector 12 Embankment', 'Riverside Basin'],
      },
      settlements: settlements.map((s) => ({
        id: s.id,
        name: s.name,
        location: s.location,
        status: s.status,
        coordinates: { top: s.coordTop, left: s.coordLeft, lat: s.latitude, lng: s.longitude },
        population: s.population,
      })),
      roads: roads.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        condition: r.condition,
        clearance: r.clearance,
      })),
      infrastructure: infrastructure.map((i) => ({
        id: i.id,
        name: i.name,
        type: i.type,
        status: i.status,
        detail: i.detail,
        coordinates: { top: i.coordTop, left: i.coordLeft, lat: i.latitude, lng: i.longitude },
      })),
      activeAssets: missions.map((m) => ({
        droneId: m.droneId,
        missionId: m.id,
        battery: m.batteryPct,
        altitude: m.altitudeM,
        coordinates: { lat: m.latitude, lng: m.longitude },
        status: m.status,
      })),
    };

    return sendSuccess(res, layersData, 'Map layers metadata retrieved successfully');
  } catch (error) {
    return sendError(res, 'Failed to fetch map layers', 500, error);
  }
});

// GET /api/v1/map/flood-zones (GeoJSON format)
router.get('/flood-zones', (req: Request, res: Response) => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [77.2050, 28.6180],
              [77.2150, 28.6190],
              [77.2180, 28.6110],
              [77.2080, 28.6080],
              [77.2050, 28.6180],
            ],
          ],
        },
        properties: {
          zoneId: 'ZONE-SEC-12',
          name: 'Sector 12 Primary Flood Basin',
          waterDepthMeters: 1.8,
          riskLevel: 'Critical',
          spreadTrend: 'Increasing South-East',
        },
      },
    ],
  };

  return sendSuccess(res, geojson, 'Flood zone GeoJSON retrieved');
});

export default router;
