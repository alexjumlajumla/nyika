'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else if (!isLoading && isAuthenticated && requiredRole && session?.user?.role !== requiredRole) {
      // Redirect if user doesn't have the required role
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, router, callbackUrl, requiredRole, session?.user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
