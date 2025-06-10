import { notFound } from 'next/navigation';
import { fetchAccommodationBySlug } from '@/lib/supabase/accommodations';
import AccommodationLoader from './AccommodationLoader';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// This tells Next.js to only render this page at build time
// and cache the result
const dynamic = 'force-static';
// Revalidate at most every hour
const revalidate = 3600;

export { dynamic, revalidate };

export default async function AccommodationDetailPage({ params }: PageProps) {
  try {
    const accommodation = await fetchAccommodationBySlug(params.slug);
    
    if (!accommodation) {
      notFound();
    }

    // Pass the initial data and slug to the loader component
    return <AccommodationLoader initialData={accommodation} slug={params.slug} />;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error in page component:', error);
    }
    notFound();
  }
}
