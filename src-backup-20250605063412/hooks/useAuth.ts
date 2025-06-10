'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';

export function useAuth(required = false) {
  const { data: session, status } = useSession();
  const { setSession, clearSession, isAuthenticated, isLoading: storeLoading } = useAuthStore();

  useEffect(() => {
    if (session) {
      setSession(session);
    } else {
      clearSession();
    }
  }, [session, setSession, clearSession]);

  return {
    session,
    isAuthenticated,
    isLoading: status === 'loading' || storeLoading,
    status,
  };
}
