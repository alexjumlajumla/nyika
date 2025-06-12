'use client';

import { useState } from 'react';
import { RoomTypeCard } from './RoomTypeCard';
import { AccommodationRoomType } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomTypeSelectorProps {
  roomTypes: AccommodationRoomType[];
  onSelect: (roomType: AccommodationRoomType) => void;
  isLoading?: boolean;
}

export function RoomTypeSelector({ roomTypes, onSelect, isLoading = false }: RoomTypeSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (roomType: AccommodationRoomType) => {
    setSelectedId(roomType.id);
    onSelect(roomType);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (roomTypes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Icons.bed className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No rooms available</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no rooms available for the selected dates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {roomTypes
          .filter(rt => rt.is_available && rt.available_rooms > 0)
          .map((roomType) => (
            <RoomTypeCard
              key={roomType.id}
              roomType={roomType}
              isSelected={selectedId === roomType.id}
              onSelect={() => handleSelect(roomType)}
            />
          ))}
      </div>
      
      {selectedId && (
        <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
          <div className="container flex justify-end">
            <Button 
              size="lg" 
              className="min-w-[200px]"
              onClick={() => {
                const selected = roomTypes.find(rt => rt.id === selectedId);
                if (selected) onSelect(selected);
              }}
            >
              Continue to Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
