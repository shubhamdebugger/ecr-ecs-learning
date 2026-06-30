import { Router } from 'express';
import {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  toggleStatus,
} from '../controllers/url.controller';
import { validate } from '../validators/common.validator';
import {
  createUrlSchema,
  updateUrlSchema,
  urlFiltersSchema,
  updateStatusSchema,
  urlParamsSchema,
} from '../validators/url.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /urls:
 *   post:
 *     summary: Create a new short URL
 *     tags: [URLs]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [originalUrl]
 *             properties:
 *               originalUrl: { type: string, format: uri }
 *               customAlias: { type: string, minLength: 3, maxLength: 50 }
 *               title: { type: string, maxLength: 100 }
 *               expiresAt: { type: string, format: date-time }
 *     responses:
 *       201: { description: URL created }
 *       409: { description: Custom alias already taken }
 */
router.post('/', validate(createUrlSchema), createUrl);

/**
 * @swagger
 * /urls:
 *   get:
 *     summary: Get all URLs for the authenticated user
 *     tags: [URLs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, clicks, title] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200: { description: URLs retrieved }
 */
router.get('/', validate(urlFiltersSchema), getUrls);

/**
 * @swagger
 * /urls/{id}:
 *   get:
 *     summary: Get a URL by ID
 *     tags: [URLs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: URL retrieved }
 *       404: { description: URL not found }
 */
router.get('/:id', validate(urlParamsSchema), getUrlById);

/**
 * @swagger
 * /urls/{id}:
 *   put:
 *     summary: Update a URL
 *     tags: [URLs]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id', validate(updateUrlSchema), updateUrl);

/**
 * @swagger
 * /urls/{id}:
 *   delete:
 *     summary: Delete a URL
 *     tags: [URLs]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', validate(urlParamsSchema), deleteUrl);

/**
 * @swagger
 * /urls/{id}/status:
 *   patch:
 *     summary: Toggle URL active/inactive status
 *     tags: [URLs]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id/status', validate(updateStatusSchema), toggleStatus);

export default router;
