'use client';

import { ThemeProvider } from 'next-themes';
import { CurrencyProvider } from '@/contexts/CurrencyProvider';
import { AuthProvider } from './AuthProvider';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CurrencyProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
