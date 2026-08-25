import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/settlements
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
        { location: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const settlements = await prisma.settlement.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const totalPopulation = settlements.reduce((acc, s) => acc + s.population, 0);
    const totalHouseholds = settlements.reduce((acc, s) => acc + s.households, 0);
    const immediateEvacuationCount = settlements.filter((s) => s.evacuationPriority === 'Immediate').length;

    const responsePayload = {
      settlements,
      metrics: {
        totalSettlements: settlements.length,
        totalPopulation,
        totalHouseholds,
        immediateEvacuationCount,
      },
    };

    return sendSuccess(res, responsePayload, 'Settlements retrieved successfully');
  } catch (error) {
    return sendError(res, 'Failed to fetch settlements', 500, error);
  }
});

// GET /api/v1/settlements/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const settlement = await prisma.settlement.findUnique({
      where: { id },
    });

    if (!settlement) {
      return sendError(res, 'Settlement not found', 404);
    }

    return sendSuccess(res, settlement, 'Settlement retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch settlement', 500, error);
  }
});

// PUT /api/v1/settlements/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.settlement.update({
      where: { id },
      data: req.body,
    });

    SocketManager.emitEvent('settlement:updated', updated);

    return sendSuccess(res, updated, 'Settlement updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update settlement', 500, error);
  }
});

// POST /api/v1/settlements
router.post('/', async (req: Request, res: Response) => {
  try {
    const newSettlement = await prisma.settlement.create({
      data: req.body,
    });

    SocketManager.emitEvent('settlement:created', newSettlement);

    return sendSuccess(res, newSettlement, 'Settlement registered successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to register settlement', 500, error);
  }
});

export default router;
