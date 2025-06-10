import { cache } from 'react';

export type Tour = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  rating: number;
  reviews: number;
  featured: boolean;
};

// Mock data - in a real app, this would be an API call
const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Great Migration Safari',
    description: 'Witness the spectacular wildebeest migration in the Serengeti.',
    price: 2500,
    duration: '7 days',
    image: '/images/tours/migration.jpg',
    rating: 4.9,
    reviews: 128,
    featured: true,
  },
  {
    id: '2',
    title: 'Mount Kilimanjaro Trek',
    description: 'Summit Africa\'s highest peak on this challenging trek.',
    price: 3500,
    duration: '8 days',
    image: '/images/tours/kilimanjaro.jpg',
    rating: 4.8,
    reviews: 95,
    featured: true,
  },
  // Add more tours as needed
];

// Cache the result to avoid refetching on every render
export const getTours = cache(async (): Promise<Tour[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTours;
});

export const getFeaturedTours = cache(async (): Promise<Tour[]> => {
  const tours = await getTours();
  return tours.filter(tour => tour.featured);
});

export const getTourById = cache(async (id: string): Promise<Tour | undefined> => {
  const tours = await getTours();
  return tours.find(tour => tour.id === id);
});
