import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import dashboardRoutes from './routes/dashboard.routes';
import waterCoverageRoutes from './routes/waterCoverage.routes';
import settlementsRoutes from './routes/settlements.routes';
import roadsRoutes from './routes/roads.routes';
import infrastructureRoutes from './routes/infrastructure.routes';
import mapRoutes from './routes/map.routes';
import missionsRoutes from './routes/missions.routes';
import detectionsRoutes from './routes/detections.routes';
import unitsRoutes from './routes/units.routes';
import incidentsRoutes from './routes/incidents.routes';
import campsRoutes from './routes/camps.routes';
import alertsRoutes from './routes/alerts.routes';
import floodAnalysisRoutes from './routes/floodAnalysis.routes';
import reportRoutes from './routes/report.routes';

dotenv.config();

export const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root & Health Check Endpoints
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'Sky Guardians — Drone Flood Disaster Intelligence & Operations Backend',
    version: '1.0.0',
    mode: 'Guest Mode (Public Command Access)',
    health: '/health',
    apiBaseUrl: '/api/v1',
    endpoints: {
      dashboard: '/api/v1/dashboard/summary',
      waterCoverage: '/api/v1/water-coverage/summary',
      settlements: '/api/v1/settlements',
      roads: '/api/v1/roads',
      infrastructure: '/api/v1/infrastructure',
      map: '/api/v1/map/layers',
      missions: '/api/v1/missions',
      detections: '/api/v1/detections/latest',
      units: '/api/v1/units',
      incidents: '/api/v1/incidents',
      camps: '/api/v1/camps',
      alerts: '/api/v1/alerts',
      floodAnalysis: '/api/v1/flood-analysis/timeline',
      report: '/api/v1/report/current',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    service: 'Sky Guardians Drone Flood Intelligence Backend',
    version: '1.0.0',
    mode: 'Guest Mode (Public Command Access)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting
const prefix = process.env.API_PREFIX || '/api/v1';

app.use(`${prefix}/dashboard`, dashboardRoutes);
app.use(`${prefix}/water-coverage`, waterCoverageRoutes);
app.use(`${prefix}/settlements`, settlementsRoutes);
app.use(`${prefix}/roads`, roadsRoutes);
app.use(`${prefix}/infrastructure`, infrastructureRoutes);
app.use(`${prefix}/map`, mapRoutes);
app.use(`${prefix}/missions`, missionsRoutes);
app.use(`${prefix}/detections`, detectionsRoutes);
app.use(`${prefix}/units`, unitsRoutes);
app.use(`${prefix}/incidents`, incidentsRoutes);
app.use(`${prefix}/camps`, campsRoutes);
app.use(`${prefix}/alerts`, alertsRoutes);
app.use(`${prefix}/flood-analysis`, floodAnalysisRoutes);
app.use(`${prefix}/report`, reportRoutes);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});
