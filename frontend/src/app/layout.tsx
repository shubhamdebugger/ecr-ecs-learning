import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Linkly — Production-Grade URL Shortener',
  description:
    'Shorten, track, and analyze your links with enterprise-grade reliability. Built for modern teams.',
  keywords: ['url shortener', 'link management', 'analytics', 'custom links'],
  authors: [{ name: 'Linkly Team' }],
  openGraph: {
    title: 'Linkly — URL Shortener',
    description: 'Shorten, track, and analyze your links.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
