import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { HTTP_STATUS } from '../constants/http.constants';
import { SUCCESS_MESSAGES, APP_CONSTANTS } from '../constants/app.constants';
import { sendSuccess } from '../utilities/response.util';
import { AuthenticatedRequest } from '../types/common.types';

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(APP_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: APP_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE,
  });
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.REGISTER_SUCCESS, {
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    setRefreshTokenCookie(res, result.refreshToken);
    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response, _next: NextFunction): void => {
  res.clearCookie(APP_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token =
      (req.cookies as Record<string, string>)[APP_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME] ||
      (req.body as { refreshToken?: string }).refreshToken;

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    const tokens = await authService.refreshToken(token);
    setRefreshTokenCookie(res, tokens.refreshToken);

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.TOKEN_REFRESHED, {
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
      return;
    }
    sendSuccess(res, HTTP_STATUS.OK, 'User info retrieved', user);
  } catch (error) {
    next(error);
  }
};
