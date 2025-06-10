'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function SimpleHero() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-indigo-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">Welcome to Nyika Safaris</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-indigo-100 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Experience the ultimate African safari adventure with Nyika Safaris.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="rounded-md shadow">
              <Link
                href="/tours"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-50 md:px-10 md:py-4 md:text-lg"
              >
                Explore Tours
              </Link>
            </div>
            {status === 'authenticated' ? (
              <div className="ml-3 rounded-md shadow">
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-200 md:px-10 md:py-4 md:text-lg"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="ml-3 rounded-md shadow">
                <Link
                  href="/auth/signin"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-200 md:px-10 md:py-4 md:text-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
