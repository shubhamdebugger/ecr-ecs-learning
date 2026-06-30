import apiClient from './axios';
import {
  ApiResponse,
  AuthData,
  Url,
  UrlAnalytics,
  DashboardData,
  CreateUrlInput,
  UpdateUrlInput,
  UrlFilters,
  User,
} from '@/types';

// ---- Auth ----
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthData>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthData>>('/auth/login', data),

  logout: () => apiClient.post<ApiResponse>('/auth/logout'),

  refresh: () => apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh'),

  me: () => apiClient.get<ApiResponse<{ userId: string; email: string }>>('/auth/me'),
};

// ---- Profile ----
export const profileApi = {
  get: () => apiClient.get<ApiResponse<User>>('/profile'),

  update: (data: { name?: string; email?: string }) =>
    apiClient.put<ApiResponse<User>>('/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<ApiResponse>('/profile/password', data),
};

// ---- URLs ----
export const urlApi = {
  create: (data: CreateUrlInput) => apiClient.post<ApiResponse<Url>>('/urls', data),

  getAll: (filters?: UrlFilters) =>
    apiClient.get<ApiResponse<Url[]>>('/urls', { params: filters }),

  getById: (id: string) => apiClient.get<ApiResponse<Url>>(`/urls/${id}`),

  update: (id: string, data: UpdateUrlInput) =>
    apiClient.put<ApiResponse<Url>>(`/urls/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse>(`/urls/${id}`),

  toggleStatus: (id: string, isActive: boolean) =>
    apiClient.patch<ApiResponse<Url>>(`/urls/${id}/status`, { isActive }),
};

// ---- Analytics ----
export const analyticsApi = {
  getUrlAnalytics: (id: string) =>
    apiClient.get<ApiResponse<UrlAnalytics>>(`/analytics/${id}`),

  getDashboard: () => apiClient.get<ApiResponse<DashboardData>>('/analytics/dashboard'),
};
