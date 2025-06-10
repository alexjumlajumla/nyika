'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSignIn } from '@/hooks/useSignIn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  params: {
    lang: string;
  };
};

export default function SignInPage({ params: { lang } }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useSignIn();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      let callbackUrl = searchParams?.get('callbackUrl');
      
      // If no callback URL, use the dashboard with the current locale
      if (!callbackUrl) {
        callbackUrl = `/${lang}/dashboard`;
      } else {
        // Ensure the callback URL has the correct locale prefix
        if (!callbackUrl.startsWith(`/${lang}/`) && !callbackUrl.startsWith('/api/')) {
          // If the URL is absolute (starts with /), just prepend the locale
          if (callbackUrl.startsWith('/')) {
            callbackUrl = `/${lang}${callbackUrl}`;
          } else {
            // If it's a relative URL, make sure it has the locale
            callbackUrl = `/${lang}/${callbackUrl}`;
          }
        }
      }
      
      // Use replace instead of push to prevent going back to the login page
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, lang, router, searchParams]);

  // Handle error from URL query params
  useEffect(() => {
    if (searchParams) {
      const error = searchParams.get('error');
      if (error === 'CredentialsSignin') {
        setError('Invalid email or password');
      } else if (error) {
        setError('An error occurred during sign in');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const callbackUrl = searchParams?.get('callbackUrl') || `/${lang}/dashboard`;
    
    const result = await signIn({
      email,
      password,
      callbackUrl,
      redirect: true,
    });

    if (!result.success) {
      setError(result.error || 'An error occurred during sign in');
    }
    
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 p-4 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto mb-2 h-10 w-10" />
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to Nyika Safaris
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-destructive/15 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href={`/${lang}/auth/forgot-password`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => signIn({ provider: 'google' })}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => signIn({ provider: 'github' })}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href={`/${lang}/auth/register`}
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
