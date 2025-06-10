'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Tour {
  id: string;
  title: string;
  slug: string;
  price: string;
  duration: string;
  image: string;
  rating: number;
  reviewCount: number;
  description?: string;
}

interface Destination {
  id: string;
  title: string;
  slug: string;
  image: string;
  country: string;
  description: string;
}

const mockData = {
  featuredTours: [
    {
      id: '1',
      title: 'Serengeti Migration Safari',
      slug: 'serengeti-migration-safari',
      price: '2500',
      duration: '7 days',
      image: 'https://source.unsplash.com/random/800x600/?safari,africa',
      rating: 4.8,
      reviewCount: 124,
      description: 'Witness the great wildebeest migration across the Serengeti plains',
    },
    {
      id: '2',
      title: 'Mount Kilimanjaro Trek',
      slug: 'kilimanjaro-trek',
      price: '3500',
      duration: '8 days',
      image: 'https://source.unsplash.com/random/800x600/?kilimanjaro',
      rating: 4.9,
      reviewCount: 98,
      description: 'Conquer Africa\'s highest peak on this challenging trek',
    },
  ],
  featuredDestinations: [
    {
      id: '1',
      title: 'Serengeti National Park',
      slug: 'serengeti-national-park',
      image: 'https://source.unsplash.com/random/600x400/?serengeti',
      country: 'Tanzania',
      description: 'Home to the great wildebeest migration.'
    },
    {
      id: '2',
      title: 'Ngorongoro Crater',
      slug: 'ngorongoro-crater',
      image: 'https://source.unsplash.com/random/600x400/?crater',
      country: 'Tanzania',
      description: 'The world\'s largest inactive volcanic caldera.'
    }
  ]
};

function HomeClient() {
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [data] = useState(mockData);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-10 bg-black/50"></div>
        <div className="absolute inset-0">
          <Image
            src="https://source.unsplash.com/random/1920x1080/?africa,safari"
            alt="African Safari"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 mx-auto max-w-4xl px-4">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">Discover Africa's Wild Beauty</h1>
          <p className="mb-8 text-xl md:text-2xl">Experience the adventure of a lifetime with our expertly guided safaris</p>
          <Link 
            href="/tours"
            className="inline-block rounded-full bg-amber-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-amber-700"
          >
            Explore Tours
          </Link>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Featured Tours</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.featuredTours.map((tour) => (
              <div key={tour.id} className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl">
                <div className="relative h-48">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">{tour.title}</h3>
                  <div className="mb-2 flex items-center">
                    <div className="flex text-amber-500">
                      {'★'.repeat(5)}
                    </div>
                    <span className="ml-2 text-gray-600">{tour.rating} ({tour.reviewCount})</span>
                  </div>
                  <p className="mb-4 text-gray-600">{tour.description || 'Experience the adventure of a lifetime'}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{tour.duration}</p>
                      <p className="font-semibold">From ${tour.price}</p>
                    </div>
                    <Link 
                      href={`/tours/${tour.slug}`}
                      className="font-medium text-amber-600 hover:text-amber-700"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link 
              href="/tours"
              className="inline-block rounded-full border-2 border-amber-600 px-6 py-2 font-bold text-amber-600 transition-colors hover:bg-amber-600 hover:text-white"
            >
              View All Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Popular Destinations</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.featuredDestinations.map((destination) => (
              <Link 
                key={destination.id}
                href={`/destinations/${destination.slug}`}
                className="group relative h-64 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 z-10 bg-black/40 transition-colors group-hover:bg-black/60"></div>
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="relative z-20 flex h-full flex-col justify-end p-6">
                  <h3 className="mb-1 text-2xl font-bold text-white">{destination.title}</h3>
                  <p className="text-gray-200">{destination.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready for an Adventure?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">Book your dream safari today and create memories that will last a lifetime.</p>
          <Link 
            href="/contact"
            className="inline-block rounded-full bg-white px-8 py-3 text-lg font-bold text-amber-600 transition-colors hover:bg-gray-100"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomeClient;
