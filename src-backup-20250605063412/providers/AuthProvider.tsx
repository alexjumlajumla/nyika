'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

/**
 * SyncSession component that syncs NextAuth session with Zustand store
 */
function SyncSession({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setSession } = useAuthStore();

  useEffect(() => {
    setSession(session || null);
  }, [session, setSession]);

  return <>{children}</>;
}

/**
 * AuthProvider component that wraps the application with NextAuth session context
 * and syncs it with our Zustand store
 */
export function AuthProvider({ children, session: initialSession }: AuthProviderProps) {
  // Effect to handle session refresh when the page becomes visible
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh session when the page becomes visible
        fetch('/api/auth/session', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          cache: 'no-store',
        }).catch(error => {
          console.error('Error refreshing session:', error);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SessionProvider 
      session={initialSession}
      basePath="/api/auth"
      refetchOnWindowFocus={false}
      refetchInterval={5 * 60}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;
