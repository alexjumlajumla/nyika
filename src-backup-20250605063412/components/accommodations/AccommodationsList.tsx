'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Wifi, Coffee, Waves, Droplets, Utensils, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { PerNightDisplay } from '@/components/PerNightDisplay';

export interface Accommodation {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  type: 'Lodge' | 'Tented Camp' | 'Luxury Lodge' | 'Beach Resort';
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-4 w-4" />,
  'Restaurant': <Utensils className="h-4 w-4" />,
  'Pool': <Waves className="h-4 w-4" />,
  'Spa': <Droplets className="h-4 w-4" />,
  'Gym': <Dumbbell className="h-4 w-4" />,
  'Bar': <Coffee className="h-4 w-4" />,
};

export default function AccommodationsList({ initialAccommodations }: { initialAccommodations: Accommodation[] }) {
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: [0, 10000],
    amenities: [] as string[],
  });

  // Set up client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter accommodations based on current filters
  const filteredAccommodations = initialAccommodations.filter(acc => {
    // Filter by type
    if (filters.type !== 'all' && !acc.type.toLowerCase().includes(filters.type)) {
      return false;
    }
    
    // Filter by price range
    if (acc.price < filters.priceRange[0] || acc.price > filters.priceRange[1]) {
      return false;
    }
    
    // Filter by amenities
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        acc.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    
    return true;
  });

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="py-16 text-center">
        <div className="animate-pulse">Loading accommodations...</div>
      </div>
    );
  }

  if (!initialAccommodations.length) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-medium text-gray-900">No accommodations available</h3>
        <p className="mt-1 text-gray-500">Please check back later for new accommodations.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-8">
              {/* Type Filter */}
              <div className="rounded-lg bg-white p-4 shadow">
                <h3 className="mb-3 font-medium">Accommodation Type</h3>
                <div className="space-y-2">
                  {['all', 'Lodge', 'Tented Camp', 'Beach Resort', 'Luxury Lodge'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="type"
                        checked={filters.type === type.toLowerCase()}
                        onChange={() => setFilters({...filters, type: type.toLowerCase()})}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                        {type === 'all' ? 'All Types' : type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="rounded-lg bg-white p-4 shadow">
                <h3 className="mb-3 font-medium">Price Range</h3>
                <div className="space-y-2">
                  {['all', '0-500', '500-1000', '1000-2000', '2000+'].map((range) => {
                    const [min, max] = range === 'all' ? [0, 10000] : range.endsWith('+') 
                      ? [parseInt(range), 10000] 
                      : range.split('-').map(Number);
                    
                    return (
                      <div key={range} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${range}`}
                          name="price"
                          checked={filters.priceRange[0] === min && filters.priceRange[1] === (max || 10000)}
                          onChange={() => setFilters({
                            ...filters, 
                            priceRange: [min, max || 10000]
                          })}
                          className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`price-${range}`} className="ml-2 text-sm text-gray-700">
                          {range === 'all' 
                            ? 'Any Price' 
                            : range.endsWith('+') 
                              ? `$${range.replace('+', '')}+`
                              : `$${range.replace('-', ' - $')}`}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="rounded-lg bg-white p-4 shadow">
                <h3 className="mb-3 font-medium">Amenities</h3>
                <div className="space-y-2">
                  {Object.entries(amenityIcons).map(([amenity, icon]) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            amenities: e.target.checked
                              ? [...filters.amenities, amenity]
                              : filters.amenities.filter(a => a !== amenity)
                          });
                        }}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="ml-2 flex items-center text-sm text-gray-700">
                        <span className="mr-2">{icon}</span>
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accommodations Grid */}
          <div className="mt-12 lg:col-span-3 lg:mt-0">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {filteredAccommodations.map((acc) => (
                <div 
                  key={acc.id} 
                  className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="aspect-w-16 aspect-h-10 overflow-hidden bg-gray-100">
                    <Image
                      src={acc.image}
                      alt={acc.name}
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="bg-primary-600 absolute right-3 top-3 flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      {acc.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                        {acc.name}
                      </h3>
                      <span className="bg-primary-100 text-primary-800 rounded px-2 py-1 text-xs">
                        {acc.type}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                      {acc.location}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {acc.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {acc.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {amenityIcons[amenity] || null}
                          <span className="ml-1">{amenity}</span>
                        </span>
                      ))}
                      {acc.amenities.length > 4 && (
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          +{acc.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <span className="text-sm text-gray-500">From</span>
                        <PerNightDisplay 
                          amount={acc.price} 
                          className="text-lg font-bold"
                          showPerNight={false}
                        />
                      </div>
                      <Link 
                        href={`/accommodations/${encodeURIComponent(acc.id.toString())}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredAccommodations.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">No accommodations match your filters</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
