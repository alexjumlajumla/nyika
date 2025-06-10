import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiMapPin, FiStar, FiUsers } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tour } from '@/types/tour';

interface TourListCardProps {
  tour: Tour;
  className?: string;
}

/**
 * Server component that renders a single tour card
 */
export function TourListCard({ tour, className }: TourListCardProps) {
  const {
    title,
    slug,
    price,
    duration = 0,
    maxGroupSize = 12,
    rating = 0,
    reviewCount = 0,
    images = [],
    categories = [],
    discount = 0,
    originalPrice = 0,
    startLocation = 'Nairobi, Kenya',
  } = tour;

  const mainImage = images[0] || '/images/tour-placeholder.jpg';
  const hasDiscount = discount > 0 && originalPrice && originalPrice > price;

  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg',
        'dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute right-4 top-4 z-10">
          <Badge className="bg-red-500 px-3 py-1 font-semibold text-white">
            {discount}% OFF
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center">
            <FiStar className="mr-1 h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiMapPin className="mr-2 h-4 w-4" />
            <span>{startLocation}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiClock className="mr-2 h-4 w-4" />
            <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiUsers className="mr-2 h-4 w-4" />
            <span>Max {maxGroupSize} people</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${price.toLocaleString()}
              {duration > 0 && (
                <span className="ml-1 text-sm font-normal text-gray-500">
                  /{duration} {duration === 1 ? 'day' : 'days'}
                </span>
              )}
            </p>
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                ${originalPrice?.toLocaleString()}
              </p>
            )}
          </div>
          <Button asChild>
            <Link href={`/tours/${slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
