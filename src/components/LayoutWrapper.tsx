'use client';

import { AuthProvider } from '@/providers/AuthProvider';
import { CurrencyProvider } from '@/contexts/CurrencyProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Footer = dynamic(
  () => import('@/components/layout/Footer').then((mod) => mod.Footer),
  {
    ssr: false,
    loading: () => (
      <footer className="border-t border-border pb-8 pt-8">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Loading skeleton for footer */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-32" />
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>
      </footer>
    ),
  }
);

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
            <Header />
            <main className="min-h-[calc(100vh-4rem)] bg-background">
              {children}
            </main>
            <Footer />
          </div>
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
