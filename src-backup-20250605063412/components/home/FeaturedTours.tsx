'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import TourCard from '../tours/TourCard';

type Tour = {
  id: string;
  title: string;
  slug: string;
  duration: number;
  difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING';
  price: number;
  discount?: number;
  image: string;
  rating: number;
  reviewCount: number;
  locations: string[];
};

const featuredTours = [
  {
    id: '1',
    title: 'Serengeti Great Migration Safari',
    slug: 'serengeti-great-migration-safari',
    description: 'Experience the awe-inspiring Great Migration in the Serengeti plains',
    duration: 7,
    maxGroupSize: 12,
    difficulty: 'MEDIUM',
    price: 3200,
    discount: 10,
    imageCover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ratingsAverage: 4.9,
    ratingsQuantity: 128,
    startLocation: {
      address: 'Arusha, Tanzania',
    },
  },
  {
    id: '2',
    title: 'Mount Kilimanjaro Climb - Lemosho Route',
    slug: 'kilimanjaro-lemosho-route',
    description: 'Conquer the Roof of Africa on this challenging 8-day expedition',
    duration: 8,
    maxGroupSize: 10,
    difficulty: 'DIFFICULT',
    price: 2800,
    imageCover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ratingsAverage: 4.8,
    ratingsQuantity: 94,
    startLocation: {
      address: 'Moshi, Tanzania',
    },
  },
  {
    id: '3',
    title: 'Luxury Zanzibar Beach Escape',
    slug: 'zanzibar-luxury-escape',
    description: 'Relax on pristine beaches and explore the spice island',
    duration: 6,
    maxGroupSize: 8,
    difficulty: 'EASY',
    price: 2500,
    discount: 15,
    imageCover: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ratingsAverage: 4.7,
    ratingsQuantity: 76,
    startLocation: {
      address: 'Zanzibar, Tanzania',
    },
  },
];

export function FeaturedTours() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Safari Tours
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover our most popular safari experiences, handpicked by our travel experts
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-full lg:grid-cols-3">
          {featuredTours.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}
              title={tour.title}
              slug={tour.slug}
              description={tour.description}
              duration={tour.duration}
              maxGroupSize={tour.maxGroupSize}
              difficulty={tour.difficulty as 'EASY' | 'MEDIUM' | 'DIFFICULT'}
              price={tour.price}
              discount={tour.discount}
              imageCover={tour.imageCover}
              startLocation={tour.startLocation}
              ratingsAverage={tour.ratingsAverage}
              ratingsQuantity={tour.ratingsQuantity}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" className="px-8 py-6 text-base font-medium">
            <Link href="/tours" className="flex items-center">
              View All Tours
              <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
