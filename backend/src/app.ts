import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/app.config';
import { requestLogger } from './middleware/request-logger.middleware';
import { globalRateLimit } from './middleware/rate-limit.middleware';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware';
import { getDatabaseStatus } from './database/connection';
import { swaggerSpec } from './docs/swagger';

import authRoutes from './routes/auth.routes';
import urlRoutes from './routes/url.routes';
import analyticsRoutes from './routes/analytics.routes';
import userRoutes from './routes/user.routes';
import redirectRoutes from './routes/redirect.routes';

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: config.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Parse middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

// Logging
app.use(requestLogger);

// Global rate limiting
app.use(globalRateLimit);

// Trust proxy (needed for rate limiting behind load balancers)
app.set('trust proxy', 1);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 message: { type: string }
 *                 timestamp: { type: string, format: date-time }
 *                 uptime: { type: number }
 *                 version: { type: string }
 *                 database: { type: object }
 */
app.get('/health', (_req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();
  const status = dbStatus === 'connected' ? 'ok' : 'degraded';

  res.status(status === 'ok' ? 200 : 503).json({
    status,
    message: status === 'ok' ? 'Service is healthy' : 'Service is degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version ?? '1.0.0',
    database: { status: dbStatus },
  });
});

// API docs
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'URL Shortener API Docs',
  }),
);

app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', userRoutes);

// Redirect route (must be after API routes)
app.use('/', redirectRoutes);

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
