import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ToursHero from '@/components/tours/ToursHero';
import SkeletonList from '@/components/tours/SkeletonList';
import type { Tour } from '@/components/tours/ToursListClient';

// Import the wrapper component directly
import ToursListWrapper from '@/components/tours/ToursListWrapper';

// Mock data - replace with actual data fetching
const getTours = async (): Promise<Tour[]> => {
  // Simulate API call
  return [
    {
      id: 'serengeti-migration',
      slug: 'great-migration-safari',
      title: 'Great Migration Safari',
      description: 'Witness the incredible wildebeest migration in the Serengeti',
      duration: '8 Days / 7 Nights',
      price: 2850,
      originalPrice: 3200,
      rating: 4.9,
      reviewCount: 128,
      destinations: ['Serengeti', 'Ngorongoro', 'Tarangire'],
      image: '/images/tours/serengeti-migration.jpg',
      highlights: ['Great Migration', 'Big Five', 'Hot Air Balloon', 'Luxury Lodges'],
      isFeatured: true,
      isPopular: true,
      discount: 15,
      maxGroupSize: 12,
      difficulty: 'Moderate',
      imageCover: '/images/tours/serengeti-migration-cover.jpg',
      startLocation: 'Arusha, Tanzania',
      ratingsAverage: 4.9,
      ratingsQuantity: 128,
      categories: ['Safari', 'Wildlife', 'Adventure']
    },
    // Add more tours as needed...
  ];
};



export const metadata = {
  title: 'Safari Tours & Packages | Nyika Safaris',
  description: 'Explore our curated collection of African safari tours. From luxury lodges to adventure camping, find your perfect African adventure.',
};

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <div className="min-h-screen bg-gray-50">
      <ToursHero />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Explore Safari Tours</h1>
        <p className="mb-8 text-gray-600">Choose from our range of curated safari experiences</p>
        
        <Suspense fallback={<SkeletonList />}>
          <ToursListWrapper initialTours={tours} />
        </Suspense>
      </main>
    </div>
  );
}
