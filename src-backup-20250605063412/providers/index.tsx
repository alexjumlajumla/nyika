'use client';

import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { AuthProvider } from './AuthProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function Providers({ 
  children,
  session: serverSession
}: { 
  children: React.ReactNode;
  session?: any;
}) {
  // Get the session on the server side if not provided
  const session = serverSession || await getServerSession(authOptions);

  return (
    <AuthProvider session={session}>
      <I18nProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </ThemeProvider>
      </I18nProvider>
    </AuthProvider>
  );
}
