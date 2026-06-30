'use client';

import Link from 'next/link';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useDashboard } from '@/hooks/useAnalytics';
import { formatNumber, truncateUrl } from '@/lib/utils';

export default function AnalyticsPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track performance across all your short links.</p>
      </div>

      {/* Top URLs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Performing Links</CardTitle>
          <CardDescription>Click on a link to view detailed analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : data?.topUrls && data.topUrls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-3 text-left font-medium">Link</th>
                    <th className="pb-3 text-left font-medium">Original URL</th>
                    <th className="pb-3 text-right font-medium">Clicks</th>
                    <th className="pb-3 text-right font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.topUrls.map((url) => (
                    <tr key={url.id} className="hover:bg-muted/50">
                      <td className="py-3">
                        <span className="font-medium text-primary">{url.shortCode}</span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {truncateUrl(url.originalUrl, 50)}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatNumber(url.clicks)}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/dashboard/analytics/${url.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No analytics yet"
              description="Create short links and share them to start collecting analytics data."
            />
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      {!isLoading && data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed country breakdown on individual URL analytics pages.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
