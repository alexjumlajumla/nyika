export interface TourType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGroupSize: number;
}

export interface Tour {
  id: string;
  title: string;
  destination: string;
  location: string;
  duration: string;
  groupSize: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  description: string;
  images: string[];
  image: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  tourTypes: TourType[];
  availableDates: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
}

export interface ToursListProps {
  tours: Tour[];
}
