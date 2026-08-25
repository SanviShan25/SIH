import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/water-coverage/summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const latestSnapshot = await prisma.floodSnapshot.findFirst({
      where: { isForecast: false },
      orderBy: { recordedAt: 'desc' },
    });

    const zones = await prisma.inundationZone.findMany();

    const data = {
      coveragePercentage: latestSnapshot?.waterCoveragePct ?? 68,
      trend: latestSnapshot?.spreadTrend ?? 'Increasing',
      direction: latestSnapshot?.spreadDirection ?? 'South-East',
      changeSincePreviousSurvey: latestSnapshot?.changeRate ?? '+13%',
      peakHeight: latestSnapshot?.peakHeight ?? '3.2m',
      flowVelocity: latestSnapshot?.flowVelocity ?? '1.8 m/s',
      zonesCount: zones.length,
      criticalZonesCount: zones.filter((z) => z.riskLevel === 'High').length,
    };

    return sendSuccess(res, data, 'Water coverage summary retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch water coverage summary', 500, error);
  }
});

// GET /api/v1/water-coverage/zones
router.get('/zones', async (req: Request, res: Response) => {
  try {
    const { riskLevel } = req.query;
    const where: any = {};
    if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'All') {
      where.riskLevel = riskLevel;
    }

    const zones = await prisma.inundationZone.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    return sendSuccess(res, zones, 'Inundation catchment zones retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch inundation zones', 500, error);
  }
});

// GET /api/v1/water-coverage/timeline
router.get('/timeline', async (req: Request, res: Response) => {
  try {
    const snapshots = await prisma.floodSnapshot.findMany({
      orderBy: { recordedAt: 'asc' },
    });

    return sendSuccess(res, snapshots, 'Hydrological progression timeline retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch timeline', 500, error);
  }
});

// POST /api/v1/water-coverage/snapshot (Create new survey snapshot)
router.post('/snapshot', async (req: Request, res: Response) => {
  try {
    const {
      timeLabel,
      waterCoveragePct,
      spreadTrend,
      spreadDirection,
      changeRate,
      flowVelocity,
      peakHeight,
      affectedSettlementsCount,
      roadAccessibilityPct,
      openRoadsCount,
      submergedRoadsCount,
      isForecast,
    } = req.body;

    const newSnapshot = await prisma.floodSnapshot.create({
      data: {
        timeLabel: timeLabel || 'Latest Survey',
        waterCoveragePct: Number(waterCoveragePct),
        spreadTrend: spreadTrend || 'Increasing',
        spreadDirection: spreadDirection || 'South-East',
        changeRate: changeRate || '+5%',
        flowVelocity: flowVelocity || '1.8 m/s',
        peakHeight: peakHeight || '3.2m',
        affectedSettlementsCount: Number(affectedSettlementsCount || 5),
        roadAccessibilityPct: Number(roadAccessibilityPct || 62),
        openRoadsCount: Number(openRoadsCount || 12),
        submergedRoadsCount: Number(submergedRoadsCount || 3),
        isForecast: Boolean(isForecast),
      },
    });

    // Notify clients via WebSocket
    SocketManager.emitEvent('flood:snapshot-update', newSnapshot);

    return sendSuccess(res, newSnapshot, 'Hydrological snapshot recorded successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to record hydrology snapshot', 500, error);
  }
});

export default router;
