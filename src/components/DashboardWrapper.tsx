'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Footer } from './layout/Footer';
import { Header } from './layout/Header';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { CurrencyProvider } from '@/contexts/CurrencyProvider';

interface DashboardWrapperProps {
  children: ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');

  // For dashboard routes, wrap with necessary providers but don't show header/footer
  if (isDashboard) {
    return (
      <AuthProvider>
        <ThemeProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </ThemeProvider>
      </AuthProvider>
    );
  }

  // For non-dashboard routes, use the standard layout with header and footer
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <Footer />
          </div>
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
