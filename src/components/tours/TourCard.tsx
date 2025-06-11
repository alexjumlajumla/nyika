'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiClock, FiStar } from 'react-icons/fi';

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

export default function TourCard({
  title,
  slug,
  duration,
  price,
  ratingsAverage = 0,
  ratingsQuantity = 0,
  imageCover,
  destinations = [],
  isFeatured = false,
  discount = 0,
  originalPrice,
}: TourCardProps) {
  // Format price and original price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(originalPrice)
    : null;

  // Format duration
  const formatDuration = (days: number) => {
    return days === 1 ? '1 Day' : `${days} Days`;
  };

  // Format rating
  const formattedRating = ratingsAverage?.toFixed(1) || '0.0';
  const ratingCount = ratingsQuantity || 0;
  const hasRating = ratingsAverage > 0;
  const firstDestination = destinations[0] || 'Safari Destination';

  return (
    <Link href={`/tours/${slug}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image with overlay badges */}
        <div className="relative h-48 w-full">
          <Image
            src={imageCover || '/images/placeholder-tour.jpg'}
            alt={`${title} - ${firstDestination} tour`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
        </div>
        
        {/* Card content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ minHeight: '3.5rem' }}>
            {title}
          </h3>
          
          {/* Location/Destination */}
          {firstDestination && (
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <FiMapPin className="mr-1 flex-shrink-0" />
              <span className="truncate">{firstDestination}</span>
            </div>
          )}
          
          {/* Rating */}
          {hasRating && (
            <div className="flex items-center text-sm text-gray-700 mb-3">
              <div className="flex items-center mr-1">
                <FiStar className="text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{formattedRating}</span>
              </div>
              {ratingCount > 0 && (
                <span className="text-gray-500 text-xs">
                  ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}
          
          {/* Price and duration */}
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-600 flex items-center">
                <FiClock className="mr-1" />
                {formatDuration(duration)}
              </div>
              <div className="text-right">
                {formattedOriginalPrice ? (
                  <div className="flex items-center">
                    <span className="text-gray-400 line-through text-sm mr-2">
                      {formattedOriginalPrice}
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      {formattedPrice}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg text-gray-900">
                    {formattedPrice}
                  </span>
                )}
                <div className="text-xs text-gray-500">per person</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
