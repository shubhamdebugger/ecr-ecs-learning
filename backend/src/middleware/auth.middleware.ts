import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/common.types';
import { verifyAccessToken } from '../utilities/token.util';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES } from '../constants/app.constants';
import { sendError } from '../utilities/response.util';
import { logger } from '../logger/logger';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (error) {
    logger.warn({ error }, 'Invalid access token');
    sendError(res, HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }
};
