import Link from 'next/link';
import { Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Link2Off className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>
      <p className="mt-4 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
