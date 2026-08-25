import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/roads
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { category: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const routes = await prisma.roadRoute.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const openCount = routes.filter((r) => r.status === 'Open').length;
    const partialCount = routes.filter((r) => r.status === 'Partially Affected').length;
    const submergedCount = routes.filter((r) => r.status === 'Submerged').length;
    const blockedCount = routes.filter((r) => r.status === 'Blocked').length;

    const overallPercentage = routes.length > 0
      ? Math.round(((openCount + partialCount * 0.5) / routes.length) * 100)
      : 62;

    const responsePayload = {
      routes,
      metrics: {
        overallPercentage,
        totalTracked: routes.length,
        openRoads: openCount,
        partiallyAffected: partialCount,
        submergedRoads: submergedCount,
        blockedRoads: blockedCount,
      },
    };

    return sendSuccess(res, responsePayload, 'Road routes and accessibility metrics retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch road routes', 500, error);
  }
});

// GET /api/v1/roads/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = await prisma.roadRoute.findUnique({
      where: { id },
    });

    if (!route) {
      return sendError(res, 'Road route not found', 404);
    }

    return sendSuccess(res, route, 'Road route retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch road route', 500, error);
  }
});

// PUT /api/v1/roads/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.roadRoute.update({
      where: { id },
      data: req.body,
    });

    SocketManager.emitEvent('road:updated', updated);

    return sendSuccess(res, updated, 'Road accessibility updated');
  } catch (error) {
    return sendError(res, 'Failed to update road route', 500, error);
  }
});

// POST /api/v1/roads
router.post('/', async (req: Request, res: Response) => {
  try {
    const newRoute = await prisma.roadRoute.create({
      data: req.body,
    });

    SocketManager.emitEvent('road:created', newRoute);

    return sendSuccess(res, newRoute, 'New route added successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to add route', 500, error);
  }
});

export default router;
