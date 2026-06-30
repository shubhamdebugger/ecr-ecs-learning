import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { HTTP_STATUS } from '../constants/http.constants';
import { SUCCESS_MESSAGES } from '../constants/app.constants';
import { sendSuccess } from '../utilities/response.util';
import { AuthenticatedRequest } from '../types/common.types';

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const profile = await userService.getProfile(userId);
    sendSuccess(res, HTTP_STATUS.OK, 'Profile retrieved successfully', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const profile = await userService.updateProfile(userId, req.body);
    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROFILE_UPDATED, profile);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = (req as AuthenticatedRequest).user!;
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await userService.changePassword(userId, currentPassword, newPassword);
    sendSuccess(res, HTTP_STATUS.OK, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
