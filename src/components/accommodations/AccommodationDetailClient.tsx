'use client';

import Image from 'next/image';
import { Star, MapPin, Wifi, Utensils, WashingMachine, Tv, Dumbbell, ParkingCircle, Snowflake, Waves } from 'lucide-react';
import { Accommodation } from '@/types/accommodation';

interface AccommodationDetailClientProps {
  accommodation: Accommodation;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-5 w-5" />,
  'Swimming Pool': <Waves className="h-5 w-5" />,
  'Restaurant': <Utensils className="h-5 w-5" />,
  'Spa': <Waves className="h-5 w-5" />,
  'Bar': <Waves className="h-5 w-5" />,
  'Laundry': <WashingMachine className="h-5 w-5" />,
  'TV': <Tv className="h-5 w-5" />,
  'Gym': <Dumbbell className="h-5 w-5" />,
  'Parking': <ParkingCircle className="h-5 w-5" />,
  'Air Conditioning': <Snowflake className="h-5 w-5" />,
};

export default function AccommodationDetailClient({ accommodation }: AccommodationDetailClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image gallery */}
      <div className="mb-8">
        <div className="relative h-96 overflow-hidden rounded-lg">
          {(accommodation.images?.[0] || accommodation.featured_image) ? (
            <Image
              src={accommodation.images?.[0] || accommodation.featured_image || ''}
              alt={accommodation.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>
        {/* Thumbnail gallery */}
        {accommodation.images && accommodation.images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {accommodation.images.slice(0, 4).map((image, index) => (
              <div key={index} className="relative h-20 overflow-hidden rounded-md">
                <Image
                  src={image}
                  alt={`${accommodation.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2">
          <h1 className="mb-2 text-3xl font-bold">{accommodation.name}</h1>
          <div className="mb-4 flex items-center text-gray-600">
            <MapPin className="mr-1 h-5 w-5" />
            <span>
              {accommodation.location.address}, {accommodation.location.city}, {accommodation.location.country}
            </span>
            {accommodation.rating !== null && accommodation.rating !== undefined && (
              <div className="ml-4 flex items-center">
                <Star className="mr-1 h-5 w-5 fill-current text-yellow-400" />
                <span className="font-medium">{accommodation.rating.toFixed(1)}</span>
                {accommodation.review_count && (
                  <span className="ml-1 text-gray-500">({accommodation.review_count} reviews)</span>
                )}
              </div>
            )}
          </div>

          <div className="prose mb-8 max-w-none">
            <h2 className="mb-4 text-2xl font-semibold">Description</h2>
            <p className="text-gray-700">{accommodation.description}</p>
          </div>

          {accommodation.amenities && accommodation.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2 text-blue-500">
                      {amenityIcons[amenity] || <Wifi className="h-5 w-5" />}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Booking card */}
        <div>
          <div className="sticky top-4 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">${accommodation.price_per_night || accommodation.price}</span>
                <span className="ml-1 text-sm text-gray-500">/ night</span>
              </div>
              {accommodation.min_nights && (
                <p className="mt-1 text-sm text-gray-500">
                  Minimum stay: {accommodation.min_nights} {accommodation.min_nights === 1 ? 'night' : 'nights'}
                </p>
              )}
              {accommodation.max_guests && (
                <p className="mt-1 text-sm text-gray-500">
                  Max {accommodation.max_guests} {accommodation.max_guests === 1 ? 'guest' : 'guests'}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Check-in</label>
                  <input
                    type="date"
                    className="w-full rounded-md border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Check-out</label>
                  <input
                    type="date"
                    className="w-full rounded-md border p-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Guests</label>
                <select className="w-full rounded-md border p-2">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>5+ guests</option>
                </select>
              </div>
              <button className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
