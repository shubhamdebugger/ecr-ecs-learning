import { Request, Response, NextFunction } from 'express';
import * as urlService from '../services/url.service';
import { HTTP_STATUS } from '../constants/http.constants';
import { SUCCESS_MESSAGES } from '../constants/app.constants';
import { sendSuccess } from '../utilities/response.util';
import { AuthenticatedRequest } from '../types/common.types';

export const createUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const url = await urlService.createUrl(userId, req.body);
    sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.URL_CREATED, url);
  } catch (error) {
    next(error);
  }
};

export const getUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const q = req.query as Record<string, string | undefined>;
    const result = await urlService.getUrls(userId, {
      search: q.search,
      isActive: q.isActive !== undefined ? q.isActive === 'true' : undefined,
      page: Number(q.page) || 1,
      limit: Number(q.limit) || 10,
      sortBy: q.sortBy,
      sortOrder: q.sortOrder as 'asc' | 'desc' | undefined,
    });

    sendSuccess(res, HTTP_STATUS.OK, 'URLs retrieved successfully', result.urls, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getUrlById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const url = await urlService.getUrlById(req.params.id, userId);
    sendSuccess(res, HTTP_STATUS.OK, 'URL retrieved successfully', url);
  } catch (error) {
    next(error);
  }
};

export const updateUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const url = await urlService.updateUrl(req.params.id, userId, req.body);
    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.URL_UPDATED, url);
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    await urlService.deleteUrl(req.params.id, userId);
    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.URL_DELETED);
  } catch (error) {
    next(error);
  }
};

export const toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const { isActive } = req.body as { isActive: boolean };
    const url = await urlService.toggleUrlStatus(req.params.id, userId, isActive);
    sendSuccess(res, HTTP_STATUS.OK, 'URL status updated successfully', url);
  } catch (error) {
    next(error);
  }
};
