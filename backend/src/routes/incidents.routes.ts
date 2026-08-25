import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/incidents (Search, filter, paginate)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, severity, status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (severity && typeof severity === 'string' && severity !== 'All') {
      where.severity = severity;
    }

    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { id: { contains: search } },
        { sector: { contains: search } },
        { type: { contains: search } },
      ];
    }

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.incident.count({ where }),
    ]);

    const activeCount = await prisma.incident.count({ where: { status: 'Under Action' } });
    const criticalCount = await prisma.incident.count({ where: { severity: 'Critical' } });

    return sendSuccess(res, {
      incidents,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
      metrics: {
        activeUnderAction: activeCount,
        criticalSeverity: criticalCount,
      },
    }, 'Incidents retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch incidents', 500, error);
  }
});

// GET /api/v1/incidents/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      return sendError(res, 'Incident not found', 404);
    }

    return sendSuccess(res, incident, 'Incident detail retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch incident', 500, error);
  }
});

// POST /api/v1/incidents
router.post('/', async (req: Request, res: Response) => {
  try {
    const { sector, type, severity, victims, status } = req.body;
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    const id = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-2)}`;

    const newIncident = await prisma.incident.create({
      data: {
        id: req.body.id || id,
        date: req.body.date || dateStr,
        sector: sector || 'Sector 12 Flood Zone',
        type: type || 'Flash Flood Breach',
        severity: severity || 'Warning',
        victims: Number(victims || 0),
        status: status || 'Under Action',
      },
    });

    SocketManager.emitEvent('incident:created', newIncident);

    return sendSuccess(res, newIncident, 'Incident logged successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to create incident', 500, error);
  }
});

// PUT /api/v1/incidents/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.incident.update({
      where: { id },
      data: {
        ...req.body,
        resolvedAt: req.body.status === 'Resolved' ? new Date() : undefined,
      },
    });

    SocketManager.emitEvent('incident:updated', updated);

    return sendSuccess(res, updated, 'Incident updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update incident', 500, error);
  }
});

export default router;
