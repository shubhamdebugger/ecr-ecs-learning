'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MousePointerClick, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/shared/StatCard';
import { useUrlAnalytics } from '@/hooks/useAnalytics';
import { formatNumber } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

export default function UrlAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: analytics, isLoading } = useUrlAnalytics(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">URL Analytics</h1>
          <p className="text-muted-foreground">Detailed click statistics for this link.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clicks"
          value={isLoading ? '—' : formatNumber(analytics?.total ?? 0)}
          icon={MousePointerClick}
          isLoading={isLoading}
        />
        <StatCard
          title="Today"
          value={isLoading ? '—' : formatNumber(analytics?.today ?? 0)}
          icon={MousePointerClick}
          isLoading={isLoading}
        />
        <StatCard
          title="This Week"
          value={isLoading ? '—' : formatNumber(analytics?.thisWeek ?? 0)}
          icon={MousePointerClick}
          isLoading={isLoading}
        />
        <StatCard
          title="This Month"
          value={isLoading ? '—' : formatNumber(analytics?.thisMonth ?? 0)}
          icon={MousePointerClick}
          isLoading={isLoading}
        />
      </div>

      {/* Clicks Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clicks Over Time (Last 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : analytics?.clicksOverTime && analytics.clicksOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.clicksOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-16">No click data yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Browsers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : analytics?.byBrowser && analytics.byBrowser.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.byBrowser}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ _id, percent }) =>
                      `${_id as string} ${((percent as number) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {analytics.byBrowser.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">No data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : analytics?.byOs && analytics.byOs.length > 0 ? (
              <div className="space-y-2">
                {analytics.byOs.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{item._id}</span>
                    </div>
                    <span className="font-medium">{formatNumber(item.count)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">No data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : analytics?.byDevice && analytics.byDevice.length > 0 ? (
              <div className="space-y-2">
                {analytics.byDevice.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item._id === 'mobile' ? (
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="capitalize">{item._id}</span>
                    </div>
                    <span className="font-medium">{formatNumber(item.count)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">No data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Countries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : analytics?.byCountry && analytics.byCountry.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.byCountry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="_id" type="category" tick={{ fontSize: 11 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" name="Clicks" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">No data yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
