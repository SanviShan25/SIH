import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/units
router.get('/', async (req: Request, res: Response) => {
  try {
    const units = await prisma.fieldUnit.findMany({
      orderBy: { id: 'asc' },
    });

    const activeCount = units.filter((u) => u.status === 'En Route' || u.status === 'On Site').length;

    return sendSuccess(res, { units, activeDeployed: activeCount }, 'Field units retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch field units', 500, error);
  }
});

// POST /api/v1/units (Deploy new unit)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, type, location, status, personnel, assignedIncidentId } = req.body;

    const unitCount = await prisma.fieldUnit.count();
    const newId = `U-0${unitCount + 1}`;

    const newUnit = await prisma.fieldUnit.create({
      data: {
        id: req.body.id || newId,
        name: name || 'Special Response Squad',
        type: type || 'Swiftwater Rescue Team',
        location: location || 'Sector 12 Command',
        status: status || 'En Route',
        personnel: Number(personnel || 6),
        assignedIncidentId: assignedIncidentId || null,
      },
    });

    SocketManager.emitEvent('unit:deployed', newUnit);

    return sendSuccess(res, newUnit, 'New field unit deployed successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to deploy field unit', 500, error);
  }
});

// PUT /api/v1/units/:id/status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, location, assignedIncidentId } = req.body;

    const updated = await prisma.fieldUnit.update({
      where: { id },
      data: {
        status: status || undefined,
        location: location || undefined,
        assignedIncidentId: assignedIncidentId !== undefined ? assignedIncidentId : undefined,
      },
    });

    SocketManager.emitEvent('unit:updated', updated);

    return sendSuccess(res, updated, 'Unit status updated');
  } catch (error) {
    return sendError(res, 'Failed to update unit status', 500, error);
  }
});

export default router;
