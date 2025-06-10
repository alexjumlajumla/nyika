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
  subtitle?: string;
  slug: string;
  destination: string;
  destinations: string[];
  location?: string;
  duration: number;
  durationInDays?: number;
  groupSize?: string;
  maxGroupSize: number;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  reviews?: number;
  reviewCount?: number;
  type?: string;
  description: string;
  overview?: string;
  images: string[];
  image?: string;
  imageCover?: string;
  highlights: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  discount?: number;
  difficulty: string;
  startLocation: string;
  priceDiscount?: number;
  summary?: string;
  startDates?: string[];
  locations?: any[];
  guides?: any[];
  included: string[];
  excluded: string[];
  tourTypes?: TourType[];
  availableDates?: string[];
  categories: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    accommodation?: string;
    meals?: string[];
  }[];
}

export interface ToursListProps {
  tours: Tour[];
}
