'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isUnauthenticated = status === 'unauthenticated';

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    update,
  };
}
