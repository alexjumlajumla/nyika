"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Loader2 } from 'lucide-react'; // Removed unused icons
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Removed unused CardFooter
// Removed unused Badge and Separator imports
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Removed unused Textarea and Select components
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Types
type BookingFormData = {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  adults: number;
  children: number;
  roomType: string;
  specialRequests: string;
};

interface Room {
  id: string;
  name: string;
  description: string;
  max_occupancy: number;
  price_per_night: number;
  images: string[];
  amenities: string[];
  size_sqm?: number;
  bed_type?: string;
  view?: string;
  quantity_available: number;
}

interface AccommodationLocation {
  address: string;
  city?: string;
  country?: string;
}

interface Accommodation {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: AccommodationLocation | string;
  rating?: number;
  review_count?: number;
  images: string[];
  amenities: string[];
  rooms: Room[];
  created_at?: string;
  updated_at?: string;
}

interface AccommodationClientProps {
  initialData: Accommodation | null;
  slug: string;
}

const AccommodationClient = ({ initialData, slug }: AccommodationClientProps) => {
  const [accommodation, setAccommodation] = useState<Accommodation | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  // Removed unused isFavorite state
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    checkIn: undefined,
    checkOut: undefined,
    adults: 2,
    children: 0,
    roomType: '',
    specialRequests: '',
  });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const params = useParams();

  // Fetch accommodation data if not provided
  useEffect(() => {
    if (initialData) return;

    const fetchAccommodation = async () => {
      try {
        setIsLoading(true);
        const accommodationSlug = slug || (Array.isArray(params.slug) ? params.slug[0] : params.slug) || '';
        const response = await fetch(`/api/accommodations/${accommodationSlug}`, {
          headers: {
            'Accept-Language': (params.locale as string) || 'en',
          },
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch accommodation');
        }

        const data = await response.json();
        setAccommodation(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodation();
  }, [initialData, params.locale, params.slug, slug]);

  // Handle booking form changes
  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value, 10) : value,
    }));
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined, field: 'checkIn' | 'checkOut') => {
    setBookingForm(prev => ({
      ...prev,
      [field]: date,
    }));
  };

  // Calculate number of nights
  const calculateNights = useCallback((start: Date | undefined, end: Date | undefined): number => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  // Calculate total price
  const calculateTotalPrice = useCallback((): number => {
    if (!selectedRoom || !bookingForm.checkIn || !bookingForm.checkOut || !accommodation?.rooms) return 0;
    
    const room = accommodation.rooms.find(r => r.id === selectedRoom);
    if (!room) return 0;
    
    const nights = calculateNights(bookingForm.checkIn, bookingForm.checkOut);
    return nights * room.price_per_night;
  }, [selectedRoom, bookingForm.checkIn, bookingForm.checkOut, accommodation?.rooms, calculateNights]);

  const totalPrice = useMemo(() => calculateTotalPrice(), [calculateTotalPrice]);

  // Format price
  const formatPrice = (price: number | undefined): string => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="text-2xl font-bold text-red-600">Error loading accommodation</div>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Render not found state
  if (!accommodation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="text-2xl font-bold">Accommodation not found</div>
        <p className="mt-2 text-gray-600">The requested accommodation could not be found.</p>
      </div>
    );
  }

  // Render main content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{accommodation.name}</h1>
        <div className="mt-2 flex items-center text-gray-600">
          <MapPin className="mr-1 h-4 w-4" />
          {typeof accommodation.location === 'string' ? (
            <span>{accommodation.location}</span>
          ) : (
            <span>
              {accommodation.location.address}
              {accommodation.location.city && `, ${accommodation.location.city}`}
              {accommodation.location.country && `, ${accommodation.location.country}`}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="mb-8">
            {accommodation.images && accommodation.images.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                  <img
                    src={accommodation.images[0]}
                    alt={accommodation.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {accommodation.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {accommodation.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${accommodation.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">About this accommodation</h2>
            <p className="text-gray-700">{accommodation.description}</p>
          </div>

          {/* Amenities */}
          {accommodation.amenities && accommodation.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2 text-amber-600">•</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {accommodation.rooms && accommodation.rooms.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">Rooms</h2>
              <div className="space-y-6">
                {accommodation.rooms.map((room) => (
                  <Card key={room.id}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <h3 className="text-xl font-semibold">{room.name}</h3>
                          <p className="mt-2 text-gray-600">{room.description}</p>
                          
                          <div className="mt-4">
                            <div className="flex items-center">
                              <span className="font-medium">Max Occupancy:</span>
                              <span className="ml-2">{room.max_occupancy} {room.max_occupancy === 1 ? 'person' : 'people'}</span>
                            </div>
                            {room.size_sqm && (
                              <div className="mt-1">
                                <span className="font-medium">Size:</span>
                                <span className="ml-2">{room.size_sqm} m²</span>
                              </div>
                            )}
                            {room.bed_type && (
                              <div className="mt-1">
                                <span className="font-medium">Bed Type:</span>
                                <span className="ml-2">{room.bed_type}</span>
                              </div>
                            )}
                            {room.view && (
                              <div className="mt-1">
                                <span className="font-medium">View:</span>
                                <span className="ml-2">{room.view}</span>
                              </div>
                            )}
                          </div>

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium">Room Amenities:</h4>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {room.amenities.map((amenity, index) => (
                                  <div key={index} className="flex items-center">
                                    <span className="mr-2 text-amber-600">•</span>
                                    <span>{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-600">
                              {formatPrice(room.price_per_night)}
                              <span className="text-sm font-normal text-gray-500">/night</span>
                            </div>
                            <Button
                              className="mt-4 w-full"
                              onClick={() => setSelectedRoom(room.id)}
                            >
                              Select Room
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Booking form */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Book Now</CardTitle>
              <CardDescription>
                Check availability and book your stay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingForm.checkIn && "text-muted-foreground"
                          )}
                        >
                          {bookingForm.checkIn ? (
                            format(bookingForm.checkIn, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingForm.checkIn}
                          onSelect={(date) => handleDateSelect(date, 'checkIn')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="checkOut">Check-out</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingForm.checkOut && "text-muted-foreground"
                          )}
                        >
                          {bookingForm.checkOut ? (
                            format(bookingForm.checkOut, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingForm.checkOut}
                          onSelect={(date) => handleDateSelect(date, 'checkOut')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adults">Adults</Label>
                      <Input
                        id="adults"
                        type="number"
                        min="1"
                        value={bookingForm.adults}
                        onChange={handleBookingFormChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="children">Children</Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        value={bookingForm.children}
                        onChange={handleBookingFormChange}
                      />
                    </div>
                  </div>

                  {selectedRoom && (
                    <div className="mt-6 rounded-lg border bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">
                            {accommodation.rooms.find(r => r.id === selectedRoom)?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bookingForm.checkIn && bookingForm.checkOut && (
                              `${calculateNights(bookingForm.checkIn, bookingForm.checkOut)} nights`
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(totalPrice)}
                          </div>
                          {bookingForm.checkIn && bookingForm.checkOut && (
                            <div className="text-xs text-gray-500">
                              {formatPrice(accommodation.rooms.find(r => r.id === selectedRoom)?.price_per_night)} × {calculateNights(bookingForm.checkIn, bookingForm.checkOut)} nights
                            </div>
                          )}
                        </div>
                      </div>

                      <Button type="submit" className="mt-4 w-full">
                        Book Now
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccommodationClient;