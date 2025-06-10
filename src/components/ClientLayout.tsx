'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { AppProviders } from '@/providers/AppProviders';
import { DashboardWrapper } from './DashboardWrapper';
import { LayoutWrapper } from './LayoutWrapper';

type ClientLayoutProps = {
  children: ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export function ClientLayout({ children, locale, messages }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const segment = useSelectedLayoutSegment();
  
  // Only render after mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDashboard = segment === 'dashboard';

  // Don't render anything until we're mounted on the client
  if (!isMounted) {
    return null;
  }

  return (
    <AppProviders>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {isDashboard ? (
          <DashboardWrapper>
            {children}
          </DashboardWrapper>
        ) : (
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        )}
      </NextIntlClientProvider>
    </AppProviders>
  );
}
