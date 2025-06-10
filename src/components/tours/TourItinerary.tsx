'use client';

import { CalendarDays, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the ItineraryDay interface
interface ItineraryDay {
  day: number;
  description: string;
  location?: {
    name?: string;
    coordinates?: [number, number];
  };
}

interface TourItineraryProps {
  locations: ItineraryDay[] | null | undefined;
  className?: string;
}

export function TourItinerary({ locations, className }: TourItineraryProps) {
  if (!locations?.length) {
    return null;
  }

  return (
    <div className={cn('mt-12', className)}>
      <h2 className="mb-6 text-2xl font-bold">Itinerary</h2>
      <div className="space-y-8">
        {locations.map((day, index) => (
          <div
            key={index}
            className="group relative border-l-2 border-primary/20 pl-8"
          >
            <div className="absolute left-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {day.day}
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm transition-all group-hover:shadow-md dark:bg-gray-800">
              <h3 className="text-lg font-semibold">
                Day {day.day}: {day.location?.name || 'Adventure Day'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {day.description}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Full day</span>
                </div>
                {day.location?.name && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{day.location.name}</span>
                  </div>
                )}
              </div>

              {day.location?.coordinates && (
                <div className="mt-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
                  {/* Map integration would go here */}
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    Map view of {day.location.name || 'the location'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
