import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/camps
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && typeof status === 'string' && status !== 'All' && status !== 'all') {
      where.status = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const camps = await prisma.reliefCamp.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const totalOccupancy = camps.reduce((sum, c) => sum + c.occupancy, 0);
    const totalCapacity = camps.reduce((sum, c) => sum + c.capacity, 0);
    const criticalCampsCount = camps.filter((c) => c.status === 'Critical' || c.foodCritical || c.waterCritical).length;

    return sendSuccess(res, {
      camps,
      metrics: {
        totalCamps: camps.length,
        totalOccupancy,
        totalCapacity,
        capacityUtilizationPct: Math.round((totalOccupancy / (totalCapacity || 1)) * 100),
        criticalCampsCount,
      },
    }, 'Relief camps retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch relief camps', 500, error);
  }
});

// GET /api/v1/camps/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const camp = await prisma.reliefCamp.findUnique({
      where: { id },
    });

    if (!camp) {
      return sendError(res, 'Relief camp not found', 404);
    }

    return sendSuccess(res, camp, 'Relief camp detail retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch relief camp', 500, error);
  }
});

// PUT /api/v1/camps/:id (Updates supplies and checks critical thresholds)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { occupancy, capacity, foodDays, waterDays, medsStatus, personnel } = req.body;

    const foodDaysNum = parseInt(foodDays || '5', 10);
    const waterDaysNum = parseInt(waterDays || '5', 10);
    const foodCritical = foodDaysNum <= 2;
    const waterCritical = waterDaysNum <= 2;
    const isCritical = foodCritical || waterCritical || (occupancy && capacity && (occupancy / capacity) >= 0.9);

    const updated = await prisma.reliefCamp.update({
      where: { id },
      data: {
        occupancy: occupancy !== undefined ? Number(occupancy) : undefined,
        capacity: capacity !== undefined ? Number(capacity) : undefined,
        foodDays: foodDays !== undefined ? foodDays : undefined,
        foodCritical,
        waterDays: waterDays !== undefined ? waterDays : undefined,
        waterCritical,
        status: isCritical ? 'Critical' : 'Stable',
        medsStatus: medsStatus || undefined,
        personnel: personnel !== undefined ? Number(personnel) : undefined,
      },
    });

    SocketManager.emitEvent('camp:status-change', updated);

    return sendSuccess(res, updated, 'Relief camp supplies updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update relief camp', 500, error);
  }
});

// POST /api/v1/camps
router.post('/', async (req: Request, res: Response) => {
  try {
    const count = await prisma.reliefCamp.count();
    const newCamp = await prisma.reliefCamp.create({
      data: {
        id: req.body.id || `camp-${count + 1}`,
        name: req.body.name || 'Emergency Relief Shelter',
        location: req.body.location || 'Sector 12 Zone',
        status: req.body.status || 'Stable',
        occupancy: Number(req.body.occupancy || 0),
        capacity: Number(req.body.capacity || 500),
        foodDays: req.body.foodDays || '7 Days',
        waterDays: req.body.waterDays || '7 Days',
        medsStatus: req.body.medsStatus || 'Ok',
        personnel: Number(req.body.personnel || 10),
      },
    });

    SocketManager.emitEvent('camp:created', newCamp);

    return sendSuccess(res, newCamp, 'Relief camp registered successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to register relief camp', 500, error);
  }
});

export default router;
