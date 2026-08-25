import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// GET /api/v1/dashboard/summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const [
      latestSnapshot,
      settlements,
      roads,
      infrastructure,
      missions,
      recentAlerts,
    ] = await Promise.all([
      prisma.floodSnapshot.findFirst({
        where: { isForecast: false },
        orderBy: { recordedAt: 'desc' },
      }),
      prisma.settlement.findMany(),
      prisma.roadRoute.findMany(),
      prisma.infrastructureAsset.findMany(),
      prisma.mission.findMany(),
      prisma.alert.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const openRoads = roads.filter((r) => r.status === 'Open').length;
    const partialRoads = roads.filter((r) => r.status === 'Partially Affected').length;
    const submergedRoads = roads.filter((r) => r.status === 'Submerged').length;
    const blockedRoads = roads.filter((r) => r.status === 'Blocked').length;

    const atRiskInfra = infrastructure.filter((i) => i.status === 'Risk Detected').length;
    const floodedInfra = infrastructure.filter((i) => i.status === 'Flood Affected').length;
    const accessibleInfra = infrastructure.filter((i) => i.status === 'Accessible').length;

    const activeDrones = missions.filter((m) => m.status === 'Active').length;
    const standbyDrones = missions.filter((m) => m.status === 'Standby').length;

    const summary = {
      waterSpread: {
        coveragePercentage: latestSnapshot?.waterCoveragePct ?? 68,
        trend: latestSnapshot?.spreadTrend ?? 'Increasing',
        direction: latestSnapshot?.spreadDirection ?? 'South-East',
        changeSincePreviousSurvey: latestSnapshot?.changeRate ?? '+13%',
        peakHeight: latestSnapshot?.peakHeight ?? '3.2m',
        flowVelocity: latestSnapshot?.flowVelocity ?? '1.8 m/s',
      },
      settlements: {
        totalCount: settlements.length,
        inundatedCount: settlements.filter((s) => s.status === 'Flood Affected' || s.status === 'Partially Submerged').length,
        summaryList: settlements.map((s) => ({ id: s.id, name: s.name, status: s.status })),
      },
      roadAccessibility: {
        overallPercentage: latestSnapshot?.roadAccessibilityPct ?? 62,
        totalTracked: roads.length,
        openRoads,
        partiallyAffected: partialRoads,
        submergedRoads,
        blockedRoads,
      },
      infrastructureImpact: {
        totalTracked: infrastructure.length,
        atRisk: atRiskInfra,
        flooded: floodedInfra,
        accessible: accessibleInfra,
      },
      dronesAvailable: {
        total: missions.length,
        active: activeDrones,
        standby: standbyDrones,
        fleet: missions.map((m) => ({ droneId: m.droneId, status: m.status, battery: m.batteryPct })),
      },
      recentAlerts: recentAlerts.map((a) => ({
        id: a.id,
        title: a.title,
        severity: a.severity,
        area: a.area,
        time: a.time,
        body: a.body,
      })),
    };

    return sendSuccess(res, summary, 'Operational dashboard summary retrieved successfully');
  } catch (error) {
    return sendError(res, 'Failed to fetch dashboard summary', 500, error);
  }
});

export default router;
