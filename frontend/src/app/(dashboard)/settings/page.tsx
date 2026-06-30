'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your application preferences.</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose your preferred color scheme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm font-medium transition-all hover:bg-accent',
                  theme === value
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent',
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Information</CardTitle>
          <CardDescription>Base URL and API documentation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
            <span className="text-sm text-muted-foreground">API Base URL</span>
            <code className="text-xs">
              {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'}
            </code>
          </div>
          <Button variant="outline" asChild>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:5000'}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View API Documentation
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
