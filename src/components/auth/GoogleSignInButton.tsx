'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface GoogleSignInButtonProps {
  callbackUrl?: string;
  isLoading?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
  onSignInWithOAuth?: (provider: 'google' | 'github') => Promise<any>;
}

export function GoogleSignInButton({ 
  callbackUrl = '/dashboard',
  isLoading: externalIsLoading = false,
  onLoadingChange,
  onSignInWithOAuth
}: GoogleSignInButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isInternalLoading, setIsInternalLoading] = useState(false);
  const isLoading = externalIsLoading || isInternalLoading;

  // Notify parent component of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    try {
      setIsInternalLoading(true);
      
      // If an external OAuth handler is provided, use it
      if (onSignInWithOAuth) {
        const { error } = await onSignInWithOAuth('google');
        if (error) throw error;
        return;
      }
      
      // If no handler is provided, redirect to the sign-in page
      // which will handle the OAuth flow
      const currentUrl = new URL(window.location.href);
      const returnTo = callbackUrl || currentUrl.pathname + currentUrl.search;
      const locale = window.location.pathname.split('/')[1] || 'en';
      
      // Redirect to the sign-in page with the OAuth provider
      const signInUrl = new URL(`/${locale}/auth/signin`, window.location.origin);
      signInUrl.searchParams.set('provider', 'google');
      signInUrl.searchParams.set('callbackUrl', returnTo);
      
      router.push(signInUrl.toString());
    } catch (error: any) {
      // Log the error to your error tracking service in production
      // For now, we'll just show a user-friendly error message
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to sign in with Google',
      });
    } finally {
      setIsInternalLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={handleSignIn}
      className="w-full h-10 flex items-center justify-center gap-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {isLoading ? (
        <Icons.spinner className="h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">Continue with Google</span>
    </Button>
  );
}
