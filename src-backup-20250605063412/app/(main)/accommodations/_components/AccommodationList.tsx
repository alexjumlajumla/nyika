import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Users, Wifi, Coffee, Utensils, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Accommodation = {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  description: string;
  type: 'Lodge' | 'Camp' | 'Hotel' | 'Resort';
  isFeatured?: boolean;
};

type AccommodationListProps = {
  accommodations: Accommodation[];
};

export function AccommodationList({ accommodations }: AccommodationListProps) {
  if (accommodations.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">No accommodations found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {accommodations.map((accommodation) => (
        <div 
          key={accommodation.id}
          className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <div className="md:flex">
            {/* Image */}
            <div className="relative h-64 md:h-auto md:w-1/3">
              <Image
                src={accommodation.image}
                alt={accommodation.name}
                fill
                className="object-cover"
              />
              {accommodation.isFeatured && (
                <div className="bg-safari-brown absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white">
                  Featured
                </div>
              )}
              <div className="absolute bottom-4 right-4 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
                {accommodation.type}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:w-2/3">
              <div className="flex h-full flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="hover:text-safari-brown mb-1 text-xl font-bold text-gray-900 transition-colors">
                        <Link href={`/accommodations/${accommodation.slug}`}>
                          {accommodation.name}
                        </Link>
                      </h3>
                      <div className="mb-3 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>{accommodation.location}</span>
                      </div>
                    </div>
                    <div className="bg-safari-brown/10 text-safari-brown flex items-center rounded px-2 py-1">
                      <Star className="mr-1 h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">
                        {accommodation.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="mb-4 line-clamp-3 text-gray-600">
                    {accommodation.description}
                  </p>
                  
                  <div className="mb-4 flex flex-wrap gap-2">
                    {accommodation.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center rounded bg-gray-50 px-2 py-1 text-sm text-gray-500">
                        {amenity === 'Free WiFi' && <Wifi className="mr-1 h-3.5 w-3.5" />}
                        {amenity === 'Breakfast' && <Coffee className="mr-1 h-3.5 w-3.5" />}
                        {amenity === 'Restaurant' && <Utensils className="mr-1 h-3.5 w-3.5" />}
                        {amenity === 'Pool' && <Droplets className="mr-1 h-3.5 w-3.5" />}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${accommodation.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500"> / night</span>
                    </p>
                    <p className="text-xs text-gray-500">Exclusive of taxes & fees</p>
                  </div>
                  <Link href={`/accommodations/${accommodation.slug}`}>
                    <Button className="bg-safari-brown hover:bg-safari-brown/90">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
