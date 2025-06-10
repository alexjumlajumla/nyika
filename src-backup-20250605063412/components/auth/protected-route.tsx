'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from '@/hooks/use-session';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
};

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/signin',
}: ProtectedRouteProps) {
  const { status, session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);
    } else if (status === 'authenticated' && requiredRole && session?.user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [status, session, requiredRole, router, redirectTo]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'authenticated' && (!requiredRole || session?.user.role === requiredRole)) {
    return <>{children}</>;
  }

  return null;
}
