import { z } from 'zod';
import { Tour as TourType } from '@/types/tour';

export type TourDifficulty = 'EASY' | 'MEDIUM' | 'DIFFICULT';

// Base category type that can be either a string or an object with id and name
interface CategoryBase {
  id: string;
  name: string;
}

export type Category = string | CategoryBase;

export interface Tour extends Omit<TourType, 'categories' | 'id'> {
  id?: string;
  categories: Category[];
  images: string[];
  image?: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  destinations: string[];
  itinerary: Array<{ day: number; title: string; description: string }>;
  availableDates: string[];
  price: number;
  originalPrice: number;
  discount: number;
  duration: number;
  maxGroupSize: number;
  difficulty: TourDifficulty;
  rating: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  reviews: number;
}

export const tourFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  overview: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  maxGroupSize: z.number().min(1, 'Group size must be at least 1'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'DIFFICULT']) as z.ZodType<TourDifficulty>,
  price: z.number().min(0, 'Price must be a positive number'),
  originalPrice: z.number().optional(),
  images: z.array(z.string().url('Please provide valid image URLs')).min(1, 'At least one image is required'),
  highlights: z.array(z.string()).min(1, 'At least one highlight is required'),
  included: z.array(z.string()).min(1, 'At least one inclusion is required'),
  excluded: z.array(z.string()).default([]),
  startLocation: z.string().min(1, 'Start location is required'),
  destination: z.string().min(1, 'Destination is required'),
  destinations: z.array(z.string()).min(1, 'At least one destination is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  itinerary: z.array(
    z.object({
      day: z.number().min(1, 'Day must be at least 1'),
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
    })
  ).min(1, 'At least one itinerary item is required'),
  availableDates: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  ratingsAverage: z.number().min(0).max(5).optional(),
  ratingsQuantity: z.number().min(0).optional(),
  reviews: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
});

export type TourFormValues = z.infer<typeof tourFormSchema>;

// Helper function to convert Tour to TourFormValues
// Helper function to safely extract category ID
export function getCategoryId(category: Category): string {
  return typeof category === 'string' ? category : category.id;
}

export const tourToFormValues = (tour: Partial<Tour>): Partial<TourFormValues> => ({
  ...tour,
  duration: tour.duration || 1,
  maxGroupSize: tour.maxGroupSize || 1,
  price: tour.price || 0,
  originalPrice: tour.originalPrice || tour.price,
  images: Array.isArray(tour.images) ? tour.images : tour.image ? [tour.image] : [],
  highlights: tour.highlights || [],
  included: tour.included || [],
  excluded: tour.excluded || [],
  destinations: tour.destinations || [],
  categories: Array.isArray(tour.categories) 
    ? tour.categories.map(getCategoryId) 
    : [],
  itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
  availableDates: tour.availableDates || [],
  rating: tour.rating || 0,
  ratingsAverage: tour.ratingsAverage || 0,
  ratingsQuantity: tour.ratingsQuantity || 0,
  reviews: tour.reviews || 0,
});

// Helper function to convert TourFormValues to Tour
export const formValuesToTour = (values: TourFormValues): Partial<Tour> => ({
  ...values,
  image: values.images[0],
  durationInDays: values.duration,
  groupSize: `Up to ${values.maxGroupSize} people`,
  type: 'Adventure',
  reviewCount: values.reviews,
});
