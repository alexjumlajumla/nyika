'use client';

import { signIn as nextAuthSignIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type SignInOptions = {
  redirect?: boolean;
  callbackUrl?: string;
  email?: string;
  password?: string;
  provider?: string;
};

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  const signIn = useCallback(async ({
    redirect = true,
    callbackUrl: customCallbackUrl,
    email,
    password,
    provider = 'credentials',
  }: SignInOptions = {}) => {
    try {
      const result = await nextAuthSignIn(provider, {
        email,
        password,
        redirect: false,
        callbackUrl: customCallbackUrl || callbackUrl,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      if (redirect && result?.url) {
        router.push(result.url);
        router.refresh();
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign in' 
      };
    }
  }, [callbackUrl, router]);

  return signIn;
}
