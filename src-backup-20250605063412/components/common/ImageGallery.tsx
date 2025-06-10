import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ImageGallery({ images, alt, className = '' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={images[selectedImage]}
          alt={`${alt} ${selectedImage + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square overflow-hidden rounded-lg transition-all duration-200 ${
              selectedImage === index ? 'ring-primary-500 ring-2 ring-offset-2' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <Image
              src={image}
              alt={`${alt} thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
