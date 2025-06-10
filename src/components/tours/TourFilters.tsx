'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import useTourStore from '@/store/useTourStore';

const destinations = [
  'Serengeti, Tanzania',
  'Masai Mara, Kenya',
  'Ngorongoro, Tanzania',
  'Zanzibar, Tanzania',
  'Amboseli, Kenya',
  'Tsavo, Kenya',
  'Samburu, Kenya',
  'Lake Nakuru, Kenya',
];

const durations = [
  '1 Day',
  '2-3 Days',
  '4-5 Days',
  '6-7 Days',
  '8+ Days',
];

interface TourFiltersProps {
  priceRange: [number, number];
}

const TourFilters = ({ priceRange }: TourFiltersProps) => {
  const [search, setSearch] = useState('');
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [selectedDurs, setSelectedDurs] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>(priceRange);
  
  const {
    setSearchQuery,
    setSelectedDestinations,
    setSelectedDurations,
    setPriceRange,
    selectedDestinations,
    selectedDurations,
    handleFilterChange
  } = useTourStore();
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Sync local state with store
  useEffect(() => {
    setSelectedDests(selectedDestinations);
    setSelectedDurs(selectedDurations);
  }, [selectedDestinations, selectedDurations]);
  
  // Handle filter changes
  useEffect(() => {
    handleFilterChange({
      search,
      selectedDestinations: selectedDests,
      selectedDurations: selectedDurs,
      priceRange: price
    });
  }, [search, selectedDests, selectedDurs, price, handleFilterChange]);

  const handleDestinationChange = (destination: string) => {
    const newDestinations = selectedDests.includes(destination)
      ? selectedDests.filter((d) => d !== destination)
      : [...selectedDests, destination];
    setSelectedDests(newDestinations);
    setSelectedDestinations(newDestinations);
  };

  const handleDurationChange = (duration: string) => {
    const newDurations = selectedDurs.includes(duration)
      ? selectedDurs.filter((d) => d !== duration)
      : [...selectedDurs, duration];
    setSelectedDurs(newDurations);
    setSelectedDurations(newDurations);
  };

  const handlePriceChange = (value: number[]) => {
    const newPrice = [value[0], value[1]] as [number, number];
    setPrice(newPrice);
    setPriceRange(newPrice);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  return (
    <div className="w-full">
      {/* Mobile filter dialog */}
      <div className="mb-6 lg:hidden">
        <Button
          type="button"
          className="flex items-center gap-2"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <Filter className="h-4 w-4" />
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className={cn(!isMobileFiltersOpen && 'hidden', 'lg:block')}>
        <div className="space-y-6 rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tours..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 font-medium">Destinations</h3>
              <div className="space-y-2">
                {destinations.map((destination) => (
                  <div key={destination} className="flex items-center">
                    <Checkbox
                      id={`dest-${destination}`}
                      checked={selectedDestinations.includes(destination)}
                      onCheckedChange={() => handleDestinationChange(destination)}
                      className="h-4 w-4 rounded"
                    />
                    <label
                      htmlFor={`dest-${destination}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {destination}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Duration</h3>
              <div className="space-y-2">
                {durations.map((duration) => (
                  <div key={duration} className="flex items-center">
                    <Checkbox
                      id={`duration-${duration}`}
                      checked={selectedDurations.includes(duration)}
                      onCheckedChange={() => handleDurationChange(duration)}
                      className="h-4 w-4 rounded"
                    />
                    <label
                      htmlFor={`duration-${duration}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {duration}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="px-2">
                <Slider
                  value={price}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={10000}
                  step={100}
                  minStepsBetweenThumbs={1}
                  className="w-full"
                />
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>${price[0].toLocaleString()}</span>
                  <span>${price[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourFilters;
