import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../validators/common.validator';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile retrieved }
 */
router.get('/', getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/', validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /profile/password:
 *   put:
 *     summary: Change password
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/password', validate(changePasswordSchema), changePassword);

export default router;
