import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/missions
router.get('/', async (req: Request, res: Response) => {
  try {
    const missions = await prisma.mission.findMany({
      orderBy: { assignedAt: 'desc' },
    });

    return sendSuccess(res, missions, 'Missions retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch missions', 500, error);
  }
});

// GET /api/v1/missions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return sendError(res, 'Mission not found', 404);
    }

    return sendSuccess(res, mission, 'Mission retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch mission', 500, error);
  }
});

// GET /api/v1/missions/:id/telemetry (Telemetry snapshot stub)
router.get('/:id/telemetry', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return sendError(res, 'Mission not found', 404);
    }

    const telemetry = {
      droneId: mission.droneId,
      missionId: mission.id,
      battery: mission.batteryPct,
      altitude: mission.altitudeM,
      speed: mission.speedKmh,
      coordinates: {
        lat: mission.latitude,
        lng: mission.longitude,
      },
      signalQuality: mission.signalQuality,
      flightMode: mission.flightMode,
      timestamp: new Date().toISOString(),
    };

    return sendSuccess(res, telemetry, 'Telemetry snapshot retrieved (Hardware stub)');
  } catch (error) {
    return sendError(res, 'Failed to fetch telemetry', 500, error);
  }
});

// POST /api/v1/missions (Create new mission)
router.post('/', async (req: Request, res: Response) => {
  try {
    const newMission = await prisma.mission.create({
      data: {
        id: req.body.id || `MISSION-DRONE-${Date.now().toString().slice(-3)}`,
        droneId: req.body.droneId || 'DRONE-001',
        targetArea: req.body.targetArea || 'Sector 12 Reconnaissance',
        status: req.body.status || 'Active',
        batteryPct: req.body.batteryPct || 90,
        altitudeM: req.body.altitudeM || 120,
        speedKmh: req.body.speedKmh || 45,
        latitude: req.body.latitude || 28.6139,
        longitude: req.body.longitude || 77.2090,
        signalQuality: req.body.signalQuality || 95,
        flightMode: req.body.flightMode || 'AUTONOMOUS RECON',
      },
    });

    SocketManager.emitEvent('mission:created', newMission);

    return sendSuccess(res, newMission, 'Mission created successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to create mission', 500, error);
  }
});

// PUT /api/v1/missions/:id/status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.mission.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'Completed' ? new Date() : undefined,
      },
    });

    SocketManager.emitEvent('mission:status-change', updated);

    return sendSuccess(res, updated, 'Mission status updated');
  } catch (error) {
    return sendError(res, 'Failed to update mission status', 500, error);
  }
});

export default router;
