import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiClock, FiStar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface TourListCardProps {
  tour: {
    id: string;
    title: string;
    slug: string;
    price: number;
    duration: string;
    destinations: string[];
    rating: number;
    reviewCount: number;
    image: string;
    featured?: boolean;
  };
}

export function NewTourListCard({ tour }: TourListCardProps) {
  return (
    <div className="group relative">
      {tour.featured && (
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
            Featured
          </span>
        </div>
      )}
      
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={tour.image}
          alt={tour.title}
          width={400}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            <Link href={`/tours/${tour.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {tour.title}
            </Link>
          </h3>
          
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <FiMapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span>{tour.destinations.join(', ')}</span>
          </div>
          
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <FiClock className="mr-1 h-4 w-4 flex-shrink-0" />
            <span>{tour.duration} days</span>
          </div>
          
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <FiStar
                  key={rating}
                  className={`h-4 w-4 ${
                    rating < Math.floor(tour.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill={
                    rating < Math.floor(tour.rating) ? 'currentColor' : 'none'
                  }
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-500">
              {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end justify-between">
          <p className="text-lg font-medium text-gray-900">
            ${tour.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500"> / person</span>
          </p>
          <Button size="sm" className="mt-4">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
