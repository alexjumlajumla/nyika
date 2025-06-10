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

  // Calculate rating percentage for potential future use
  // const ratingPercentage = (ratingsAverage / 5) * 100;
  const formatDuration = (days: number) => {
    return days === 1 ? '1 Day' : `${days} Days`;
  };

  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(ratingsAverage);
    const hasHalfStar = ratingsAverage % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    
    return stars;
  };

  const formattedRating = ratingsAverage?.toFixed(1) || '0.0';
  const ratingCount = ratingsQuantity || 0;

  return (
    <Link href={`/tours/${slug}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={imageCover}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
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
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="mr-1" />
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="flex">
              {renderRatingStars()}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {formattedRating} ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <FiMapPin className="mr-1" />
            <span>{destinations.join(', ')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              {discount > 0 && originalPrice ? (
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-red-600">
                    {formattedPrice}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formattedOriginalPrice}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formattedPrice}
                </span>
              )}
              <span className="block text-xs text-gray-500">per person</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle book now
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
