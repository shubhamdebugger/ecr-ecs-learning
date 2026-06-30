'use client';

import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useToast() {
  const success = useCallback((title: string, description?: string) => {
    toast({ title, description, variant: 'default' });
  }, []);

  const error = useCallback((title: string, description?: string) => {
    toast({ title, description, variant: 'destructive' });
  }, []);

  const info = useCallback((title: string, description?: string) => {
    toast({ title, description });
  }, []);

  return { success, error, info };
}
