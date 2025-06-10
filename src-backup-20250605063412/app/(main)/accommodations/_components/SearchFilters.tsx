'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, Calendar, Star, X } from 'lucide-react';

type FilterOption = {
  id: string;
  name: string;
  count?: number;
};

type FilterSection = {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'date' | 'range';
  options: FilterOption[];
  isOpen: boolean;
};

export function SearchFilters() {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'destination',
      title: 'Destination',
      type: 'checkbox',
      isOpen: true,
      options: [
        { id: 'kenya', name: 'Kenya', count: 24 },
        { id: 'tanzania', name: 'Tanzania', count: 18 },
        { id: 'south-africa', name: 'South Africa', count: 15 },
        { id: 'botswana', name: 'Botswana', count: 12 },
        { id: 'namibia', name: 'Namibia', count: 8 },
      ],
    },
    {
      id: 'when-to-visit',
      title: 'When to Visit',
      type: 'checkbox',
      isOpen: true,
      options: [
        { id: 'jan-mar', name: 'Jan - Mar' },
        { id: 'apr-jun', name: 'Apr - Jun' },
        { id: 'jul-sep', name: 'Jul - Sep' },
        { id: 'oct-dec', name: 'Oct - Dec' },
      ],
    },
    {
      id: 'location',
      title: 'Hotel Location',
      type: 'checkbox',
      isOpen: true,
      options: [
        { id: 'masai-mara', name: 'Masai Mara', count: 12 },
        { id: 'serengeti', name: 'Serengeti', count: 10 },
        { id: 'victoria-falls', name: 'Victoria Falls', count: 8 },
        { id: 'okavango', name: 'Okavango Delta', count: 6 },
      ],
    },
    {
      id: 'price-range',
      title: 'Price Range',
      type: 'range',
      isOpen: true,
      options: [],
    },
    {
      id: 'rating',
      title: 'Star Rating',
      type: 'checkbox',
      isOpen: true,
      options: [
        { id: '5', name: '5 Star' },
        { id: '4', name: '4 Star' },
        { id: '3', name: '3 Star' },
      ],
    },
  ]);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleFilter = (filterId: string) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, isOpen: !f.isOpen } : f
    ));
  };

  const handleFilterChange = (sectionId: string, optionId: string, isChecked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[sectionId]) {
        newFilters[sectionId] = [];
      }
      
      if (isChecked) {
        newFilters[sectionId] = [...newFilters[sectionId], optionId];
      } else {
        newFilters[sectionId] = newFilters[sectionId].filter(id => id !== optionId);
      }
      
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const hasActiveFilters = Object.values(selectedFilters).some(filters => filters.length > 0);

  return (
    <div className="sticky top-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filter By</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-safari-brown flex items-center text-sm hover:underline"
          >
            <X className="mr-1 h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filters.map((section) => (
          <div key={section.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <button
              onClick={() => toggleFilter(section.id)}
              className="flex w-full items-center justify-between py-2 text-left focus:outline-none"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              <ChevronDown 
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  !section.isOpen ? 'rotate-0' : 'rotate-180'
                }`} 
              />
            </button>
            
            {section.isOpen && (
              <div className="mt-3 space-y-3">
                {section.type === 'range' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input 
                          type="number" 
                          placeholder="Min" 
                          className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm"
                        />
                      </div>
                      <span className="mx-2 text-gray-400">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm"
                        />
                      </div>
                    </div>
                    <button className="bg-safari-brown hover:bg-safari-brown/90 w-full rounded-md py-2 text-sm font-medium text-white transition-colors">
                      Apply Price Range
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.options.map((option) => {
                      const isChecked = selectedFilters[section.id]?.includes(option.id) || false;
                      return (
                        <label key={option.id} className="group flex cursor-pointer items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleFilterChange(section.id, option.id, e.target.checked)}
                              className="text-safari-brown focus:ring-safari-brown/70 h-4 w-4 rounded border-gray-300"
                            />
                            <span className="group-hover:text-safari-brown ml-3 text-sm text-gray-700 transition-colors">
                              {option.name}
                            </span>
                          </div>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500">{option.count}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
