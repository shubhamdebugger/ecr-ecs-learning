import { Request } from 'express';

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

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  message: string;
  timestamp: string;
  uptime: number;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
  };
}
