'use client';

import { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TourFilters } from '@/types/tour-filters';

interface NewTourFiltersProps {
  filters: TourFilters;
  onFilterChange: (filters: TourFilters) => void;
  onClearFilters: () => void;
}

// Define destination options
const DESTINATIONS = [
  { id: 'serengeti', label: 'Serengeti' },
  { id: 'kilimanjaro', label: 'Mount Kilimanjaro' },
  { id: 'zanzibar', label: 'Zanzibar' },
  { id: 'ngorongoro', label: 'Ngorongoro Crater' },
  { id: 'manyara', label: 'Lake Manyara' },
  { id: 'tarangire', label: 'Tarangire' },
];

export function NewTourFilters({ 
  filters, 
  onFilterChange,
  onClearFilters 
}: NewTourFiltersProps) {
  // Handle destination filter changes
  const handleDestinationChange = useCallback((destinationId: string, isChecked: boolean) => {
    const newDestinations = isChecked
      ? [...filters.destinations, destinationId]
      : filters.destinations.filter((id: string) => id !== destinationId);

    onFilterChange({
      ...filters,
      destinations: newDestinations,
    });
  }, [filters, onFilterChange]);

  // Handle price range changes
  const handlePriceChange = useCallback((value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  }, [filters, onFilterChange]);

  // Check if any filters are active
  const hasActiveFilters = 
    filters.destinations.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 10000;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Destinations Filter */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Destinations</h4>
        <div className="space-y-2">
          {DESTINATIONS.map((destination) => (
            <div key={destination.id} className="flex items-center space-x-2">
              <Checkbox
                id={destination.id}
                checked={filters.destinations.includes(destination.id)}
                onCheckedChange={(checked) => 
                  handleDestinationChange(destination.id, checked === true)
                }
              />
              <Label htmlFor={destination.id} className="text-sm font-normal">
                {destination.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}