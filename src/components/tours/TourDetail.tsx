'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
// Router import removed as it's no longer needed in this component
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Plus, Minus, X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { useBookingStore } from '@/store/booking';
import { BookingConfirmationModal } from '@/components/booking/BookingConfirmationModal';
// Date picker component will be implemented separately
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import TourCard from './TourCard';
import dynamic from 'next/dynamic';

interface TourItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string[];
}

interface TourDetailProps {
  tour: {
    id: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    images: string[];
    highlights?: string[];
    itinerary?: TourItineraryItem[];
    rating?: number;
    reviewCount?: number;
    destination?: string;
    included?: string[];
    excluded?: string[];
    reviews?: Array<{
      id: string;
      author: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  similarTours?: Array<{
    id: string;
    title: string;
    price: number;
    duration: number;
    rating: number;
    reviewCount: number;
    image: string;
  }>;
}

export const TourDetail = ({ tour, similarTours = [] }: TourDetailProps) => {
  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [guests, setGuests] = useState(1);
  
  // Booking store
  const { setBooking, openModal } = useBookingStore();
  
  // Calculate prices
  const subtotal = tour.price * guests;
  const serviceFee = Math.round(tour.price * guests * 0.1); // 10% service fee
  const totalPrice = subtotal + serviceFee;
  
  // Handle booking
  const handleBookNow = useCallback(() => {
    // Set booking data in the store
    setBooking({
      tour,
      date: selectedDate?.toISOString() || new Date().toISOString(),
      guests,
      totalPrice,
      serviceFee,
    });
    
    // Open the booking modal
    openModal();
  }, [tour, selectedDate, guests, totalPrice, serviceFee, setBooking, openModal]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Dynamically import Calendar component to avoid SSR issues
  const Calendar = dynamic(
    () => import('@/components/ui/calendar').then((mod) => mod.Calendar),
    { 
      ssr: false, 
      loading: () => <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-md" /> 
    }
  );
  
  // Calendar component with proper typing for the date picker
  const DatePicker = () => (
    <Calendar
      mode="single"
      selected={selectedDate || undefined}
      onSelect={handleDateSelect}
      initialFocus
    />
  );

  const renderImageGallery = () => {
    return (
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden flex border border-gray-200">
        {/* Thumbnails on the left */}
        <div className="w-20 flex-shrink-0 bg-gray-50 p-2 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {tour.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-full aspect-square rounded-md overflow-hidden border transition-all ${
                  index === currentImageIndex ? 'border-2 border-primary' : 'border-gray-200'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`"${tour.title}" thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Main image */}
        <div className="relative flex-1 h-[500px] bg-gray-100">
          <Image
            src={tour.images[currentImageIndex] || '/placeholder.svg'}
            alt={`${tour.title} - Main view`}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover"
            priority={currentImageIndex === 0}
          />
          <button
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev - 1 + tour.images.length) % tour.images.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex((prev) => (prev + 1) % tour.images.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </div>
    );
  };

  const renderSimilarTours = () => {
    if (!similarTours?.length) return null;

    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarTours.map((tour) => (
            <TourCard 
              key={tour.id}
              id={tour.id}
              title={tour.title}
              price={tour.price}
              duration={tour.duration}
              ratingsAverage={tour.rating}
              ratingsQuantity={tour.reviewCount}
              imageCover={tour.image}
              slug={`/tours/${tour.id}`}
              destinations={[]}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (!tour.reviews?.length) {
      return <p>No reviews yet. Be the first to review!</p>;
    }

    return (
      <div className="space-y-6">
        {tour.reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{review.author}</div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">{review.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderItinerary = () => {
    if (!tour.itinerary?.length) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Itinerary</h3>
        <div className="space-y-6">
          {tour.itinerary.map((day) => (
            <div key={day.day} className="border rounded-lg p-4">
              <h4 className="font-medium text-lg">Day {day.day}: {day.title}</h4>
              <p className="mt-2 text-gray-600">{day.description}</p>
              {day.activities?.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium">Activities:</h5>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {day.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with tour title and breadcrumbs */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-700 hover:text-gray-900 text-sm">
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <a href="/tours" className="text-gray-700 hover:text-gray-900 ml-1 text-sm md:ml-2">
                    Tours
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 ml-1 text-sm md:ml-2">{tour.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{tour.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{tour.rating || 'N/A'}</span>
                  {tour.reviewCount && (
                    <span className="ml-2 text-sm">({tour.reviewCount} reviews)</span>
                  )}
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="ml-1">{tour.destination || 'Multiple destinations'}</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="ml-1">{tour.duration} days</span>
                </div>
              </div>
            </div>
            {renderImageGallery()}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:sticky lg:top-8 h-[500px]">
            <Card className="shadow-lg h-full flex flex-col">
              <CardHeader className="bg-gray-50 border-b p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">{formatPrice(tour.price)}</CardTitle>
                    <CardDescription>per person</CardDescription>
                  </div>
                  <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {tour.rating || 'N/A'}
                    {tour.reviewCount && ` (${tour.reviewCount})`}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleBookNow();
                }} className="space-y-4 flex-1 flex flex-col">
                  <div>
                    <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !selectedDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DatePicker />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </Label>
                    <div className="flex items-center border rounded-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-r-none"
                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="font-medium">{guests}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-l-none"
                        onClick={() => setGuests(prev => prev + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{formatPrice(tour.price)} × {guests} {guests > 1 ? 'guests' : 'guest'}</span>
                        <span className="font-medium">{formatPrice(tour.price * guests)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Service fee</span>
                        <span>{formatPrice(serviceFee)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBookNow} 
                      className="w-full md:w-auto"
                      size="lg"
                    >
                      Book Now
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tour Content */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">{tour.description}</p>
                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Highlights</h3>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="mt-6">
              {renderItinerary()}
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Included</h3>
                  <ul className="space-y-2">
                    {tour.included?.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{item}</span>
                      </li>
                    )) || <p>No inclusions specified</p>}
                  </ul>
                </div>
                {tour.excluded && tour.excluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Not Included</h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {renderReviews()}
            </TabsContent>
          </Tabs>
        </div>

        {renderSimilarTours()}
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal />
    </div>
  );
};

export default TourDetail;