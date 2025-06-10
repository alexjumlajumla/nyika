'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  type MediaType = 'video' | 'image';

  interface Slide {
    type: MediaType;
    src: string;
    fallback?: string;
    title: string;
    subtitle: string;
  }

  const slides: Slide[] = [
    {
      type: 'video',
      src: '/videos/hero-safari.mp4',
      fallback: '/images/hero-fallback-1.jpg',
      title: 'Unforgettable African Safaris',
      subtitle: 'Experience the wild like never before with our expert guides',
    },
    {
      type: 'image',
      src: '/images/hero-1.jpg',
      title: 'Luxury in the Wild',
      subtitle: 'Exclusive lodges and camps in the heart of nature',
    },
    {
      type: 'image',
      src: '/images/hero-2.jpg',
      title: 'Cultural Immersion',
      subtitle: 'Connect with local communities and traditions',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentMedia = slides[currentSlide];

  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden rounded-b-3xl">
      {/* Background Media */}
      <div className="absolute inset-0">
        {currentMedia.type === 'video' ? (
          <>
            <video
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="h-full w-full object-cover"
              poster={currentMedia.fallback}
            >
              <source src={currentMedia.src} type="video/mp4" />
              <Image
                src={currentMedia.fallback || '/images/fallback.jpg'}
                alt={currentMedia.title}
                fill
                className="object-cover"
                priority
              />
            </video>
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <>
            <Image
              src={currentMedia.fallback || '/images/fallback.jpg'}
              alt={currentMedia.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4 text-center text-white">
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            {currentMedia.title}
          </h1>
          <p className="mx-auto mb-8 text-xl md:text-2xl">
            {currentMedia.subtitle}
          </p>
        </div>

        {/* Media Controls */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform items-center gap-4 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
          <button
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="rounded-full p-2 text-white hover:bg-white/20"
            aria-label={isVideoPlaying ? 'Pause' : 'Play'}
          >
            {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full p-2 text-white hover:bg-white/20"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          {/* Slide indicators */}
          <div className="mx-2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${currentSlide === index ? 'w-6 bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
