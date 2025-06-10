'use client';

import { ReactNode } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  );
}
