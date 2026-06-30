'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <TopNav onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className={cn('flex-1 overflow-y-auto p-4 md:p-6')}>{children}</main>
      </div>
    </div>
  );
}
