import { Router } from 'express';
import { redirect } from '../controllers/redirect.controller';
import { redirectRateLimit } from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [Redirect]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       302: { description: Redirect to original URL }
 *       404: { description: URL not found }
 *       410: { description: URL expired or disabled }
 */
router.get('/:shortCode', redirectRateLimit, redirect);

export default router;
