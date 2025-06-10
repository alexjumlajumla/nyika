'use client';

import React from 'react';
import { Tour } from '@/types/tour';
import TourFilters from '@/components/tours/TourFilters';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useTourStore from '@/store/useTourStore';

interface ToursListProps {
  tours: Tour[];
}

// Client component that handles client-side interactivity
export default function ToursList({ initialTours }: { initialTours: Tour[] }) {
  const [isClient, setIsClient] = useState(false);
  
  // Get filter states from store
  const {
    searchQuery,
    selectedDestinations,
    selectedDurations,
    priceRange,
    setPriceRange,
  } = useTourStore();

  // Set up initial price range on mount
  useEffect(() => {
    if (initialTours.length > 0) {
      const minPrice = Math.min(...initialTours.map(tour => tour.price));
      const maxPrice = Math.max(...initialTours.map(tour => tour.price));
      setPriceRange([minPrice, maxPrice]);
      setIsClient(true);
    }
  }, [initialTours, setPriceRange]);
  
  // Filter tours based on current filters
  const filteredTours = useMemo(() => {
    return initialTours.filter(tour => {
      // Search filter
      const matchesSearch = searchQuery 
        ? tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tour.highlights?.some(h => 
            typeof h === 'string' && h.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        : true;
      
      // Destination filter
      const matchesDestination = selectedDestinations.length === 0 || 
        selectedDestinations.some(dest => 
          tour.destination.toLowerCase().includes(dest.toLowerCase())
        );
      
      // Duration filter
      const matchesDuration = selectedDurations.length === 0 || 
        selectedDurations.some(duration => 
          tour.duration.toLowerCase().includes(duration.toLowerCase())
        );
      
      // Price range filter
      const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];
      
      return matchesSearch && matchesDestination && matchesDuration && matchesPrice;
    });
  }, [initialTours, searchQuery, selectedDestinations, selectedDurations, priceRange]);

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="py-16 text-center">
        <div className="animate-pulse">Loading tours...</div>
      </div>
    );
  }

  if (!initialTours.length) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-medium text-gray-900">No tours available</h3>
        <p className="mt-1 text-gray-500">Please check back later for new tours.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <TourFilters priceRange={priceRange} />
            </div>
          </div>

          {/* Tours Grid */}
          <div className="mt-12 lg:col-span-3 lg:mt-0">
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => (
                <div 
                  key={tour.id} 
                  className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-gray-100">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="bg-primary-600 absolute right-3 top-3 flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      {tour.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                        {tour.title}
                      </h3>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                      {tour.destination}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                      {tour.duration}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          ${tour.price.toLocaleString()}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">/ person</span>
                      </div>
                      <Link 
                        href={`/tours/${encodeURIComponent(tour.id.toString())}`}
                        className="bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredTours.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">No tours match your filters</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
