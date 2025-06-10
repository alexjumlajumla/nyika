'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Handle redirects
  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === 'undefined') return;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      
      // If we're still loading auth state, wait
      if (isLoading) return;
      
      // If user is logged in and trying to access auth pages, redirect to dashboard
      if (user) {
        if (pathname.includes('/auth')) {
          const locale = pathname.split('/')[1] || 'en';
          router.push(`/${locale}/dashboard`);
        }
      } else {
        // If user is not logged in and trying to access protected pages, redirect to login
        if (!pathname.includes('/auth')) {
          const locale = pathname.split('/')[1] || 'en';
          router.push(`/${locale}/auth/signin`);
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [pathname, user, isLoading, router]);

  // Show loading state until we're sure about auth state
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
          {/* Image Section */}
          <div className="w-full md:w-5/12 bg-gradient-to-br from-amber-500 to-amber-600 p-8 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-full h-48 bg-white/20 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-white/90 text-xl font-medium">Nyika Safaris</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Welcome Back!</h2>
              <p className="text-amber-100 text-sm">Sign in to access your account and book your next adventure.</p>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="w-full md:w-7/12 p-8 md:p-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
