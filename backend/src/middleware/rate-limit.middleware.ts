import rateLimit from 'express-rate-limit';
import { config } from '../config/app.config';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES } from '../constants/app.constants';

export const globalRateLimit = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
});

export const redirectRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: {
    success: false,
    message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
});
