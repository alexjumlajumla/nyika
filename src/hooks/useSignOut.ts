'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useSignOut() {
  const router = useRouter();
  const { clearSession } = useAuthStore();

  const signOut = async (redirectPath = '/') => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      
      if (response.ok) {
        clearSession();
        router.push(redirectPath);
        router.refresh();
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return signOut;
}
