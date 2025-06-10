'use client';

import { useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp, FiX, FiCheck } from 'react-icons/fi';
import styles from './ToursFilter.module.css';

const filters = {
  destinations: [
    { id: 'serengeti', name: 'Serengeti' },
    { id: 'ngorongoro', name: 'Ngorongoro' },
    { id: 'kilimanjaro', name: 'Kilimanjaro' },
    { id: 'zanzibar', name: 'Zanzibar' },
    { id: 'manyara', name: 'Lake Manyara' },
  ],
  durations: [
    '1-3 Days',
    '4-6 Days',
    '7-9 Days',
    '10+ Days',
  ],
  styles: [
    'Luxury',
    'Mid-range',
    'Budget',
    'Family',
    'Honeymoon',
    'Group',
    'Private',
  ],
  amenities: [
    'Pool',
    'Spa',
    'WiFi',
    'Restaurant',
    'Bar',
    'Air Conditioning',
  ],
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
};

type FilterType = 'destination' | 'duration' | 'style' | 'amenities' | 'month' | null;

export default function ToursFilter() {
  const [openFilter, setOpenFilter] = useState<FilterType>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    destinations: [],
    durations: [],
    styles: [],
    amenities: [],
    months: [],
  });

  const toggleFilter = (filterType: FilterType) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleFilterChange = (filterType: string, value: string, isChecked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (isChecked) {
        newFilters[filterType as keyof typeof filters] = [
          ...(newFilters[filterType as keyof typeof filters] || []),
          value
        ];
      } else {
        newFilters[filterType as keyof typeof filters] = (
          newFilters[filterType as keyof typeof filters] || []
        ).filter(item => item !== value);
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      destinations: [],
      durations: [],
      styles: [],
      amenities: [],
      months: [],
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(filters => filters.length > 0);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <FiFilter className={styles.filterIcon} />
        <h3 className={styles.filterTitle}>Filter Tours</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className={styles.clearAllButton}
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Destination Filter */}
      <div className={styles.filterSection}>
        <button 
          className={styles.filterButton}
          onClick={() => toggleFilter('destination')}
          aria-expanded={openFilter === 'destination'}
        >
          <span>Destination</span>
          {openFilter === 'destination' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <div 
          className={`${styles.filterOptions} ${openFilter === 'destination' ? styles.filterOptionsOpen : ''}`}
        >
          {filters.destinations.map((dest) => {
            const isChecked = selectedFilters.destinations.includes(dest.id);
            return (
              <label key={dest.id} className={styles.filterOption}>
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleFilterChange('destinations', dest.id, e.target.checked)}
                  className={styles.filterCheckbox}
                />
                <span className={`${styles.checkmark} ${isChecked ? styles.checked : ''}`}>
                  {isChecked && <FiCheck className={styles.checkIcon} />}
                </span>
                <span>{dest.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Duration Filter */}
      <div className={styles.filterSection}>
        <button 
          className={styles.filterButton}
          onClick={() => toggleFilter('duration')}
          aria-expanded={openFilter === 'duration'}
        >
          <span>Tour Duration</span>
          {openFilter === 'duration' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <div 
          className={`${styles.filterOptions} ${openFilter === 'duration' ? styles.filterOptionsOpen : ''}`}
        >
          {filters.durations.map((duration, index) => {
            const isChecked = selectedFilters.durations.includes(duration);
            return (
              <label key={index} className={styles.filterOption}>
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleFilterChange('durations', duration, e.target.checked)}
                  className={styles.filterCheckbox}
                />
                <span className={`${styles.checkmark} ${isChecked ? styles.checked : ''}`}>
                  {isChecked && <FiCheck className={styles.checkIcon} />}
                </span>
                <span>{duration}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Tour Style Filter */}
      <div className={styles.filterSection}>
        <button 
          className={styles.filterButton}
          onClick={() => toggleFilter('style')}
          aria-expanded={openFilter === 'style'}
        >
          <span>Tour Style</span>
          {openFilter === 'style' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <div 
          className={`${styles.filterOptions} ${openFilter === 'style' ? styles.filterOptionsOpen : ''}`}
        >
          {filters.styles.map((style, index) => {
            const isChecked = selectedFilters.styles.includes(style);
            return (
              <label key={index} className={styles.filterOption}>
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleFilterChange('styles', style, e.target.checked)}
                  className={styles.filterCheckbox}
                />
                <span className={`${styles.checkmark} ${isChecked ? styles.checked : ''}`}>
                  {isChecked && <FiCheck className={styles.checkIcon} />}
                </span>
                <span>{style}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* When to Travel Filter */}
      <div className={styles.filterSection}>
        <button 
          className={styles.filterButton}
          onClick={() => toggleFilter('month')}
          aria-expanded={openFilter === 'month'}
        >
          <span>When to Travel</span>
          {openFilter === 'month' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        <div 
          className={`${styles.filterOptions} ${openFilter === 'month' ? styles.filterOptionsOpen : ''}`}
        >
          <div className={styles.monthsGrid}>
            {filters.months.map((month, index) => {
              const isChecked = selectedFilters.months.includes(month);
              return (
                <label key={index} className={styles.monthOption}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={(e) => handleFilterChange('months', month, e.target.checked)}
                    className={styles.filterCheckbox}
                  />
                  <span className={`${styles.monthCheckmark} ${isChecked ? styles.checked : ''}`}>
                    {isChecked && <FiCheck className={styles.checkIcon} />}
                  </span>
                  <span className={styles.monthName}>{month.substring(0, 3)}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button 
        className={`${styles.applyButton} ${!hasActiveFilters ? styles.disabled : ''}`}
        disabled={!hasActiveFilters}
      >
        Apply Filters
      </button>
    </div>
  );
}
