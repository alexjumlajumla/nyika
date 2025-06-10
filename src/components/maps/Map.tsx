'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import { mapConfig, mapStyles } from '@/config/maps';
import { Skeleton } from '@/components/ui/skeleton';

// Default coordinates for Dar es Salaam, Tanzania
const DEFAULT_CENTER = { 
  lat: -6.7924, 
  lng: 39.2083 
};

interface Marker {
  id: string;
  position: google.maps.LatLngLiteral;
  title?: string;
  description?: string;
  icon?: string | google.maps.Icon;
  onClick?: () => void;
}

interface MapProps {
  center?: google.maps.LatLngLiteral;
  markers?: Marker[];
  zoom?: number;
  className?: string;
  mapContainerClassName?: string;
  options?: google.maps.MapOptions;
  onLoad?: (map: google.maps.Map) => void;
  onUnmount?: (map: google.maps.Map) => void;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  children?: React.ReactNode;
  showDefaultMarker?: boolean;
  defaultMarkerTitle?: string;
  defaultMarkerDescription?: string;
}
const Map: React.FC<MapProps> = ({
  center = DEFAULT_CENTER,
  markers = [],
  zoom = 12,
  className = 'h-[500px] w-full rounded-lg',
  mapContainerClassName = '',
  options = {},
  onLoad,
  onUnmount,
  onClick,
  children,
  showDefaultMarker = true,
  defaultMarkerTitle = 'Our Location',
  defaultMarkerDescription = 'We are here!',
}) => {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapConfig.apiKey,
    libraries: mapConfig.libraries as any,
  });

  const mergedOptions = useMemo<google.maps.MapOptions>(
    () => ({
      ...mapConfig.options,
      styles: mapStyles,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
      ...options,
    }),
    [options]
  );

  const mapCenter = useMemo(() => center, [center]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (onLoad) onLoad(map);
  }, [onLoad]);

  const handleMarkerClick = useCallback((marker: Marker) => {
    setSelectedMarker(marker);
    if (marker.onClick) marker.onClick();
  }, []);

  // Add default marker if enabled and no markers are provided
  const allMarkers = useMemo(() => {
    if (markers.length > 0) return markers;
    if (showDefaultMarker) {
      return [
        {
          id: 'default-marker',
          position: center || DEFAULT_CENTER,
          title: defaultMarkerTitle,
          description: defaultMarkerDescription,
        },
      ];
    }
    return [];
  }, [markers, showDefaultMarker, center, defaultMarkerTitle, defaultMarkerDescription]);

  if (loadError) {
    return (
      <div className={`${className} flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800`}>
        <p className="p-4 text-center">
          Unable to load the map. Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className={className} />;
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerClassName={`${mapContainerClassName} rounded-lg overflow-hidden`}
        center={mapCenter}
        zoom={zoom}
        options={mergedOptions}
        onLoad={handleMapLoad}
        onUnmount={onUnmount}
        onClick={onClick}
      >
        {allMarkers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={marker.position}
            title={marker.title}
            icon={marker.icon || {
              url: '/images/map-marker.png',
              scaledSize: new window.google.maps.Size(40, 40),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(20, 40),
            }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="max-w-xs p-2">
              <h4 className="font-semibold text-gray-900">{selectedMarker.title}</h4>
              {selectedMarker.description && (
                <p className="mt-1 text-sm text-gray-600">{selectedMarker.description}</p>
              )}
            </div>
          </InfoWindow>
        )}

        {children}
      </GoogleMap>
    </div>
  );
};

export default React.memo(Map);
