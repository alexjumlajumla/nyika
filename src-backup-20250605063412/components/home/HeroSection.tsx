'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { data: session, status } = useSession();

  return (
    <div className="relative overflow-hidden bg-gray-900">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-70"
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="African Safari Landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-48 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover the Magic of Africa
            </h1>
            <p className="mt-6 max-w-lg text-xl text-indigo-100">
              Experience the ultimate luxury safari adventure with Nyika Safaris. 
              Explore breathtaking landscapes and encounter majestic wildlife in their natural habitat.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-indigo-700 md:px-8 md:py-4 md:text-lg"
              >
                Explore Our Tours
              </Link>
              {status === 'authenticated' ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-indigo-700 transition-colors duration-200 hover:bg-gray-100 md:px-8 md:py-4 md:text-lg"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-indigo-700 transition-colors duration-200 hover:bg-gray-100 md:px-8 md:py-4 md:text-lg"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
