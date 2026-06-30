'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createUrlSchema, CreateUrlFormInput } from '@/lib/validations';
import { useCreateUrl, getApiError } from '@/hooks/useUrls';
import { toast } from '@/components/ui/use-toast';

export function CreateUrlDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createUrl, isPending } = useCreateUrl();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUrlFormInput>({
    resolver: zodResolver(createUrlSchema),
  });

  const onSubmit = async (data: CreateUrlFormInput) => {
    try {
      await createUrl({
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        title: data.title || undefined,
        expiresAt: data.expiresAt || undefined,
      });
      toast({ title: 'URL created successfully!' });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to create URL',
        description: getApiError(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Short URL</DialogTitle>
          <DialogDescription>
            Shorten a URL with an optional custom alias and expiration date.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Destination URL *</Label>
            <Input
              id="originalUrl"
              placeholder="https://example.com/very/long/url"
              {...register('originalUrl')}
            />
            {errors.originalUrl && (
              <p className="text-xs text-destructive">{errors.originalUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customAlias">Custom Alias (optional)</Label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground whitespace-nowrap">linkly.io/</span>
              <Input
                id="customAlias"
                placeholder="my-custom-link"
                {...register('customAlias')}
              />
            </div>
            {errors.customAlias && (
              <p className="text-xs text-destructive">{errors.customAlias.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Campaign Summer 2025"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              {...register('expiresAt')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
