'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

// Custom type for theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string | 'class';
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  [key: string]: any;
}

export function Providers({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary-500 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
      </div>
    );
  }
  
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        {...props}
      >
        <CurrencyProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            duration: 3000,
          }}
          />
        </CurrencyProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
