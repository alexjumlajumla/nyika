'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Icons } from '@/components/icons';

export default function SignOutPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut();
        // Redirect to sign-in page with callback URL if provided
        const callbackUrl = searchParams.get('callbackUrl') || `/${locale}`;
        router.push(`/${locale}/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } catch {
        // If there's an error, still redirect to sign-in
        router.push(`/${locale}/signin`);
      }
    };

    handleSignOut();
  }, [signOut, router, searchParams, locale]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Icons.spinner className="h-8 w-8 animate-spin" />
        <p>Signing out...</p>
      </div>
    </div>
  );
}
