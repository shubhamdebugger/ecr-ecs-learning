import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http.constants';
import { sendError } from '../utilities/response.util';
import { logger } from '../logger/logger';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, HTTP_STATUS.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`);
};

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error({ err, url: req.originalUrl, method: req.method }, 'Unhandled error');

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors: Record<string, string[]> = {};
    const mongooseError = err as Error & { errors?: Record<string, { message: string }> };
    if (mongooseError.errors) {
      Object.keys(mongooseError.errors).forEach((key) => {
        errors[key] = [mongooseError.errors![key].message];
      });
    }
    sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', errors);
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).code === '11000') {
    sendError(res, HTTP_STATUS.CONFLICT, 'Duplicate value detected');
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired');
    return;
  }

  sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'An internal server error occurred');
};
