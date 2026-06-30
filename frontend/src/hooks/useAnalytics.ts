'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

export const ANALYTICS_KEYS = {
  all: ['analytics'] as const,
  dashboard: () => [...ANALYTICS_KEYS.all, 'dashboard'] as const,
  url: (id: string) => [...ANALYTICS_KEYS.all, 'url', id] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: ANALYTICS_KEYS.dashboard(),
    queryFn: async () => {
      const res = await analyticsApi.getDashboard();
      return res.data.data;
    },
  });
}

export function useUrlAnalytics(id: string) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.url(id),
    queryFn: async () => {
      const res = await analyticsApi.getUrlAnalytics(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}
