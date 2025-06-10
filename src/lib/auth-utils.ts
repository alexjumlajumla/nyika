'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

// Client-side hook for requiring authentication
export function useRequireAuth(requiredRole?: string) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Only proceed if auth is initialized
    if (!isInitialized) {
      setIsCheckingAuth(true);
      return;
    }

    // If we're on the sign-in page, no need to check auth
    if (pathname.includes('/auth/signin')) {
      setIsCheckingAuth(false);
      setIsAuthorized(null);
      return;
    }

    // If no user is found, redirect to sign-in
    if (!user) {
      setIsAuthorized(false);
      setIsCheckingAuth(false);
      // Only redirect if we're not already on the sign-in page
      if (!pathname.includes('/auth/signin')) {
        const targetPath = pathname === '/' ? '/dashboard' : pathname;
        const callbackUrlWithSearch = searchParams.toString() 
          ? `${targetPath}?${searchParams.toString()}` 
          : targetPath;
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrlWithSearch)}`);
      }
      return;
    }

    // If a role is required, check if user has it
    if (requiredRole) {
      const userRole = user.role || 'user';
      const hasRequiredRole = userRole === requiredRole;
      setIsAuthorized(hasRequiredRole);
      
      if (!hasRequiredRole) {
        router.push('/unauthorized');
      }
    } else {
      setIsAuthorized(true);
    }
    
    setIsCheckingAuth(false);
  }, [user, isInitialized, requiredRole, pathname, router]);

  // Show loading state if auth is not yet initialized or still checking
  const isLoadingState = isLoading || !isInitialized || isCheckingAuth;

  return { 
    isAuthorized, 
    isLoading: isLoadingState,
    user 
  };
}

export async function getCurrentUser() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  try {
    const response = await fetch('/api/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const profile = await response.json();
    
    return {
      ...user,
      profile,
    };
  } catch (error) {
    // In production, silently fail and return user without profile
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error fetching user profile:', error);
    }
    return user; // Return user without profile if profile fetch fails
  }
}
