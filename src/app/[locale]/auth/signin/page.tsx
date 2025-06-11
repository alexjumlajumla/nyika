'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const { user, isLoading, error, signIn, signInWithOAuth } = useAuth();
  
  const [hasMounted, setHasMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({ 
    email: '', 
    password: '' 
  });
  
  const urlError = searchParams?.get('error');
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';

  // Set mounted state on client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle redirect after successful login or when user is already authenticated
  useEffect(() => {
    if (user && hasMounted && !isLoading) {
      // Get the redirect path, default to dashboard
      let redirectTo = searchParams?.get('redirectedFrom') || `/${locale}/dashboard`;
      
      // Ensure we have a valid path
      if (!redirectTo.startsWith('/')) {
        redirectTo = `/${redirectTo}`;
      }
      
      // Ensure the path starts with the locale
      const pathSegments = redirectTo.split('/').filter(Boolean);
      if (!['en', 'sw'].includes(pathSegments[0])) {
        redirectTo = `/${locale}${redirectTo}`;
      }
      
      // Clean up any potential double slashes
      redirectTo = redirectTo.replace(/([^:]\/)\/+/g, '$1');
      
      // Prevent redirecting to auth pages
      if (redirectTo.includes('/auth/')) {
        redirectTo = `/${locale}/dashboard`;
      }
      
      // Only redirect if we're not already on the target path
      if (window.location.pathname !== redirectTo) {
        window.location.href = redirectTo;
      }
    }
  }, [user, hasMounted, isLoading, locale, searchParams]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  // Handle OAuth errors from URL
  useEffect(() => {
    if (urlError) {
      toast({
        title: 'Authentication Error',
        description: urlError === 'OAuthAccountNotLinked' 
          ? 'This email is already associated with another account. Please sign in with the original provider.'
          : 'Failed to sign in. Please try again.',
        variant: 'destructive',
      });
      
      // Clean up the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [urlError]);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Get the current locale from the URL
      const currentLocale = window.location.pathname.split('/')[1] || 'en';
      let redirectTo = searchParams?.get('redirectedFrom') || `/${currentLocale}/dashboard`;
      
      // Ensure the redirect path includes the locale
      if (!redirectTo.startsWith(`/${currentLocale}/`)) {
        redirectTo = `/${currentLocale}${redirectTo.startsWith('/') ? '' : '/'}${redirectTo}`;
      }
      
      sessionStorage.setItem('auth_redirect', redirectTo);
      
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email, formData.password, isSubmitting, searchParams, signIn]);
  
  const handleOAuthSignIn = useCallback(async (provider: 'google' | 'github') => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Get the current locale from the URL
      const currentLocale = window.location.pathname.split('/')[1] || 'en';
      let redirectTo = searchParams?.get('redirectedFrom') || `/${currentLocale}/dashboard`;
      
      // Ensure the redirect path includes the locale
      if (!redirectTo.startsWith(`/${currentLocale}/`)) {
        redirectTo = `/${currentLocale}${redirectTo.startsWith('/') ? '' : '/'}${redirectTo}`;
      }
      
      sessionStorage.setItem('oauth_redirect', redirectTo);
      
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, searchParams, signInWithOAuth]);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] px-4">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-12 w-12" />
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to Nyika Safaris
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isSubmitting}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading || isSubmitting}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isSubmitting}
            >
              {(isLoading || isSubmitting) ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.logo className="mr-2 h-4 w-4" />
              )}
              Sign In
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading || isSubmitting}
              className="w-full"
            >
              {isLoading || isSubmitting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>
          </form>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
