'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { updateUrlSchema, UpdateUrlFormInput } from '@/lib/validations';
import { useUpdateUrl, getApiError } from '@/hooks/useUrls';
import { Url } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface EditUrlDialogProps {
  url: Url | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUrlDialog({ url, open, onOpenChange }: EditUrlDialogProps) {
  const { mutateAsync: updateUrl, isPending } = useUpdateUrl();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUrlFormInput>({
    resolver: zodResolver(updateUrlSchema),
  });

  useEffect(() => {
    if (url) {
      reset({
        originalUrl: url.originalUrl,
        title: url.title ?? '',
        expiresAt: url.expiresAt
          ? format(new Date(url.expiresAt), "yyyy-MM-dd'T'HH:mm")
          : '',
      });
    }
  }, [url, reset]);

  const onSubmit = async (data: UpdateUrlFormInput) => {
    if (!url) return;
    try {
      await updateUrl({
        id: url.id,
        data: {
          originalUrl: data.originalUrl,
          title: data.title || undefined,
          expiresAt: data.expiresAt || null,
        },
      });
      toast({ title: 'URL updated successfully!' });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to update URL',
        description: getApiError(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit URL</DialogTitle>
          <DialogDescription>Update the destination URL, title, or expiration date.</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-originalUrl">Destination URL</Label>
            <Input id="edit-originalUrl" placeholder="https://example.com" {...register('originalUrl')} />
            {errors.originalUrl && (
              <p className="text-xs text-destructive">{errors.originalUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" placeholder="My link title" {...register('title')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expiresAt">Expiration Date</Label>
            <Input id="edit-expiresAt" type="datetime-local" {...register('expiresAt')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
