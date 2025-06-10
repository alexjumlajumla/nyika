'use client';

import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * TourGallery component for displaying a grid of tour images with lightbox functionality
 */
interface TourGalleryProps {
  images: string[];
  className?: string;
}

export function TourGallery({ images, className }: TourGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  if (!images?.length) return null;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;

    if (direction === 'prev') {
      setSelectedImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev! - 1
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev! + 1
      );
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedImageIndex === null) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
      default:
        break;
    }
  };

  return (
    <div className={className}>
      <h2 className="mb-6 text-2xl font-bold">Photo Gallery</h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image}
              alt={`Tour image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-20" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-label="Image gallery"
          tabIndex={0}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 rounded-full p-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <div className="relative mx-16 h-full max-h-[80vh] w-full max-w-4xl">
            <Image
              src={images[selectedImageIndex]}
              alt={`Tour image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-center text-white">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 rounded-full p-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
}
