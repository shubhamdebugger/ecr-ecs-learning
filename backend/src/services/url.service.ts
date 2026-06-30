import * as urlRepo from '../repositories/url.repository';
import * as clickRepo from '../repositories/click.repository';
import { AppError } from '../middleware/error.middleware';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES } from '../constants/app.constants';
import { CreateUrlInput, UpdateUrlInput, UrlFilters, UrlResponse, PaginatedUrlResponse, ClickData } from '../types/url.types';
import { generateUniqueShortCode } from '../utilities/shortcode.util';
import { config } from '../config/app.config';
import { IUrl } from '../models/url.model';

const buildShortUrl = (shortCode: string): string => `${config.BASE_URL}/${shortCode}`;

const mapUrlToResponse = (url: IUrl): UrlResponse => ({
  id: url._id.toString(),
  originalUrl: url.originalUrl,
  shortCode: url.shortCode,
  customAlias: url.customAlias,
  title: url.title,
  shortUrl: buildShortUrl(url.customAlias ?? url.shortCode),
  clicks: url.clicks,
  isActive: url.isActive,
  expiresAt: url.expiresAt,
  userId: url.userId.toString(),
  createdAt: url.createdAt,
  updatedAt: url.updatedAt,
});

export const createUrl = async (userId: string, input: CreateUrlInput): Promise<UrlResponse> => {
  if (input.customAlias) {
    const aliasExists = await urlRepo.urlExistsByCustomAlias(input.customAlias);
    if (aliasExists) {
      throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.DUPLICATE_ALIAS);
    }
  }

  const shortCode = await generateUniqueShortCode();

  const url = await urlRepo.createUrl({
    originalUrl: input.originalUrl,
    shortCode,
    customAlias: input.customAlias,
    title: input.title,
    expiresAt: input.expiresAt,
    userId,
  });

  return mapUrlToResponse(url);
};

export const getUrls = async (userId: string, filters: UrlFilters): Promise<PaginatedUrlResponse> => {
  const { urls, total } = await urlRepo.findUrlsByUserId(userId, filters);
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  return {
    urls: urls.map(mapUrlToResponse),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getUrlById = async (id: string, userId: string): Promise<UrlResponse> => {
  const url = await urlRepo.findUrlByIdAndUserId(id, userId);
  if (!url) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }
  return mapUrlToResponse(url);
};

export const updateUrl = async (
  id: string,
  userId: string,
  input: UpdateUrlInput,
): Promise<UrlResponse> => {
  const existing = await urlRepo.findUrlByIdAndUserId(id, userId);
  if (!existing) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }

  const url = await urlRepo.updateUrl(id, userId, input);
  if (!url) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }

  return mapUrlToResponse(url);
};

export const deleteUrl = async (id: string, userId: string): Promise<void> => {
  const deleted = await urlRepo.deleteUrl(id, userId);
  if (!deleted) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }
};

export const toggleUrlStatus = async (
  id: string,
  userId: string,
  isActive: boolean,
): Promise<UrlResponse> => {
  const url = await urlRepo.updateUrl(id, userId, { isActive });
  if (!url) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }
  return mapUrlToResponse(url);
};

export const redirect = async (shortCode: string, clickData: ClickData): Promise<string> => {
  const url =
    (await urlRepo.findUrlByShortCode(shortCode)) ??
    (await urlRepo.findUrlByCustomAlias(shortCode));

  if (!url) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.URL_NOT_FOUND);
  }

  if (!url.isActive) {
    throw new AppError(410, ERROR_MESSAGES.URL_DISABLED);
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    throw new AppError(410, ERROR_MESSAGES.URL_EXPIRED);
  }

  void Promise.all([
    urlRepo.incrementUrlClicks(url._id.toString()),
    clickRepo.createClick(url._id.toString(), clickData),
  ]);

  return url.originalUrl;
};
