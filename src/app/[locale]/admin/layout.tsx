'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './_components/sidebar';
import { DashboardHeader } from './_components/header';
import { useRequireAuth } from '@/lib/auth-utils';
import { Loader2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthorized, isLoading, user } = useRequireAuth('super_admin');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to unauthorized if user doesn't have required role
  useEffect(() => {
    if (isLoading || !isClient) return;
    
    if (isAuthorized === false) {
      router.push('/unauthorized');
    }
  }, [isAuthorized, isLoading, router, isClient]);

  // Show loading state while checking auth status or during client-side hydration
  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not authorized, show unauthorized message
  if (!isAuthorized || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          <div className={cn(
            "p-4 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
            "flex items-center justify-center"
          )}>
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard. Please contact the system administrator if you believe this is an error.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Only render the dashboard when we have a confirmed authorized user
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col min-h-screen">
        <DashboardHeader 
          title="Dashboard"
          user={user} 
          className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
