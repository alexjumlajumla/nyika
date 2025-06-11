'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          // Get the redirect URL from session storage or default to dashboard
          const redirectTo = sessionStorage.getItem('auth_redirect') || 
                           `/${window.location.pathname.split('/')[1] || 'en'}/dashboard`;
          
          // Clean up
          sessionStorage.removeItem('auth_redirect');
          
          // Redirect to the intended page
          window.location.href = redirectTo;
        } else {
          throw new Error('No session found after OAuth sign-in');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError(error instanceof Error ? error.message : 'An error occurred during sign-in');
        
        // Redirect to sign-in page after a delay
        setTimeout(() => {
          const locale = window.location.pathname.split('/')[1] || 'en';
          window.location.href = `/${locale}/auth/signin`;
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        {error ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to sign-in page...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-sm text-gray-500">Please wait while we log you in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
