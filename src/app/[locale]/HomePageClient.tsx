'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

interface LoadingSkeletonProps {
  className?: string;
}

// Type guard for locale
function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Error boundary component for handling component loading errors
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const t = useTranslations('Common');
  
  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="mb-4 text-2xl font-bold text-red-600">{t('error.title') || 'Something went wrong'}</h2>
      <p className="mb-4 text-gray-700">{error.message}</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        {t('error.retry') || 'Try again'}
      </Button>
    </div>
  );
}

// Loading skeleton for components
const LoadingSkeleton = ({ className = '' }: LoadingSkeletonProps) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

// Dynamic imports with error boundaries and loading states
const DynamicHeroSection = dynamic(
  () => import('@/components/home/HeroSection').then((mod) => mod.HeroSection),
  { 
    loading: () => <LoadingSkeleton className="h-[80vh]" />,
    ssr: false 
  }
);

const DynamicFeaturedTours = dynamic(
  () => import('@/components/home/FeaturedTours').then((mod) => mod.FeaturedTours),
  { 
    loading: () => (
      <div className="py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">
          <LoadingSkeleton className="mx-auto h-10 w-64" />
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 rounded-lg border p-4">
              <Skeleton className="aspect-video w-full rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    ),
    ssr: false 
  }
);

const DynamicTestimonialsSection = dynamic(
  () => import('@/components/home/TestimonialsSection').then((mod) => mod.TestimonialsSection),
  { 
    loading: () => (
      <div className="py-20">
        <h2 className="mb-8 text-center text-3xl font-bold">
          <LoadingSkeleton className="mx-auto h-10 w-80" />
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 rounded-lg bg-gray-50 p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    ),
    ssr: false 
  }
);

const DynamicCallToAction = dynamic(
  () => import('@/components/home/CallToAction').then((mod) => mod.CallToAction),
  { 
    loading: () => (
      <div className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto mb-6 h-10 w-3/4" />
            <Skeleton className="mx-auto mb-8 h-6 w-1/2" />
            <Skeleton className="mx-auto h-12 w-48" />
          </div>
        </div>
      </div>
    ),
    ssr: false 
  }
);

interface HomePageClientProps {
  locale: Locale;
}

export function HomePageClient({ locale }: HomePageClientProps) {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set page title and other metadata
  useEffect(() => {
    try {
      document.title = t('title') || 'Nyika Safaris';
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          'content',
          t('description') || 'Experience the best safaris in Africa with Nyika Safaris'
        );
      }
    } catch {
      // Silently handle metadata update errors
    }
  }, [t, locale]);

  // Reset error state
  const resetError = () => {
    setHasError(false);
    setError(null);
    router.refresh();
  };

  // Validate locale
  if (!isValidLocale(locale)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Invalid Locale</h1>
          <p className="mb-4">The requested language is not supported.</p>
          <Button onClick={() => router.push('/en')}>
            Go to English Version
          </Button>
        </div>
      </div>
    );
  }

  // Show error boundary if there's an error
  if (hasError && error) {
    return <ErrorFallback error={error} resetErrorBoundary={resetError} />;
  }

  return (
    <div className="min-h-screen">
      <DynamicHeroSection />
      <DynamicFeaturedTours />
      <DynamicTestimonialsSection />
      <DynamicCallToAction />
    </div>
  );
}
