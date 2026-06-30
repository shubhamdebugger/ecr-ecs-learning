import { Router } from 'express';
import { getDashboard, getUrlAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, mongoIdSchema } from '../validators/common.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics overview
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
router.get('/dashboard', getDashboard);

/**
 * @swagger
 * /analytics/{id}:
 *   get:
 *     summary: Get analytics for a specific URL
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Analytics retrieved }
 *       404: { description: URL not found }
 */
router.get('/:id', validate(mongoIdSchema), getUrlAnalytics);

export default router;
