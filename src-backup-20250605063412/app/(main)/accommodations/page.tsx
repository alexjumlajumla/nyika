'use client';

import { useState, useEffect } from 'react';
import { AccommodationList } from './_components/AccommodationList';
import { SearchFilters } from './_components/SearchFilters';
import { getAccommodations } from './_lib/accommodations';
import type { Accommodation } from './_lib/accommodations';

const AccommodationsPage = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch accommodations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAccommodations();
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="border-safari-brown h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-safari-brown py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Luxury Accommodations</h1>
          <p className="mx-auto max-w-3xl text-xl md:text-2xl">
            Discover handpicked luxury lodges and camps across Africa's most spectacular destinations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <SearchFilters />
          </div>
          
          {/* Accommodation List */}
          <div className="lg:w-3/4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {accommodations.length} Accommodations Found
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <select 
                  aria-label="Sort accommodations"
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
                >
                  <option>Recommended</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Rating (High to Low)</option>
                </select>
              </div>
            </div>
            
            <AccommodationList accommodations={accommodations} />
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <button 
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50" 
                  disabled
                  aria-label="Previous page"
                >
                  Previous
                </button>
                {[1, 2, 3, '...', 5].map((page, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={typeof page === 'number' ? `Go to page ${page}` : 'More pages'}
                    disabled={page === '...'}
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${
                      page === 1 
                        ? 'bg-safari-brown text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${page === '...' ? 'cursor-default' : ''}`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  type="button"
                  aria-label="Next page"
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50"
                >
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

export default AccommodationsPage;
