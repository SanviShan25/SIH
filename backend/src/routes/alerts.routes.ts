import { Router, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { SocketManager } from '../socket';

const router = Router();

// GET /api/v1/alerts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { severity } = req.query;
    const where: any = {};

    if (severity && typeof severity === 'string' && severity !== 'all') {
      where.severity = severity === 'critical' ? 'Critical' : severity === 'warning' ? 'Warning' : 'Info';
    }

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const activeCritical = alerts.filter((a) => a.severity === 'Critical' && !a.isResolved).length;

    return sendSuccess(res, { alerts, activeCritical }, 'Emergency alerts retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch alerts', 500, error);
  }
});

// GET /api/v1/alerts/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      return sendError(res, 'Alert not found', 404);
    }

    return sendSuccess(res, alert, 'Alert retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch alert', 500, error);
  }
});

// POST /api/v1/alerts (Broadcast new alert)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, severity, area, body, channels, targetCount } = req.body;
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeStr = new Date().toISOString().slice(11, 16) + ' UTC';
    const target = targetCount ? Number(targetCount) : 15000;
    const initialReach = `${Math.floor(target * 0.85).toLocaleString()} / ${target.toLocaleString()} Recipients`;

    const newAlert = await prisma.alert.create({
      data: {
        id: alertId,
        title: title || 'Emergency Flash Flood Advisory',
        severity: severity ? (severity.includes('Critical') ? 'Critical' : severity.includes('Warning') ? 'Warning' : 'Info') : 'Critical',
        area: area || 'Sector 12 / Lower Basin',
        time: timeStr,
        reach: initialReach,
        body: body || 'Immediate evacuation advisory issued by District Operations.',
        channels: channels ? (Array.isArray(channels) ? channels.join(', ') : channels) : 'SMS, WhatsApp, Siren',
        isResolved: false,
      },
    });

    // Real-time broadcast to all connected command centers
    SocketManager.emitEvent('alert:new', newAlert);

    return sendSuccess(res, newAlert, 'Emergency alert broadcasted successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to broadcast alert', 500, error);
  }
});

// PUT /api/v1/alerts/:id (Resolve or update alert)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.alert.update({
      where: { id },
      data: req.body,
    });

    SocketManager.emitEvent('alert:updated', updated);

    return sendSuccess(res, updated, 'Alert updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update alert', 500, error);
  }
});

export default router;
