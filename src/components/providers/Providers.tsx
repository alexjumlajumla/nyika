'use client';

import { ReactNode } from 'react';
import SessionProvider from './SessionProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
