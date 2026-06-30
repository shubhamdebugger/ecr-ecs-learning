import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';
import { HTTP_STATUS } from '../constants/http.constants';
import { sendSuccess } from '../utilities/response.util';
import { AuthenticatedRequest } from '../types/common.types';
import { config } from '../config/app.config';

export const getUrlAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const analytics = await analyticsService.getUrlAnalytics(req.params.id, userId);
    sendSuccess(res, HTTP_STATUS.OK, 'Analytics retrieved successfully', analytics);
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const dashboard = await analyticsService.getDashboard(userId, config.BASE_URL);
    sendSuccess(res, HTTP_STATUS.OK, 'Dashboard data retrieved successfully', dashboard);
  } catch (error) {
    next(error);
  }
};
