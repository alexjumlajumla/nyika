'use client';

import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';

// This is a simple server-side redirect component
export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // If still loading auth state, do nothing
    if (isLoading) return;

    const currentPath = window.location.pathname;
    const locale = currentPath.split('/')[1] || 'en';

    // If not logged in, redirect to sign in
    if (!user) {
      if (!currentPath.includes('/auth/signin')) {
        window.location.href = `/${locale}/auth/signin?redirectedFrom=${encodeURIComponent(currentPath)}`;
      }
      return;
    }

    // If logged in, determine the correct dashboard
    const isAdmin = user.email?.endsWith('@nyika.co.tz');
    const dashboardPath = isAdmin ? '/admin/dashboard' : '/account/dashboard';
    const targetPath = `/${locale}${dashboardPath}`;

    // Only redirect if we're not already on the target page
    if (!currentPath.startsWith(targetPath)) {
      window.location.href = targetPath;
    }
  }, [user, isLoading]);

  // Simple loading spinner
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
