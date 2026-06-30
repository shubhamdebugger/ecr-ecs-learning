'use client';

import { BarChart3, Link2, MousePointerClick, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/useAnalytics';
import { useAuth } from '@/providers/AuthProvider';
import { formatNumber, formatRelativeTime, truncateUrl } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your links.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clicks"
          value={isLoading ? '—' : formatNumber(data?.totalClicks ?? 0)}
          icon={MousePointerClick}
          description="All-time click count"
          isLoading={isLoading}
        />
        <StatCard
          title="Today"
          value={isLoading ? '—' : formatNumber(data?.todayClicks ?? 0)}
          icon={TrendingUp}
          description="Clicks in the last 24h"
          isLoading={isLoading}
          iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          title="This Week"
          value={isLoading ? '—' : formatNumber(data?.weeklyClicks ?? 0)}
          icon={BarChart3}
          description="Clicks in the last 7 days"
          isLoading={isLoading}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="This Month"
          value={isLoading ? '—' : formatNumber(data?.monthlyClicks ?? 0)}
          icon={Link2}
          description="Clicks in the last 30 days"
          isLoading={isLoading}
          iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing URLs</CardTitle>
            <CardDescription>Your most clicked links this month</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : data?.topUrls && data.topUrls.length > 0 ? (
              <div className="space-y-3">
                {data.topUrls.map((url, index) => (
                  <div key={url.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{url.title ?? url.shortCode}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {truncateUrl(url.originalUrl, 45)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {formatNumber(url.clicks)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                No URLs yet. Create your first link!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Click Activity</CardTitle>
            <CardDescription>Latest clicks across all your links</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.map((click, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="flex-1 truncate text-muted-foreground">
                      {click.browser} on {click.os} • {click.country}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(click.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">
                No activity yet. Share your links to start tracking!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
