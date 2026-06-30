import mongoose from 'mongoose';
import { Click, IClick } from '../models/click.model';
import { ClickData } from '../types/url.types';

export interface ClickAnalytics {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byBrowser: Array<{ _id: string; count: number }>;
  byOs: Array<{ _id: string; count: number }>;
  byDevice: Array<{ _id: string; count: number }>;
  byCountry: Array<{ _id: string; count: number }>;
  byReferrer: Array<{ _id: string; count: number }>;
  clicksOverTime: Array<{ date: string; count: number }>;
  recent: IClick[];
}

function emptyAnalytics(): ClickAnalytics {
  return {
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    byBrowser: [],
    byOs: [],
    byDevice: [],
    byCountry: [],
    byReferrer: [],
    clicksOverTime: [],
    recent: [],
  };
}

export async function createClick(urlId: string, data: ClickData): Promise<IClick> {
  const click = new Click({ urlId, ...data });
  return click.save();
}

export async function getAnalyticsByUrlId(urlId: string): Promise<ClickAnalytics> {
  if (!mongoose.Types.ObjectId.isValid(urlId)) {
    return emptyAnalytics();
  }

  const urlObjectId = new mongoose.Types.ObjectId(urlId);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 86400000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [total, today, thisWeek, thisMonth, byBrowser, byOs, byDevice, byCountry, byReferrer, clicksOverTime, recent] =
    await Promise.all([
      Click.countDocuments({ urlId: urlObjectId }),
      Click.countDocuments({ urlId: urlObjectId, createdAt: { $gte: startOfDay } }),
      Click.countDocuments({ urlId: urlObjectId, createdAt: { $gte: startOfWeek } }),
      Click.countDocuments({ urlId: urlObjectId, createdAt: { $gte: startOfMonth } }),
      Click.aggregate([
        { $match: { urlId: urlObjectId } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: { urlId: urlObjectId } },
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: { urlId: urlObjectId } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Click.aggregate([
        { $match: { urlId: urlObjectId } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: { urlId: urlObjectId } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: { urlId: urlObjectId, createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', count: 1, _id: 0 } },
      ]),
      Click.find({ urlId: urlObjectId }).sort({ createdAt: -1 }).limit(10).exec(),
    ]);

  return { total, today, thisWeek, thisMonth, byBrowser, byOs, byDevice, byCountry, byReferrer, clicksOverTime, recent };
}

export async function getDashboardAnalytics(userId: string): Promise<{
  totalClicks: number;
  todayClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  recentActivity: IClick[];
}> {
  const urlIds = await mongoose.model('Url').distinct('_id', { userId }).exec() as mongoose.Types.ObjectId[];

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 86400000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalClicks, todayClicks, weeklyClicks, monthlyClicks, recentActivity] = await Promise.all([
    Click.countDocuments({ urlId: { $in: urlIds } }),
    Click.countDocuments({ urlId: { $in: urlIds }, createdAt: { $gte: startOfDay } }),
    Click.countDocuments({ urlId: { $in: urlIds }, createdAt: { $gte: startOfWeek } }),
    Click.countDocuments({ urlId: { $in: urlIds }, createdAt: { $gte: startOfMonth } }),
    Click.find({ urlId: { $in: urlIds } })
      .populate('urlId', 'shortCode originalUrl title')
      .sort({ createdAt: -1 })
      .limit(10)
      .exec(),
  ]);

  return { totalClicks, todayClicks, weeklyClicks, monthlyClicks, recentActivity };
}
