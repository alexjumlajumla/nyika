'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { mapConfig } from '@/config/maps';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface LocationAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  onError?: (error: string) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onPlaceSelected,
  placeholder = 'Search location...',
  className = '',
  inputClassName = '',
  value: propValue,
  onChange: propOnChange,
  onError,
}) => {
  const [value, setValue] = useState(propValue || '');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapConfig.apiKey,
    libraries: ['places'],
  });

  // Sync prop value with local state
  useEffect(() => {
    if (propValue !== undefined && propValue !== value) {
      setValue(propValue);
    }
  }, [propValue]);

  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      const options = {
        componentRestrictions: { country: 'tz' }, // Tanzania country code
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
        types: ['establishment', 'geocode'],
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
          onPlaceSelected(place);
        }
      });

      return () => {
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      onError?.('Failed to load location search. Please try again later.');
    }
  }, [isLoaded, onPlaceSelected, onError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    propOnChange?.(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 ${inputClassName}`}
      />
    </div>
  );
};

export default LocationAutocomplete;
