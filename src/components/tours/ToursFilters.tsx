'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export interface TourFilters {
  search: string;
  destinations: string[];
  durations: string[];
  priceRange: [number, number];
  ratings: string[];
}

interface FilterGroup {
  id: keyof TourFilters;
  name: string;
  options: {
    value: string;
    label: string;
    count: number;
  }[];
  isOpen: boolean;
}

interface ToursFiltersProps {
  initialFilters: TourFilters;
  onFilterChange: (filters: TourFilters) => void;
  availableFilters: {
    destinations: { value: string; label: string; count: number }[];
    durations: { value: string; label: string; count: number }[];
    ratings: { value: string; label: string; count: number }[];
  };
}

export function ToursFilters({ 
  initialFilters, 
  onFilterChange,
  availableFilters 
}: ToursFiltersProps) {
  const t = useTranslations('tours.filters');
  const [filters, setFilters] = useState<TourFilters>(initialFilters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: 'destinations',
      name: 'Destinations',
      options: availableFilters.destinations,
      isOpen: true,
    },
    {
      id: 'durations',
      name: 'Durations',
      options: availableFilters.durations,
      isOpen: true,
    },
    {
      id: 'ratings',
      name: 'Ratings',
      options: availableFilters.ratings,
      isOpen: true,
    },
  ]);

  const toggleFilterGroup = useCallback((id: string) => {
    setFilterGroups(prev =>
      prev.map(group =>
        group.id === id ? { ...group, isOpen: !group.isOpen } : group
      )
    );
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleFilterToggle = useCallback((filterId: keyof TourFilters, value: string) => {
    const currentValues = [...(filters[filterId] as string[])];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newFilters = { ...filters, [filterId]: newValues };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handlePriceRangeChange = useCallback((value: number[]) => {
    const newFilters = { 
      ...filters, 
      priceRange: [value[0], value[1]] as [number, number] 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    const newFilters = {
      search: '',
      destinations: [],
      durations: [],
      priceRange: [0, 10000] as [number, number],
      ratings: []
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [onFilterChange]);

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.destinations.length,
    filters.durations.length,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0,
    filters.ratings.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">{t('search')}</Label>
        <Input
          id="search"
          placeholder={t('searchPlaceholder')}
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.search}
              <button
                type="button"
                onClick={() => handleFilterToggle('search', '')}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.destinations.map(dest => (
            <Badge key={dest} variant="secondary" className="flex items-center gap-1">
              {dest}
              <button
                type="button"
                onClick={() => handleFilterToggle('destinations', dest)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.durations.map(duration => (
            <Badge key={duration} variant="secondary" className="flex items-center gap-1">
              {duration} days
              <button
                type="button"
                onClick={() => handleFilterToggle('durations', duration)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
              <button
                type="button"
                onClick={() => handlePriceRangeChange([0, 10000])}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.ratings.map(rating => (
            <Badge key={rating} variant="secondary" className="flex items-center gap-1">
              {rating} Stars
              <button
                type="button"
                onClick={() => handleFilterToggle('ratings', rating)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="ml-2 text-sm text-primary hover:bg-transparent hover:underline"
          >
            {t('clearAll')}
          </Button>
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id} className="space-y-3">
            <button
              type="button"
              onClick={() => toggleFilterGroup(group.id)}
              className="flex w-full items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              <span>{group.name}</span>
              {group.isOpen ? (
                <FiChevronUp className="h-4 w-4" />
              ) : (
                <FiChevronDown className="h-4 w-4" />
              )}
            </button>

            {group.isOpen && (
              <div className="space-y-2 pl-2">
                {group.options.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <Checkbox
                      id={`${group.id}-${option.value}`}
                      checked={filters[group.id].includes(option.value)}
                      onCheckedChange={() => handleFilterToggle(group.id, option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <Label
                      htmlFor={`${group.id}-${option.value}`}
                      className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-300"
                    >
                      {option.label} ({option.count})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="price-range">Price Range</Label>
            <span className="text-sm text-gray-500">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <Slider
            id="price-range"
            min={0}
            max={10000}
            step={100}
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            className="py-4"
          />
        </div>
      </div>

      {/* Mobile Filter Actions */}
      <div className="lg:hidden">
        <Button
          onClick={() => setIsMobileFiltersOpen(false)}
          className="w-full"
        >
          Show {activeFilterCount > 0 ? `(${activeFilterCount}) ` : ''}Results
        </Button>
      </div>
    </div>
  );
}
