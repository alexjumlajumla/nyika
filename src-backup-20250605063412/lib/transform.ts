interface ApiDestination {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  featured?: boolean;
  // Add other fields from your API response
}

export function transformDestination(dest: ApiDestination) {
  return {
    id: dest.id,
    title: dest.title,
    subtitle: dest.subtitle || '',
    image: dest.image || '/images/placeholder-destination.jpg',
    width: 'third', // Default width, can be overridden
    gradient: 'default'
  };
}

interface ApiTour {
  id: string;
  title: string;
  duration: string;
  price: string;
  image: string;
  featured?: boolean;
  // Add other fields from your API response
}

export function transformTour(tour: ApiTour) {
  return {
    id: tour.id,
    title: tour.title,
    duration: tour.duration || 'Varies',
    price: tour.price || 'Contact for pricing',
    image: tour.image || '/images/placeholder-tour.jpg'
  };
}
