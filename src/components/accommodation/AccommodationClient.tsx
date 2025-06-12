'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Types
import { Accommodation as AccommodationType } from '@/types/accommodation';

interface RoomType {
  id: string;
  name: string;
  description: string;
  max_occupancy: number;
  base_price: number;
  available_rooms: number;
  images?: string[];
}

import { DateRange as ReactDayPickerDateRange } from 'react-day-picker';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface SelectedRoomType {
  id: string;
  roomType: RoomType;
  quantity: number;
  totalPrice: number;
}

interface AccommodationClientProps {
  initialData: AccommodationType;
}

// Utility function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export default function AccommodationClient({ initialData }: AccommodationClientProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 2),
  } as DateRange);
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoomType | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from) || 1;
  }, [dateRange]);

  // Handle room selection
  const handleSelectRoom = useCallback((room: RoomType) => {
    // Room selection handler
    const totalPrice = room.base_price * numberOfNights;
    setSelectedRoom({
      id: room.id,
      roomType: room,
      quantity: 1,
      totalPrice,
    });
  }, [numberOfNights]);

  // Handle date range selection
  const handleDateSelect = useCallback((selectedRange: ReactDayPickerDateRange | undefined) => {
    if (selectedRange?.from) {
      setDateRange({
        from: selectedRange.from,
        to: selectedRange.to,
      });
    }
  }, []);

  // ... rest of the component code ...


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Accommodation header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{initialData.name}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="mr-2">{initialData.rating || 'N/A'}</span>
          <span>•</span>
          <span className="ml-2">{initialData.review_count || 0} reviews</span>
        </div>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {initialData.images?.slice(0, 5).map((image, index) => (
          <div 
            key={index} 
            className={`relative h-64 ${index === 0 ? 'md:col-span-2 md:row-span-2 h-[32rem]' : 'h-64'}`}
          >
            <Image
              src={image}
              alt={`${initialData.name} ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              priority={index < 3}
            />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Description and amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About this accommodation</h2>
            <p className="text-gray-700 whitespace-pre-line">{initialData.description}</p>
          </div>

          {/* Amenities */}
          {initialData.amenities && initialData.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {initialData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Booking card */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {selectedRoom ? formatPrice(selectedRoom.roomType.base_price) : formatPrice(initialData.price_per_night || 0)}
                  <span className="text-sm font-normal text-gray-500"> / night</span>
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'LLL dd, y')} -{' '}
                              {format(dateRange.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(dateRange.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Select dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Adults</label>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="flex-1 text-center">{adults}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAdults(adults + 1)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Children</label>
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="flex-1 text-center">{children}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setChildren(children + 1)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRoom && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        {selectedRoom.quantity} x {selectedRoom.roomType.name}
                      </span>
                      <span>{formatPrice(selectedRoom.roomType.base_price)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(selectedRoom.totalPrice)}</span>
                    </div>
                  </div>
                )}

                <Button className="w-full mt-4" size="lg" disabled={!selectedRoom || isLoading}>
                  {isLoading ? 'Processing...' : 'Book Now'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
