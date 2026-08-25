import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// GET /api/v1/flood-analysis/timeline
router.get('/timeline', async (req: Request, res: Response) => {
  try {
    const snapshots = await prisma.floodSnapshot.findMany({
      orderBy: { recordedAt: 'asc' },
    });

    const timeline = snapshots.map((s) => ({
      time: s.timeLabel,
      waterCoverage: s.waterCoveragePct,
      spreadTrend: s.spreadTrend,
      spreadDirection: s.spreadDirection,
      changeRate: s.changeRate,
      affectedSettlements: s.affectedSettlementsCount,
      roadAccessibility: s.roadAccessibilityPct,
      openRoads: s.openRoadsCount,
      submergedRoads: s.submergedRoadsCount,
      isForecast: s.isForecast,
    }));

    return sendSuccess(res, timeline, 'Flood impact progression timeline retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch timeline', 500, error);
  }
});

// GET /api/v1/flood-analysis/summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const [currentSnapshot, forecastSnapshot] = await Promise.all([
      prisma.floodSnapshot.findFirst({
        where: { isForecast: false },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.floodSnapshot.findFirst({
        where: { isForecast: true },
        orderBy: { recordedAt: 'desc' },
      }),
    ]);

    const data = {
      waterCoverageTrend: {
        current: currentSnapshot?.waterCoveragePct ?? 68,
        progression: '42% → 55% → 68%',
        changeRate: currentSnapshot?.changeRate ?? '+13%',
        spreadDirection: currentSnapshot?.spreadDirection ?? 'South-East',
      },
      roadAccessibilityEvolution: {
        current: currentSnapshot?.roadAccessibilityPct ?? 62,
        progression: '78% → 70% → 62%',
        breakdown: '12 Open · 2 Blocked · 3 Submerged',
      },
      settlementsInundated: {
        current: currentSnapshot?.affectedSettlementsCount ?? 5,
        progression: '2 → 3 → 5 Settlements',
        affectedZones: 'Sector 12 & Riverside affected',
      },
      forecastProjection: {
        projectedCoverage: forecastSnapshot?.waterCoveragePct ?? 74,
        projectedAccessibility: forecastSnapshot?.roadAccessibilityPct ?? 54,
        projectedSettlements: forecastSnapshot?.affectedSettlementsCount ?? 6,
        timeHorizon: 'Next 4 Hours',
      },
    };

    return sendSuccess(res, data, 'Flood analysis summary retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch analysis summary', 500, error);
  }
});

export default router;
