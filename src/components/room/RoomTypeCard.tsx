'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AccommodationRoomType } from '@/types/room';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

interface RoomTypeCardProps {
  roomType: AccommodationRoomType;
  onSelect: () => void;
  isSelected: boolean;
}

export function RoomTypeCard({ roomType, onSelect, isSelected }: RoomTypeCardProps) {
  const price = roomType.price_override ?? roomType.room_type?.base_price ?? 0;
  const amenities = roomType.room_type?.amenities || [];
  
  return (
    <Card className={`border-2 transition-all ${isSelected ? 'border-primary' : 'border-transparent hover:border-muted'}`}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <CardTitle className="text-xl">{roomType.room_type?.name}</CardTitle>
          <div className="text-2xl font-bold text-primary">
            ${price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ night</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icons.users className="h-4 w-4" />
            <span>Max {roomType.room_type?.max_occupancy} guests</span>
          </div>
          {roomType.available_rooms > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <Icons.checkCircle className="h-4 w-4" />
              <span>{roomType.available_rooms} available</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 text-muted-foreground">
          {roomType.room_type?.description || 'Comfortable room with all necessary amenities.'}
        </p>
        
        {amenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Room Amenities</h4>
            <div className="grid grid-cols-2 gap-2">
              {amenities.slice(0, 6).map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">
                    <Icons.checkCircle className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{amenity.name}</span>
                </div>
              ))}
            </div>
            {amenities.length > 6 && (
              <Button variant="ghost" size="sm" className="mt-2 text-xs h-8 px-2">
                +{amenities.length - 6} more amenities
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSelect}
          className="w-full"
          variant={isSelected ? 'default' : 'outline'}
          disabled={roomType.available_rooms === 0}
        >
          {isSelected ? 'Selected' : roomType.available_rooms > 0 ? 'Select Room' : 'Not Available'}
        </Button>
      </CardFooter>
    </Card>
  );
}
