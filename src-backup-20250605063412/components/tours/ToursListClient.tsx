'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TourCard from './TourCard';
import MobileFilterDrawer from './MobileFilterDrawer';

// Import ToursFilter component directly instead of using dynamic import
import ToursFilter from './ToursFilter';

export interface Tour {
  id: string;
  title: string;
  slug: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  destinations: string[];
  image: string;
  highlights: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  discount?: number;
  description?: string;
  maxGroupSize?: number;
  difficulty?: string;
  imageCover?: string;
  startLocation?: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  categories?: string[];
}

export interface ToursListClientProps {
  initialTours: Tour[];
}

export default function ToursListClient({ initialTours }: ToursListClientProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    duration: [] as string[],
    destinations: [] as string[],
    difficulty: [] as string[],
  });

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters - Visible on larger screens */}
          <aside className="hidden lg:block lg:w-1/4">
            <ToursFilter />
          </aside>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Mobile Filter Toggle */}
            <div className="mb-6 lg:hidden">
              <button 
                className="bg-safari-brown hover:bg-safari-brown/90 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white shadow-md transition-colors"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <span className="font-medium">Filter Tours</span>
              </button>
              <MobileFilterDrawer 
                isOpen={isMobileFiltersOpen} 
                onClose={() => setIsMobileFiltersOpen(false)} 
              />
            </div>
            
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Our Safari Tours</h2>
              <p className="text-gray-600">{initialTours.length} tours available</p>
            </div>
            
            {/* Tours Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {initialTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  id={tour.id}
                  title={tour.title}
                  slug={tour.id}
                  duration={tour.duration}
                  price={tour.price}
                  originalPrice={tour.originalPrice}
                  rating={tour.rating}
                  reviewCount={tour.reviewCount}
                  destinations={tour.destinations}
                  image={tour.image}
                  highlights={tour.highlights}
                  isFeatured={tour.isFeatured}
                  isPopular={tour.isPopular}
                  discount={tour.discount}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <button 
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  Previous
                </button>
                {[1, 2, 3, '...', 8].map((page, i) => (
                  <button
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${
                      page === 1 
                        ? 'bg-safari-brown text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
