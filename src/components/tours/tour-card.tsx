import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface TourCardProps {
  id: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  destinations: string[];
  highlights: string[];
  className?: string;
}

export function TourCard({
  id,
  title,
  slug,
  image,
  duration,
  price,
  rating,
  reviewCount,
  destinations,
  highlights,
  className,
}: TourCardProps) {
  return (
    <div className={cn("group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md", className)}>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-900 backdrop-blur-sm">
          {duration}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            <Link href={`/tours/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {rating.toFixed(1)}
            </span>
            <span className="mx-1 text-gray-400">·</span>
            <span className="text-sm text-gray-500">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {destinations.join(' • ')}
        </p>

        {highlights.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {highlights.slice(0, 3).map((highlight, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <p className="text-xl font-bold text-primary">${price.toLocaleString()}</p>
            <span className="text-xs text-gray-500">per person</span>
          </div>
          <Button asChild>
            <Link href={`/tours/${slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
