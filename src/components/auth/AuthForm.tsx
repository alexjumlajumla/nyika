'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export interface AuthFormProps {
  mode: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onLoadingStateChange?: (isLoading: boolean) => void;
  onSignInWithOAuth?: (provider: 'google' | 'github') => Promise<any>;
  onSignInWithEmail?: (email: string, password: string) => Promise<any>;
}

export function AuthForm({ 
  mode, 
  onModeChange, 
  onLoadingStateChange,
  onSignInWithOAuth,
  onSignInWithEmail
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  // Notify parent component of loading state changes
  useEffect(() => {
    if (onLoadingStateChange) {
      onLoadingStateChange(isLoading);
    }
  }, [isLoading, onLoadingStateChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if we're in the middle of a sign-in
    if (isLoading) {
      return;
    }
    
    // Basic form validation
    if (mode === 'forgot-password') {
      if (!email) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please enter your email address',
        });
        return;
      }
    } else if (mode === 'signin' || mode === 'signup') {
      if (!email || !password) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please fill in all required fields',
        });
        return;
      }
    }
    
    setIsLoading(true);

    try {
      if (mode === 'signin' && onSignInWithEmail) {
        const { error, user } = await onSignInWithEmail(email, password);
        if (error) throw error;
        
        // If we have a user, the sign-in was successful
        if (user) {
          // Add a small delay to ensure the session is fully established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Force a page reload to ensure all auth state is properly set
          window.location.href = callbackUrl;
        }
      } else if (mode === 'forgot-password') {
        if (!email) {
          throw new Error('Please enter your email address');
        }
        // Handle forgot password flow
        toast({
          title: 'Password Reset',
          description: 'If an account exists with this email, you will receive a password reset link.',
        });
      }
    } catch (error: any) {
      // Log the error to your error tracking service in production
      // For now, we'll just show a user-friendly error message
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In is now handled by the GoogleSignInButton component

  // Remove the header since it's now in the page component
  const renderEmailForm = () => (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="h-10 w-full"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-10 w-full"
          />
        </div>

        {(mode === 'signin' || mode === 'signup') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              {mode === 'signin' && (
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => onModeChange?.('forgot-password')}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === 'signin' || mode === 'signup'}
              disabled={isLoading}
              minLength={mode === 'signin' || mode === 'signup' ? 6 : undefined}
              className="h-10 w-full"
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-10 mt-4" 
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'signin' && 'Sign In'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'forgot-password' && 'Send Reset Link'}
        </Button>
      </form>
      
      {(mode === 'signin' || mode === 'signup') && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderFooter = () => (
    <div className="text-center text-sm">
      {mode === 'signin' ? (
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onModeChange?.('signup')}
          >
            Sign up
          </button>
        </p>
      ) : mode === 'signup' ? (
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => onModeChange?.('signin')}
          >
            Sign in
          </button>
        </p>
      ) : (
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={() => onModeChange?.('signin')}
        >
          ← Back to sign in
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {renderEmailForm()}
      
      {/* Google Sign In Button */}
      {(mode === 'signin' || mode === 'signup') && (
        <div className="w-full">
          <GoogleSignInButton 
            callbackUrl={callbackUrl} 
            onSignInWithOAuth={onSignInWithOAuth}
            isLoading={isLoading}
            onLoadingChange={setIsLoading}
          />
        </div>
      )}
      
      {/* Footer Links */}
      {renderFooter()}
    </div>
  );
}