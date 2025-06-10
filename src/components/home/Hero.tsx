'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    title: 'Discover the Heart of Africa',
    subtitle: 'Experience the magic of East Africa with our curated safaris',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    cta: 'Explore Tours',
    ctaLink: '/tours',
  },
  {
    id: 2,
    title: 'Luxury Safari Experiences',
    subtitle: 'Unforgettable journeys in the wildest places on earth',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    cta: 'Discover More',
    ctaLink: '/experiences/luxury',
  },
  {
    id: 3,
    title: 'Witness the Great Migration',
    subtitle: 'See nature\'s greatest wildlife spectacle',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    cta: 'Plan Your Safari',
    ctaLink: '/tours?category=great-migration',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 h-full w-full transition-opacity duration-1000',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <div className="absolute inset-0 z-10 bg-black/40" />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="relative z-20 flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-6 text-xl text-gray-100">
                    {slide.subtitle}
                  </p>
                  <div className="mt-10 flex items-center gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-amber-600 px-8 py-6 text-lg font-semibold hover:bg-amber-700"
                    >
                      <Link href={slide.ctaLink}>
                        {slide.cta}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
                    >
                      <PlayCircleIcon className="mr-2 h-6 w-6" />
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              'h-2 w-8 rounded-full transition-all duration-300',
              index === currentSlide ? 'bg-amber-500 w-12' : 'bg-white/50 hover:bg-white/75'
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:block">
        <div className="flex flex-col items-center text-white">
          <span className="mb-2 text-sm font-medium">Scroll</span>
          <div className="h-10 w-px bg-white/50">
            <div className="h-4 w-px animate-bounce bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
