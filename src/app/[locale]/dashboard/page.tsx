'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const locale = pathname?.split('/')[1] || 'en';
      if (user) {
        const isAdmin = user.user_metadata?.role === 'super_admin' || user.email?.endsWith('@nyikasafaris.com');
        router.replace(`/${locale}${isAdmin ? '/admin/dashboard' : '/account/dashboard'}`);
      } else {
        router.replace(`/${locale}/auth/signin`);
      }
    }
  }, [user, isLoading, pathname, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
