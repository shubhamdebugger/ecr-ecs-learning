import Link from 'next/link';
import { ArrowRight, BarChart3, Link2, Shield, Zap, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Link2,
    title: 'Smart URL Shortening',
    description:
      'Create concise, memorable links with custom aliases. Perfect for sharing across social media, email campaigns, and more.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description:
      'Track every click with detailed insights — browser, OS, device, country, referrer, and time-series data.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'JWT authentication, rate limiting, input sanitization, and secure HTTP headers keep your data safe.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built on Node.js and MongoDB with optimized aggregation pipelines for sub-millisecond redirects.',
  },
  {
    icon: Globe,
    title: 'Global Analytics',
    description:
      'Understand your worldwide audience with geo-location tracking and country-level click analytics.',
  },
  {
    icon: Users,
    title: 'Team Ready',
    description:
      'Multi-user support with individual dashboards, personal URL management, and isolated analytics.',
  },
];

const stats = [
  { value: '10M+', label: 'Links Shortened' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<5ms', label: 'Avg. Redirect Time' },
  { value: '180+', label: 'Countries Tracked' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Linkly</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#stats" className="text-sm text-muted-foreground hover:text-foreground">
              Stats
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-24 text-center md:py-32">
          <Badge variant="secondary" className="mb-4">
            Production-Ready URL Shortener
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Shorten. Share.
            <span className="text-primary"> Analyze.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Enterprise-grade URL management with real-time analytics, custom aliases, expiration
            dates, and comprehensive click tracking. Built for teams that demand reliability.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">View Dashboard</Link>
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="border-y bg-muted/50 py-16">
          <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="mt-4 text-muted-foreground">
              A complete URL management platform with analytics built in from day one.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border p-6 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-12">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-4 text-muted-foreground">
              Create your free account and start shortening links in under 60 seconds.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/register">
                Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Link2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Linkly</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Linkly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
