'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AccommodationWithRelations } from '@/lib/supabase/accommodations';

interface AccommodationCardProps {
  accommodation: AccommodationWithRelations;
  className?: string;
}

const AccommodationCard = ({ accommodation, className }: AccommodationCardProps) => {
  return (
    <div className={cn('group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md', className)}>
      {/* Wishlist Button */}
      <button 
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-gray-400 transition-colors hover:bg-white hover:text-rose-500"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // TODO: Implement wishlist functionality
        }}
      >
        <Heart className="h-5 w-5" />
      </button>
      
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Link href={`/accommodations/${accommodation.slug}`}>
          <Image
            src={accommodation.featured_image || accommodation.images?.[0] || '/images/placeholder-accommodation.jpg'}
            alt={accommodation.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Featured Badge */}
        {accommodation.is_featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-white">
            Featured
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            <Link href={`/accommodations/${accommodation.slug}`} className="hover:text-primary">
              {accommodation.name}
            </Link>
          </h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {accommodation.rating?.toFixed(1) || 'New'}
            </span>
          </div>
        </div>
        
        <div className="mb-3 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="ml-1 line-clamp-1">{accommodation.location}</span>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-1">
          {(() => {
            const tags = accommodation.tags;
            if (!tags) return null;

            try {
              // Convert tags to an array of strings
              let tagStrings: string[] = [];

              // Handle different tag formats
              if (Array.isArray(tags)) {
                // Handle array of tags
                tagStrings = tags
                  .map(tag => {
                    if (tag == null) return '';
                    if (typeof tag === 'string') return tag;
                    if (typeof tag === 'number' || typeof tag === 'boolean') return String(tag);
                    try {
                      return JSON.stringify(tag);
                    } catch {
                      return '';
                    }
                  })
                  .filter((tag): tag is string => Boolean(tag && tag.trim()));
              } else if (tags && typeof tags === 'object') {
                // Handle object by getting its values
                const values = Object.values(tags);
                tagStrings = values
                  .map(value => {
                    if (value == null) return '';
                    if (typeof value === 'string') return value;
                    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
                    try {
                      return JSON.stringify(value);
                    } catch {
                      return '';
                    }
                  })
                  .filter((tag): tag is string => Boolean(tag && tag.trim()));
              } else if (typeof tags === 'string') {
                // Handle string by splitting
                tagStrings = (tags as string).split(/[,\s]+/).filter(Boolean);
              }

              // Return up to 3 unique, non-empty tags
              return Array.from(new Set(tagStrings))
                .slice(0, 3)
                .map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ));
            } catch {
              // Silently fail if there's an error processing tags
              return null;
            }
          })()}
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <div className="text-xl font-bold text-primary">
              ${accommodation.price_per_night?.toLocaleString()}
              <span className="text-sm font-normal text-gray-500"> / night</span>
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={`/accommodations/${accommodation.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
