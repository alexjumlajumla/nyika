'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || null;

  useEffect(() => {
    // Log the error to an error reporting service
    if (error) {
      console.error('Authentication error:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error === 'CredentialsSignin'
              ? 'Invalid credentials. Please try again.'
              : 'An error occurred during authentication. Please try again.'}
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/en/auth/signin"
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
