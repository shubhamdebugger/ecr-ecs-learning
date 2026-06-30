'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { urlApi } from '@/lib/api';
import { CreateUrlInput, UpdateUrlInput, UrlFilters } from '@/types';
import { AxiosError } from 'axios';

export const URL_KEYS = {
  all: ['urls'] as const,
  lists: () => [...URL_KEYS.all, 'list'] as const,
  list: (filters: UrlFilters) => [...URL_KEYS.lists(), filters] as const,
  details: () => [...URL_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...URL_KEYS.details(), id] as const,
};

export function useUrls(filters?: UrlFilters) {
  return useQuery({
    queryKey: URL_KEYS.list(filters ?? {}),
    queryFn: async () => {
      const res = await urlApi.getAll(filters);
      return { urls: res.data.data ?? [], meta: res.data.meta };
    },
  });
}

export function useUrl(id: string) {
  return useQuery({
    queryKey: URL_KEYS.detail(id),
    queryFn: async () => {
      const res = await urlApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUrlInput) => {
      const res = await urlApi.create(data);
      return res.data.data!;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: URL_KEYS.lists() });
    },
  });
}

export function useUpdateUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUrlInput }) => {
      const res = await urlApi.update(id, data);
      return res.data.data!;
    },
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: URL_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: URL_KEYS.detail(id) });
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await urlApi.delete(id);
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: URL_KEYS.lists() });
    },
  });
}

export function useToggleUrlStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await urlApi.toggleStatus(id, isActive);
      return res.data.data!;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: URL_KEYS.lists() });
    },
  });
}

export function getApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message as string | undefined;
    return message ?? error.message;
  }
  return 'An unexpected error occurred';
}
