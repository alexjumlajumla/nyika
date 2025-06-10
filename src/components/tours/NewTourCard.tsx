import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiClock, FiStar, FiCalendar, FiUsers } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface TourCardProps {
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
  className?: string;
}

export function TourCard({
  title,
  slug,
  price,
  duration,
  destinations,
  rating,
  reviewCount,
  image,
  featured = false,
  className,
}: TourCardProps) {
  return (
    <div className={cn('group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg', className)}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        </div>
      )}
      
      {/* Image */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={image || '/images/placeholder-tour.jpg'}
          alt={title}
          width={400}
          height={250}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          priority={featured}
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <FiMapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span className="line-clamp-1 font-medium text-gray-600">{destinations.join(', ')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="flex items-center">
              <FiClock className="mr-1 h-4 w-4 text-primary" />
              {duration} days
            </span>
          </div>
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2">
          <Link href={`/tours/${slug}`} className="after:absolute after:inset-0 hover:text-primary">
            {title}
          </Link>
        </h3>
        
        {/* Highlights */}
        <div className="mb-4 mt-2 flex-1">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start">
              <FiCalendar className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>Flexible dates available</span>
            </div>
            <div className="flex items-start">
              <FiUsers className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>Small group experience</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">From</p>
              <p className="text-xl font-bold text-primary">
                ${price.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-gray-500">/person</span>
              </p>
            </div>
            
            <div className="flex items-center rounded-full bg-yellow-50 px-3 py-1">
              <FiStar className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <span className="ml-1 text-sm font-medium text-gray-900">
                {rating.toFixed(1)}
              </span>
              <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
            </div>
          </div>
          
          <Button className="w-full" size="lg" asChild>
            <Link href={`/tours/${slug}`}>
              View Tour Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
