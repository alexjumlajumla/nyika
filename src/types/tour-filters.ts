export interface TourFilters {
  destinations: string[];
  durations: string[];
  priceRange: [number, number];
}

export interface TourCardProps {
  id: string | number;
  title: string;
  slug: string;
  duration: number;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  imageCover: string;
  destinations: string[];
  isFeatured?: boolean;
  discount?: number;
  originalPrice?: number;
}
