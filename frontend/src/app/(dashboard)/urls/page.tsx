'use client';

import { useState } from 'react';
import { Search, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { UrlCard } from '@/components/features/urls/UrlCard';
import { CreateUrlDialog } from '@/components/features/urls/CreateUrlDialog';
import { EditUrlDialog } from '@/components/features/urls/EditUrlDialog';
import { useUrls } from '@/hooks/useUrls';
import { Url, UrlFilters } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

export default function UrlsPage() {
  const [editUrl, setEditUrl] = useState<Url | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const filters: UrlFilters = {
    search: debouncedSearch,
    page,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  const { data, isLoading } = useUrls(filters);
  const urls = data?.urls ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My URLs</h1>
          <p className="text-muted-foreground">Manage and track all your short links.</p>
        </div>
        <CreateUrlDialog />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search URLs..."
          className="pl-9"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* URL List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : urls.length === 0 ? (
        <EmptyState
          icon={Link2}
          title={search ? 'No results found' : 'No URLs yet'}
          description={
            search
              ? `No URLs match "${search}". Try a different search term.`
              : 'Create your first short link to start tracking clicks and analytics.'
          }
        />
      ) : (
        <div className="space-y-3">
          {urls.map((url) => (
            <UrlCard key={url.id} url={url} onEdit={setEditUrl} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} URLs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <EditUrlDialog
        url={editUrl}
        open={!!editUrl}
        onOpenChange={(open) => !open && setEditUrl(null)}
      />
    </div>
  );
}
