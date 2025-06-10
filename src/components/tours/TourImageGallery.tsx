'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TourImageGalleryProps {
  images: string[];
  title: string;
}

export default function TourImageGallery({ images, title }: TourImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Thumbnails - Vertical on left */}
      <div className="hidden max-h-[600px] flex-col space-y-2 overflow-y-auto pr-2 lg:flex">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`h-24 w-full overflow-hidden rounded-lg transition-all duration-200 ${
              index === currentImageIndex 
                ? 'scale-105 ring-2 ring-primary ring-offset-2' 
                : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={image}
              alt={`${title} - ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      
      {/* Main image - Takes remaining space */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100 lg:col-span-3">
        <div className="aspect-[4/3] w-full">
          <img
            src={images[currentImageIndex]}
            alt={`${title} - Featured`}
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all hover:bg-white"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all hover:bg-white"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
