export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
}

export interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  shortUrl: string;
  clicks: number;
  isActive: boolean;
  expiresAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClickStat {
  _id: string;
  count: number;
}

export interface ClickOverTime {
  date: string;
  count: number;
}

export interface UrlAnalytics {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byBrowser: ClickStat[];
  byOs: ClickStat[];
  byDevice: ClickStat[];
  byCountry: ClickStat[];
  byReferrer: ClickStat[];
  clicksOverTime: ClickOverTime[];
  recent: RecentClick[];
}

export interface RecentClick {
  id: string;
  urlId: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  country: string;
  createdAt: string;
}

export interface DashboardData {
  totalClicks: number;
  todayClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  topUrls: TopUrl[];
  recentActivity: RecentClick[];
}

export interface TopUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  title?: string;
  clicks: number;
  shortUrl: string;
}

export interface CreateUrlInput {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  expiresAt?: string;
}

export interface UpdateUrlInput {
  originalUrl?: string;
  title?: string;
  expiresAt?: string | null;
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
