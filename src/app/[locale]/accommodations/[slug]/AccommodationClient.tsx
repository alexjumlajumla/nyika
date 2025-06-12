"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInDays, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Types
type DateRange = {
  from: Date | null;
  to: Date | null;
};

interface RoomType {
  id: string | number;
  name: string;
  description?: string;
  base_price?: number;
  max_occupancy?: number;
  room_size?: number | null;
  bed_type?: string | null;
  amenities?: string[];
  image_urls?: string[];
  available_rooms?: number;
}

interface RoomWithAvailability extends Omit<RoomType, 'image_urls'> {
  id: string;
  description: string;
  base_price: number;
  price_per_night: number;
  max_occupancy: number;
  room_size: number | null;
  bed_type: string | null;
  quantity_available: number;
  quantity: number;
  totalPrice: number;
  available: boolean;
  images: string[];
  amenities: string[];
}

interface AccommodationClientProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    base_price?: number;
    rating?: number;
    room_types?: RoomType[];
  };
}

export default function AccommodationClient({ initialData }: AccommodationClientProps) {
  const router = useRouter();
  
  // State
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 2)
  });
  const [selectedRoom, setSelectedRoom] = useState<RoomWithAvailability | null>(null);
  const [adults, setAdults] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return Math.max(1, differenceInDays(dateRange.to, dateRange.from));
  }, [dateRange]);

  // Process room data
  const processedRooms = useMemo<RoomWithAvailability[]>(() => {
    if (!initialData.room_types?.length) return [];
    
    return initialData.room_types.map(room => ({
      ...room,
      id: String(room.id),
      name: room.name || 'Standard Room',
      description: room.description || '',
      base_price: room.base_price || 0,
      price_per_night: room.base_price || 0,
      max_occupancy: room.max_occupancy || 2,
      room_size: room.room_size ?? null,
      bed_type: room.bed_type ?? null,
      quantity_available: room.available_rooms || 0,
      quantity: 1,
      totalPrice: (room.base_price || 0) * numberOfNights,
      available: (room.available_rooms || 0) > 0,
      images: room.image_urls || [],
      amenities: room.amenities || []
    }));
  }, [initialData.room_types, numberOfNights]);

  // Set first available room as selected on initial load
  useEffect(() => {
    if (processedRooms.length > 0 && !selectedRoom) {
      const firstAvailableRoom = processedRooms.find(room => room.available) || processedRooms[0];
      setSelectedRoom(firstAvailableRoom);
    }
  }, [processedRooms, selectedRoom]);

  // Format price helper
  const formatPrice = useCallback((price: number | string | undefined): string => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price ?? 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceNum);
  }, []);

  // Handle book now
  const handleBookNow = useCallback(async () => {
    if (!selectedRoom || !dateRange.from || !dateRange.to) {
      setError('Please select a room and date range');
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      router.push(
        `/book?roomId=${selectedRoom.id}` +
        `&checkIn=${dateRange.from.toISOString()}` +
        `&checkOut=${dateRange.to.toISOString()}` +
        `&adults=${adults}`
      );
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      if (process.env.NODE_ENV !== 'production') {
        console.error('Booking error:', err);
      }
    } finally {
      setIsBooking(false);
    }
  }, [selectedRoom, dateRange, adults, router]);

  // Handle date range selection
  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDateRange(prev => {
      if (!prev.from || prev.to) {
        return { from: selectedDate, to: null };
      } else if (prev.from) {
        const start = prev.from;
        const end = selectedDate;
        return {
          from: start < end ? start : end,
          to: start < end ? end : start
        };
      }
      return prev;
    });
  }, []);

  // Handle adult count changes
  const handleIncrementAdults = useCallback(() => {
    if (selectedRoom && adults < selectedRoom.max_occupancy) {
      setAdults(prev => prev + 1);
    }
  }, [adults, selectedRoom]);

  const handleDecrementAdults = useCallback(() => {
    if (adults > 1) {
      setAdults(prev => prev - 1);
    }
  }, [adults]);

  // Fetch available rooms when date range changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!dateRange.from || !dateRange.to) return;
      
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/rooms/available?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
        // const data = await response.json();
      } catch (err) {
        setError('Failed to fetch available rooms');
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching rooms:', err);
        }
      }
    };

    fetchRooms();
  }, [dateRange]);

  if (!initialData) {
    return <div>Loading accommodation data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{initialData.name}</h1>
      <p className="text-gray-600 mb-8">{initialData.description}</p>
      
      {/* Room Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room List */}
        <div className="md:col-span-2 space-y-4">
          {processedRooms.map(room => (
            <Card key={room.id} className={`p-4 ${selectedRoom?.id === room.id ? 'border-blue-500' : ''}`}>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{room.name}</h3>
                    <p className="text-gray-600">{room.description}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Max Occupancy: {room.max_occupancy}</p>
                      <p className="text-sm text-gray-500">Room Size: {room.room_size ? `${room.room_size} sqm` : 'N/A'}</p>
                      <p className="text-sm text-gray-500">Bed Type: {room.bed_type || 'N/A'}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-semibold">
                        {formatPrice(room.price_per_night)} <span className="text-sm font-normal">/ night</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {numberOfNights} night{numberOfNights !== 1 ? 's' : ''}: {formatPrice(room.totalPrice)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedRoom(room)}
                    variant={selectedRoom?.id === room.id ? 'default' : 'outline'}
                  >
                    {selectedRoom?.id === room.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Booking Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Stay</h2>
              
              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                <div className="p-3 border rounded-md">
                  {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                </div>
              </div>
              
              {/* Guest Count */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDecrementAdults}
                    disabled={adults <= 1}
                  >
                    -
                  </Button>
                  <span>{adults} {adults === 1 ? 'Adult' : 'Adults'}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleIncrementAdults}
                    disabled={!selectedRoom || adults >= (selectedRoom?.max_occupancy || 2)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Selected Room */}
              {selectedRoom && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">Selected Room</h3>
                  <p>{selectedRoom.name}</p>
                  <p className="text-sm text-gray-600">
                    {numberOfNights} night{numberOfNights !== 1 ? 's' : ''} • {formatPrice(selectedRoom.totalPrice)}
                  </p>
                </div>
              )}
              
              {/* Book Now Button */}
              <Button 
                className="w-full mt-6" 
                onClick={handleBookNow}
                disabled={!selectedRoom || isBooking}
              >
                {isBooking ? 'Booking...' : 'Book Now'}
              </Button>
              
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}