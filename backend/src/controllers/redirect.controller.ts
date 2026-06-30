import { Request, Response, NextFunction } from 'express';
import * as urlService from '../services/url.service';
import { parseUserAgent } from '../utilities/ua.util';

export const redirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const clickData = parseUserAgent(req);
    const originalUrl = await urlService.redirect(shortCode, clickData);
    res.redirect(302, originalUrl);
  } catch (error) {
    next(error);
  }
};
