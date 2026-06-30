export interface CreateUrlInput {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  expiresAt?: Date;
}

export interface UpdateUrlInput {
  originalUrl?: string;
  title?: string;
  expiresAt?: Date | null;
  isActive?: boolean;
}

export interface UrlFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'clicks' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  shortUrl: string;
  clicks: number;
  isActive: boolean;
  expiresAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedUrlResponse {
  urls: UrlResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClickData {
  ip: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  country: string;
}
