// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const mapConfig = {
  apiKey: GOOGLE_MAPS_API_KEY,
  defaultCenter: { lat: -6.3690, lng: 34.8888 }, // Center of Tanzania
  defaultZoom: 6,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  libraries: ['places', 'geometry', 'drawing', 'visualization'],
  options: {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    zoomControl: true,
  },
};

export const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

// Using a simpler approach for the marker icon to avoid type issues
export const defaultMarkerIcon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
