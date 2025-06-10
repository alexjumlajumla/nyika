'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

// Icons
import { Star, MapPin } from 'lucide-react';

// Components
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Types
import { Accommodation } from '@/types/accommodation';

// Types for sort options and price ranges
type SortOption = 'rating_desc' | 'price_asc' | 'price_desc' | 'name_asc';

interface SortOptionItem {
  value: SortOption;
  label: string;
}

interface PriceRangeItem {
  id: string;
  label: string;
  value: string;
}

// Accommodation type info with proper typing
type AccommodationTypeInfo = {
  label: string;
  icon: string;
};

const ACCOMMODATION_TYPES: Record<string, AccommodationTypeInfo> = {
  'hotel': { label: 'Hotel', icon: '🏨' },
  'lodge': { label: 'Lodge', icon: '🏡' },
  'safari_lodge': { label: 'Safari Lodge', icon: '🦁' },
  'camp': { label: 'Tented Camp', icon: '⛺' },
  'tented_camp': { label: 'Tented Camp', icon: '⛺' },
  'resort': { label: 'Resort', icon: '🏖️' },
  'beach_resort': { label: 'Beach Resort', icon: '🏝️' },
  'guesthouse': { label: 'Guesthouse', icon: '🏠' },
  'eco-lodge': { label: 'Eco Lodge', icon: '🌿' },
  'eco_lodge': { label: 'Eco Lodge', icon: '🌿' },
  'villa': { label: 'Villa', icon: '🏡' },
  'luxury_camp': { label: 'Luxury Camp', icon: '⛺✨' },
  'mountain_lodge': { label: 'Mountain Lodge', icon: '⛰️' },
  'treehouse': { label: 'Treehouse', icon: '🌳' },
  'private_island': { label: 'Private Island', icon: '🏝️' },
  'game_lodge': { label: 'Game Lodge', icon: '🦓' },
  'bush_camp': { label: 'Bush Camp', icon: '🌿' },
  'beach_house': { label: 'Beach House', icon: '🏖️' },
  'chalet': { label: 'Chalet', icon: '❄️' },
  'apartment': { label: 'Apartment', icon: '🏢' },
  'bed_and_breakfast': { label: 'B&B', icon: '🍳' },
  'hostel': { label: 'Hostel', icon: '🛏️' },
  'other': { label: 'Accommodation', icon: '🏠' }
};

// Helper function to get accommodation type info
export const getAccommodationTypeInfo = (type: string): AccommodationTypeInfo => {
  return ACCOMMODATION_TYPES[type] || { label: type, icon: '🏠' };
};

// Sort options
export const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

// Price range options
export const PRICE_RANGES: PriceRangeItem[] = [
  { id: 'all', label: 'All Prices', value: '0-10000' },
  { id: '0-100', label: '$0 - $100', value: '0-100' },
  { id: '100-250', label: '$100 - $250', value: '100-250' },
  { id: '250-500', label: '$250 - $500', value: '250-500' },
  { id: '500+', label: '$500+', value: '500-10000' },
];

interface Filters {
  searchQuery: string;
  type: string;
  priceRange: string;
  amenities: string[];
  sortBy: SortOption;
}

interface AccommodationsListProps {
  initialAccommodations: Accommodation[];
}

function AccommodationsList({ initialAccommodations }: AccommodationsListProps) {
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    type: 'all',
    priceRange: '0-10000',
    amenities: [],
    sortBy: 'rating_desc',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const debouncedSearchQuery = useDebounce(filters.searchQuery, 300);

  const availableAccommodationTypes = useMemo(() => {
    const types = new Set<string>();
    initialAccommodations.forEach(acc => {
      if (acc.type) {
        types.add(acc.type);
      }
    });
    return ['all' as const, ...Array.from(types).sort()];
  }, [initialAccommodations]);

  const allAmenities = useMemo(() => {
    const amenities = new Set<string>();
    initialAccommodations.forEach(acc => {
      acc.amenities?.forEach((amenity: string) => amenities.add(amenity));
    });
    return Array.from(amenities).sort();
  }, [initialAccommodations]);

  const filteredAccommodations = useMemo(() => {
    let result = [...initialAccommodations];

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (acc) =>
          acc.name.toLowerCase().includes(query) ||
          acc.location?.toLowerCase().includes(query) ||
          acc.description?.toLowerCase().includes(query) ||
          acc.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    if (filters.type !== 'all') {
      result = result.filter((acc) => acc.type === filters.type);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(
        (acc) => acc.price_per_night >= min && acc.price_per_night <= max
      );
    }

    if (filters.amenities.length > 0) {
      result = result.filter((acc) =>
        filters.amenities.every((amenity) => acc.amenities?.includes(amenity))
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return (a.price_per_night || 0) - (b.price_per_night || 0);
        case 'price_desc':
          return (b.price_per_night || 0) - (a.price_per_night || 0);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [initialAccommodations, filters, debouncedSearchQuery]);

  const handleTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: type === prev.type ? 'all' : type,
    }));
  };

  const handlePriceRangeChange = (range: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value,
    }));
  };

  // Clear all filters function - will be used in reset button
  const handleClearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      type: 'all',
      priceRange: '0-10000',
      amenities: [],
      sortBy: 'rating_desc',
    });
  }, []);
  
  // This function will be used in the reset button
  const handleResetFilters = handleClearFilters;

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading accommodations...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <Input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search accommodations..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
              
              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Accommodation Type</h4>
                <div className="space-y-2">
                  {availableAccommodationTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.type === type}
                        onCheckedChange={(checked) =>
                          checked && handleTypeChange(type)
                        }
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="ml-3 text-sm text-gray-700 capitalize"
                      >
                        {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <Checkbox
                        id={`price-${range.id}`}
                        checked={filters.priceRange === range.id}
                        onCheckedChange={(checked) =>
                          checked && handlePriceRangeChange(range.id)
                        }
                      />
                      <Label
                        htmlFor={`price-${range.id}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                <div className="space-y-2">
                  {allAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label
                        htmlFor={`amenity-${amenity}`}
                        className="ml-3 text-sm text-gray-700 capitalize"
                      >
                        {amenity.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accommodations Grid */}
          <div className="mt-8 lg:col-span-3 lg:mt-0">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredAccommodations.map((accommodation: Accommodation) => (
                <div key={accommodation.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-w-3 aspect-h-2 bg-gray-200">
                    <img
                      src={accommodation.images?.[0] || '/placeholder-image.jpg'}
                      alt={accommodation.name}
                      className="h-48 w-full object-cover object-center"
                    />
                    {accommodation.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        <a href={`/accommodations/${accommodation.slug || accommodation.id}`}>
                          <span className="absolute inset-0" aria-hidden="true" />
                          {accommodation.name}
                        </a>
                      </h3>
                      <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        {accommodation.rating?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{accommodation.location || 'Location not specified'}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {accommodation.description}
                    </p>
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {getAccommodationTypeInfo(accommodation.type).label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAccommodations.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">No accommodations found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccommodationsList;
