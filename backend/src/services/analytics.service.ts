import { getAnalyticsByUrlId, getDashboardAnalytics, ClickAnalytics } from '../repositories/click.repository';
import { findUrlByIdAndUserId, findTopPerformingUrls } from '../repositories/url.repository';
import type { IUrl } from '../models/url.model';
import { AppError } from '../middleware/error.middleware';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES } from '../constants/app.constants';

export interface DashboardData {
  totalClicks: number;
  todayClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  topUrls: Array<{
    id: string;
    shortCode: string;
    originalUrl: string;
    title?: string;
    clicks: number;
    shortUrl: string;
  }>;
  recentActivity: unknown[];
}

export const getUrlAnalytics = async (
  urlId: string,
  userId: string,
): Promise<ClickAnalytics> => {
  const url = await findUrlByIdAndUserId(urlId, userId);
  if (!url) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }

  return getAnalyticsByUrlId(urlId);
};

export const getDashboard = async (
  userId: string,
  baseUrl: string,
): Promise<DashboardData> => {
  const [{ totalClicks, todayClicks, weeklyClicks, monthlyClicks, recentActivity }, topUrls] =
    await Promise.all([
      getDashboardAnalytics(userId),
      findTopPerformingUrls(userId, 5),
    ]);

  return {
    totalClicks,
    todayClicks,
    weeklyClicks,
    monthlyClicks,
    topUrls: topUrls.map((url: IUrl) => ({
      id: url._id.toString(),
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      title: url.title,
      clicks: url.clicks,
      shortUrl: `${baseUrl}/${url.customAlias ?? url.shortCode}`,
    })),
    recentActivity,
  };
};
