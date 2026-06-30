import mongoose from 'mongoose';
import { IUrl, Url } from '../models/url.model';
import { UrlFilters } from '../types/url.types';
import { APP_CONSTANTS } from '../constants/app.constants';

export async function createUrl(
  data: Omit<IUrl, '_id' | 'clicks' | 'isActive' | 'createdAt' | 'updatedAt'>,
): Promise<IUrl> {
  const url = new Url(data);
  return url.save();
}

export async function findUrlById(id: string): Promise<IUrl | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Url.findById(id).exec();
}

export async function findUrlByIdAndUserId(id: string, userId: string): Promise<IUrl | null> {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return Url.findOne({ _id: id, userId }).exec();
}

export async function findUrlByShortCode(shortCode: string): Promise<IUrl | null> {
  return Url.findOne({ shortCode: shortCode.toLowerCase() }).exec();
}

export async function findUrlByCustomAlias(alias: string): Promise<IUrl | null> {
  return Url.findOne({ customAlias: alias.toLowerCase() }).exec();
}

export async function findUrlsByUserId(
  userId: string,
  filters: UrlFilters,
): Promise<{ urls: IUrl[]; total: number }> {
  if (!mongoose.Types.ObjectId.isValid(userId)) return { urls: [], total: 0 };

  const {
    search,
    isActive,
    page = 1,
    limit = APP_CONSTANTS.DEFAULT_PAGE_SIZE,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const query: mongoose.FilterQuery<IUrl> = { userId };

  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } },
      { customAlias: { $regex: search, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;
  const clampedLimit = Math.min(limit, APP_CONSTANTS.MAX_PAGE_SIZE);

  const [urls, total] = await Promise.all([
    Url.find(query)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(clampedLimit)
      .exec(),
    Url.countDocuments(query).exec(),
  ]);

  return { urls, total };
}

export async function updateUrl(
  id: string,
  userId: string,
  data: Partial<IUrl>,
): Promise<IUrl | null> {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return Url.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true, runValidators: true },
  ).exec();
}

export async function deleteUrl(id: string, userId: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return false;
  const result = await Url.findOneAndDelete({ _id: id, userId }).exec();
  return result !== null;
}

export async function incrementUrlClicks(id: string): Promise<void> {
  await Url.findByIdAndUpdate(id, { $inc: { clicks: 1 } }).exec();
}

export async function urlExistsByShortCode(shortCode: string): Promise<boolean> {
  const count = await Url.countDocuments({ shortCode: shortCode.toLowerCase() }).exec();
  return count > 0;
}

export async function urlExistsByCustomAlias(alias: string, excludeId?: string): Promise<boolean> {
  const query: mongoose.FilterQuery<IUrl> = { customAlias: alias.toLowerCase() };
  if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
    query._id = { $ne: excludeId };
  }
  const count = await Url.countDocuments(query).exec();
  return count > 0;
}

export async function findTopPerformingUrls(userId: string, limit = 5): Promise<IUrl[]> {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  return Url.find({ userId, isActive: true })
    .sort({ clicks: -1 })
    .limit(limit)
    .exec();
}
