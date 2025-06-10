'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Calendar, Star, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingModal } from '@/components/booking/BookingModal';

type Tour = {
  id: string;
  title: string;
  subtitle: string;
  destination: string;
  duration: string;
  groupSize: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  overview: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
};

export function TourDetail({ tour }: { tour: Tour }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === tour.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? tour.images.length - 1 : prev - 1
    );
  };

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="relative mb-8 overflow-hidden rounded-2xl">
        <div className="relative h-[400px] bg-gray-100 dark:bg-gray-800 md:h-[500px]">
          <img
            src={tour.images[currentImageIndex]}
            alt={tour.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-900 shadow-lg transition-all hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-900 shadow-lg transition-all hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Image Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {tour.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{tour.destination}</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{tour.title}</h1>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">{tour.subtitle}</p>
            
            <div className="mb-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-800">
                <Clock className="h-5 w-5 text-primary" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-800">
                <Users className="h-5 w-5 text-primary" />
                <span>Max {tour.groupSize}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-800">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <span>{tour.rating} ({tour.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold">About this tour</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {tour.overview}
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold">Highlights</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                <div className="p-6 text-center">
                  <MapPin className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">Interactive map will be displayed here</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="space-y-6">
              {tour.itinerary.map((day) => (
                <Card key={day.day} className="overflow-hidden">
                  <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <CardTitle className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {day.day}
                      </span>
                      <span>{day.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300">{day.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold">What's Included</h4>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-0.5 text-green-500">✓</div>
                        <span className="text-gray-600 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold">What's Not Included</h4>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-0.5 text-red-500">✕</div>
                        <span className="text-gray-600 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Card */}
        <div className="self-start lg:sticky lg:top-24">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-2xl">${tour.price}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">per person</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label htmlFor="guests" className="mb-1 block text-sm font-medium">
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    className="w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    defaultValue="1"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Book Now Button */}
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handleBookNow}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  Free cancellation up to 24 hours in advance
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Video Card */}
          <Card className="mt-6 overflow-hidden">
            <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/50">
              <CardTitle>Tour Video</CardTitle>
            </CardHeader>
            <div className="flex aspect-video items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <div className="border-l-12 h-0 w-0 border-b-8 border-t-8 border-b-transparent border-l-white border-t-transparent" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">Tour video will be displayed here</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tour={{
          id: tour.id,
          name: tour.title,
          price: tour.price,
          duration: parseInt(tour.duration.split(' ')[0]) || 1,
          image: tour.images[0]
        }}
      />
    </div>
  );
}
