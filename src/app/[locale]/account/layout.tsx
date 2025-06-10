'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/auth-utils';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';

interface UserAccountLayoutProps {
  children: React.ReactNode;
}

export default function UserAccountLayout({ children }: UserAccountLayoutProps) {
  const { isAuthorized, isLoading, user } = useRequireAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to sign-in if not authorized
  useEffect(() => {
    if (isLoading || !isClient) return;
    
    if (isAuthorized === false) {
      router.push('/auth/signin');
    }
  }, [isAuthorized, isLoading, router, isClient]);

  // Show loading state while checking auth status or during client-side hydration
  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If user is not authorized, we've already handled the redirect
  if (!isAuthorized || !user) {
    return null; // Will be redirected by the effect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
