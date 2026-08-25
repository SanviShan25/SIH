import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/infrastructure
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, type, search } = req.query;
    const where: any = {};

    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status;
    }

    if (type && typeof type === 'string') {
      where.type = type;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { id: { contains: search } },
        { type: { contains: search } },
      ];
    }

    const facilities = await prisma.infrastructureAsset.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const accessibleCount = facilities.filter((f) => f.status === 'Accessible' || f.status === 'Safe').length;
    const riskCount = facilities.filter((f) => f.status === 'Risk Detected').length;
    const floodedCount = facilities.filter((f) => f.status === 'Flood Affected').length;

    const responsePayload = {
      facilities,
      metrics: {
        totalTracked: facilities.length,
        accessibleCount,
        riskCount,
        floodedCount,
      },
    };

    return sendSuccess(res, responsePayload, 'Infrastructure assets and diagnostics retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch infrastructure assets', 500, error);
  }
});

// GET /api/v1/infrastructure/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await prisma.infrastructureAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return sendError(res, 'Infrastructure asset not found', 404);
    }

    return sendSuccess(res, asset, 'Infrastructure asset retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch infrastructure asset', 500, error);
  }
});

// PUT /api/v1/infrastructure/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.infrastructureAsset.update({
      where: { id },
      data: req.body,
    });

    SocketManager.emitEvent('infrastructure:updated', updated);

    return sendSuccess(res, updated, 'Infrastructure asset updated');
  } catch (error) {
    return sendError(res, 'Failed to update infrastructure asset', 500, error);
  }
});

// POST /api/v1/infrastructure
router.post('/', async (req: Request, res: Response) => {
  try {
    const newAsset = await prisma.infrastructureAsset.create({
      data: req.body,
    });

    SocketManager.emitEvent('infrastructure:created', newAsset);

    return sendSuccess(res, newAsset, 'Infrastructure asset added successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to add infrastructure asset', 500, error);
  }
});

export default router;
