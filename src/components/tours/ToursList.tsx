'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import TourCard from './TourCard';
import { NewTourFilters } from './NewTourFilters';
import { TourCardProps, TourFilters } from '@/types/tour-filters';
import { Input } from '@/components/ui/input';

interface ToursListProps {
  initialTours: TourCardProps[];
  searchParams?: {
    search?: string;
    destinations?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  };
  locale: string;
}

export default function ToursList({ 
  initialTours, 
  searchParams = {},
  locale 
}: ToursListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    typeof searchParams.search === 'string' ? searchParams.search : ''
  );
  const [filters, setFilters] = useState<TourFilters>({
    destinations: Array.isArray(searchParams.destinations) 
      ? searchParams.destinations 
      : searchParams.destinations 
        ? [searchParams.destinations] 
        : [],
    durations: [],
    priceRange: [
      searchParams.minPrice ? Number(searchParams.minPrice) : 0,
      searchParams.maxPrice ? Number(searchParams.maxPrice) : 10000
    ] as [number, number],
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    filters.destinations.forEach(dest => params.append('destinations', dest));
    if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 10000) params.set('maxPrice', filters.priceRange[1].toString());

    // Update URL without causing a page reload
    router.push(`/${locale}/tours?${params.toString()}`, { scroll: false });
  }, [filters, searchQuery, router, locale]);

  // Handle filter updates
  const handleFilterChange = (newFilters: TourFilters) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      destinations: [],
      durations: [],
      priceRange: [0, 10000] as [number, number],
    });
    setSearchQuery('');
  };

  // Filter tours based on search and filters
  const filteredTours = initialTours.filter((tour: TourCardProps) => {
    // Filter by search query
    if (searchQuery && !tour.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by destinations
    if (filters.destinations.length > 0) {
      const tourDestinations = Array.isArray(tour.destinations) 
        ? tour.destinations 
        : [tour.destinations];
      
      if (!filters.destinations.some((dest: string) => tourDestinations.includes(dest))) {
        return false;
      }
    }

    // Filter by price range
    const price = tour.originalPrice || tour.price;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== '' || 
    filters.destinations.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 10000;

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(prev => !prev);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Tours</h1>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search tours..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile filter dialog */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={toggleMobileFilters}
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Filters sidebar */}
          <div className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={toggleMobileFilters}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <NewTourFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Tours grid */}
          <div className="mt-8 lg:mt-0 lg:col-span-3">
            {/* Active filters */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 mr-4">Active filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: {searchQuery}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300"
                          onClick={() => setSearchQuery('')}
                        >
                          <span className="sr-only">Remove filter</span>
                          <FiX className="h-2 w-2" />
                        </button>
                      </span>
                    )}
                    {filters.destinations.map((destination) => (
                      <span
                        key={destination}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {destination}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 text-green-800 hover:bg-green-300"
                          onClick={() =>
                            setFilters(prev => ({
                              ...prev,
                              destinations: prev.destinations.filter(d => d !== destination)
                            }))
                          }
                        >
                          <span className="sr-only">Remove filter</span>
                          <FiX className="h-2 w-2" />
                        </button>
                      </span>
                    ))}
                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-200 text-purple-800 hover:bg-purple-300"
                          onClick={() =>
                            setFilters(prev => ({
                              ...prev,
                              priceRange: [0, 10000]
                            }))
                          }
                        >
                          <span className="sr-only">Remove filter</span>
                          <FiX className="h-2 w-2" />
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                    onClick={handleClearFilters}
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Tours grid */}
            {filteredTours.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No tours found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTours.map((tour: TourCardProps) => (
                  <TourCard
                    key={String(tour.id)}
                    id={tour.id}
                    title={tour.title}
                    slug={tour.slug}
                    duration={tour.duration}
                    destinations={Array.isArray(tour.destinations) ? tour.destinations : [tour.destinations]}
                    price={tour.price}
                    ratingsAverage={tour.ratingsAverage || 0}
                    ratingsQuantity={tour.ratingsQuantity || 0}
                    imageCover={tour.imageCover}
                    isFeatured={tour.isFeatured}
                    discount={tour.discount}
                    originalPrice={tour.originalPrice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}