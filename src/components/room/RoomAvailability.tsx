'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, Bed, Ruler, Wifi, Tv, Coffee, WashingMachine, Utensils, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AccommodationRoomType } from '@/types/room';

interface RoomAvailabilityProps {
  roomTypes: AccommodationRoomType[];
  onSelect: (roomType: AccommodationRoomType) => void;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onDatesChange: (checkIn: Date | undefined, checkOut: Date | undefined) => void;
}

export function RoomAvailability({
  roomTypes,
  onSelect,
  checkIn,
  checkOut,
  onDatesChange,
}: RoomAvailabilityProps) {
  const [adults, setAdults] = useState(2);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);

  const handleSelectRoom = (roomType: AccommodationRoomType) => {
    setSelectedRoomType(roomType.id);
    onSelect(roomType);
  };

  const handleIncrementAdults = () => {
    setAdults((prev) => Math.min(prev + 1, 10));
  };

  const handleDecrementAdults = () => {
    setAdults((prev) => Math.max(prev - 1, 1));
  };

  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Check-in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !checkIn && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, 'PPP') : <span>Select check-in date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={(date) => onDatesChange(date || undefined, checkOut)}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Check-out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !checkOut && 'text-muted-foreground'
                )}
                disabled={!checkIn}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, 'PPP') : <span>Select check-out date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={(date) => onDatesChange(checkIn, date || undefined)}
                disabled={(date) => !checkIn || date <= checkIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Guests</label>
        <div className="flex items-center justify-between p-3 border rounded-md">
          <span className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4" />
            {adults} {adults === 1 ? 'Adult' : 'Adults'}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrementAdults}
              disabled={adults <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center">{adults}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrementAdults}
              disabled={adults >= 10}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {checkIn && checkOut && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Rooms</h3>
            <p className="text-sm text-muted-foreground">
              {nights} {nights === 1 ? 'night' : 'nights'}
            </p>
          </div>

          <div className="space-y-4">
            {roomTypes.map((roomType) => (
              <Card 
                key={roomType.id}
                className={cn(
                  'transition-all',
                  selectedRoomType === roomType.id && 'ring-2 ring-primary'
                )}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{roomType.room_type?.name}</CardTitle>
                    <div className="text-2xl font-semibold text-primary">
                      {formatPrice(roomType.price_override || roomType.room_type?.base_price || 0)}
                      <span className="text-sm font-normal text-muted-foreground"> / night</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {roomType.room_type?.max_occupancy} guests
                    </div>
                    {roomType.room_type?.room_size && (
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1" />
                        {roomType.room_type.room_size} m²
                      </div>
                    )}
                    {roomType.room_type?.bed_type && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {roomType.room_type.bed_type}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {roomType.room_type?.description || 'Comfortable room with all necessary amenities.'}
                  </p>
                  
                  {roomType.room_type?.amenities && roomType.room_type.amenities.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Room Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {roomType.room_type.amenities.slice(0, 4).map((amenity) => (
                          <div 
                            key={amenity.id}
                            className="flex items-center text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {amenity.icon === 'wifi' && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity.icon === 'tv' && <Tv className="h-3 w-3 mr-1" />}
                            {amenity.icon === 'coffee' && <Coffee className="h-3 w-3 mr-1" />}
                            {amenity.icon === 'utensils' && <Utensils className="h-3 w-3 mr-1" />}
                            {amenity.icon === 'dumbbell' && <Dumbbell className="h-3 w-3 mr-1" />}
                            {amenity.name}
                          </div>
                        ))}
                        {roomType.room_type.amenities.length > 4 && (
                          <div className="text-xs text-muted-foreground flex items-center">
                            +{roomType.room_type.amenities.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleSelectRoom(roomType)}
                    disabled={!roomType.is_available}
                  >
                    {roomType.is_available ? 'Select Room' : 'Not Available'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
