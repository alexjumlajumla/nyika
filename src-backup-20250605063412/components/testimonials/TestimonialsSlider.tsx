'use client';

import { useState, useEffect } from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  content: string;
  date: string;
  tour: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Adventure Seeker',
    image: '/images/testimonials/sarah.jpg',
    rating: 5,
    content:
      'The Serengeti migration safari was the experience of a lifetime. Our guide was incredibly knowledgeable and we saw the Big Five within the first two days! The accommodations were luxurious and the food was exceptional.',
    date: 'March 15, 2024',
    tour: 'Serengeti Great Migration Safari',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Photography Enthusiast',
    image: '/images/testimonials/michael.jpg',
    rating: 5,
    content:
      'As a photographer, I had high expectations for the landscapes and wildlife in Tanzania. Nyika Safaris exceeded them all. The guides knew all the best spots for photography and were incredibly patient.',
    date: 'February 28, 2024',
    tour: 'Tanzania Photography Expedition',
  },
  {
    id: 3,
    name: 'The Rodriguez Family',
    role: 'Family Travelers',
    image: '/images/testimonials/rodriguez.jpg',
    rating: 5,
    content:
      'Traveling with kids can be challenging, but Nyika made it seamless. Our children (ages 8 and 12) were engaged the entire time, and the guides were wonderful with them. We\'ll be back for sure!',
    date: 'January 10, 2024',
    tour: 'Family Safari Adventure',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Solo Traveler',
    image: '/images/testimonials/james.jpg',
    rating: 4,
    content:
      'The Kilimanjaro climb was challenging but worth every step. The team was professional and supportive. Only giving 4 stars because the weather was quite unpredictable, but that\'s nature!',
    date: 'December 5, 2023',
    tour: 'Mount Kilimanjaro Climb',
  },
];

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) =>
        i < Math.floor(rating) ? (
          <StarIconSolid key={i} className="h-5 w-5 text-amber-400" />
        ) : (
          <StarIconOutline key={i} className="h-5 w-5 text-amber-400" />
        )
      );
  };

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Travelers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Don't just take our word for it. Here's what our clients have to say about their
            experiences with us.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="relative overflow-hidden">
            <div className="relative h-[400px] md:h-[350px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-1000',
                    index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  )}
                >
                  <div className="mx-auto max-w-3xl">
                    <div className="relative">
                      <div className="relative rounded-2xl bg-white px-8 py-10 shadow-lg md:px-12 md:py-12">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              className="h-16 w-16 rounded-full"
                              src={testimonial.image}
                              alt={testimonial.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="flex">{renderStars(testimonial.rating)}</div>
                              <p className="ml-2 text-sm text-gray-500">
                                {testimonial.rating.toFixed(1)}/5.0
                              </p>
                            </div>
                            <p className="text-lg font-medium text-gray-900">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                        <blockquote className="mt-6">
                          <p className="text-lg text-gray-700">"{testimonial.content}"</p>
                        </blockquote>
                        <div className="mt-6">
                          <p className="text-sm font-medium text-gray-900">
                            {testimonial.tour}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">{testimonial.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  index === currentIndex ? 'bg-amber-500' : 'bg-gray-300 hover:bg-gray-400'
                )}
                onClick={() => goToTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
