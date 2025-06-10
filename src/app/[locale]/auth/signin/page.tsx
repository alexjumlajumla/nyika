'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { AuthForm } from '@/components/auth/AuthForm';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { user, isLoading, error, signIn, signInWithOAuth } = useAuth();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [hasMounted, setHasMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const urlError = searchParams?.get('error');

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Get current locale from URL
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
  
  // Redirect if already signed in
  useEffect(() => {
    if (user && hasMounted && !isLoading) {
      // Check if there's a redirect URL in the query params
      const redirectTo = searchParams?.get('redirectedFrom') || `/${locale}/dashboard`;
      
      // Ensure the URL has the correct locale
      const redirectUrl = redirectTo.startsWith(`/${locale}/`) 
        ? redirectTo 
        : `/${locale}${redirectTo.startsWith('/') ? '' : '/'}${redirectTo}`;
      
      router.push(redirectUrl);
    }
  }, [user, hasMounted, isLoading, router, locale, searchParams]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error || urlError) {
      toast({
        title: 'Error',
        description: error || urlError,
        variant: 'destructive',
      });
    }
  }, [error, urlError, toast]);

  // Handle error messages from URL
  useEffect(() => {
    const urlError = searchParams?.get('error');
    if (urlError) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: urlError,
      });
      
      // Clean up the error from URL without causing a redirect
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('error');
      window.history.replaceState({}, '', cleanUrl.toString());
    }
  }, [searchParams, toast]);

  const handleAuthStateChange = useCallback((isLoading: boolean) => {
    setIsSubmitting(isLoading);
  }, []);

  // Show loading state while checking auth or if not mounted yet
  if (!hasMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Show loading state while form is submitting
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Signing you in...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, the AuthProvider will handle the redirect
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] px-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Nyika Safaris
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <AuthForm 
            mode="signin" 
            onLoadingStateChange={handleAuthStateChange}
            onSignInWithOAuth={signInWithOAuth}
            onSignInWithEmail={signIn}
          />
        </div>
      </div>
    </div>
  );
}
