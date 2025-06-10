'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { type Session } from 'next-auth';
import { AuthProvider } from './AuthProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider session={session}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
