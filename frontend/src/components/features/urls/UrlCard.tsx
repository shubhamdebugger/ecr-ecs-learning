'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, Trash2, BarChart3, MoreHorizontal, Pencil, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Url } from '@/types';
import { formatRelativeTime, truncateUrl, copyToClipboard, getDomain } from '@/lib/utils';
import { useDeleteUrl, useToggleUrlStatus, getApiError } from '@/hooks/useUrls';
import { toast } from '@/components/ui/use-toast';

interface UrlCardProps {
  url: Url;
  onEdit: (url: Url) => void;
}

export function UrlCard({ url, onEdit }: UrlCardProps) {
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutateAsync: deleteUrl, isPending: isDeleting } = useDeleteUrl();
  const { mutateAsync: toggleStatus } = useToggleUrlStatus();

  const handleCopy = async () => {
    try {
      await copyToClipboard(url.shortUrl);
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUrl(url.id);
      toast({ title: 'URL deleted successfully' });
    } catch (error) {
      toast({ title: 'Failed to delete URL', description: getApiError(error), variant: 'destructive' });
    } finally {
      setDeleteOpen(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      await toggleStatus({ id: url.id, isActive: checked });
    } catch (error) {
      toast({ title: 'Failed to update status', description: getApiError(error), variant: 'destructive' });
    }
  };

  return (
    <>
      <Card className="group transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Domain favicon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
              {getDomain(url.originalUrl).charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-primary text-sm">{url.shortUrl}</span>
                {url.customAlias && (
                  <Badge variant="secondary" className="text-xs">Custom</Badge>
                )}
                {!url.isActive && (
                  <Badge variant="warning" className="text-xs">Disabled</Badge>
                )}
                {url.expiresAt && new Date(url.expiresAt) < new Date() && (
                  <Badge variant="destructive" className="text-xs">Expired</Badge>
                )}
              </div>
              {url.title && (
                <p className="mt-0.5 text-sm font-medium truncate">{url.title}</p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {truncateUrl(url.originalUrl, 60)}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {url.clicks} clicks
                </span>
                <span>•</span>
                <span>{formatRelativeTime(url.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Switch
                checked={url.isActive}
                onCheckedChange={(checked) => void handleToggle(checked)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => void handleCopy()}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(url)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/analytics/${url.id}`} className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open(url.originalUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Open Original
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete URL"
        description="This will permanently delete this short URL and all its analytics data. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        isLoading={isDeleting}
      />
    </>
  );
}
