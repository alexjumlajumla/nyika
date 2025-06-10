'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiStar } from 'react-icons/fi';
import { Tour } from '@/services/tourService';

interface TourCardSimpleProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardSimpleProps) {
  const { id, title, description, price, duration, image, rating, reviews } = tour;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <div className="flex items-center rounded-md bg-primary/10 px-2 py-1 text-primary">
            <span className="text-sm font-medium">
              ${price.toLocaleString()}
            </span>
          </div>
        </div>
        
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{duration}</span>
          </div>
          
          <div className="flex items-center">
            <FiStar className="mr-1 text-yellow-400" />
            <span className="font-medium text-gray-900">{rating}</span>
            <span className="mx-1">•</span>
            <span>({reviews} reviews)</span>
          </div>
        </div>
        
        <Link 
          href={`/en/tours/${id}`}
          className="mt-4 inline-block w-full rounded-md bg-primary py-2 text-center text-white transition-colors hover:bg-primary/90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
