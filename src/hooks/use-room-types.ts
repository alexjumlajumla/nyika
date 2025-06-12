import { useState, useEffect } from 'react';
import { AccommodationRoomType } from '@/types/room';
import { createClient } from '@/lib/supabase/client';

export function useRoomTypes(accommodationId: string, checkIn?: Date, checkOut?: Date) {
  const [roomTypes, setRoomTypes] = useState<AccommodationRoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!accommodationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        let query = supabase
          .from('accommodation_room_types')
          .select(`
            *,
            room_types(
              *,
              amenities(*)
            )
          `)
          .eq('accommodation_id', accommodationId)
          .eq('is_available', true);

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        // Transform the data to match our types
        const transformedData = (data || []).map(item => ({
          ...item,
          room_type: item.room_types,
          // Calculate available rooms (you might want to adjust this based on your booking logic)
          available_rooms: item.total_rooms - (item.total_rooms - item.available_rooms),
        }));

        setRoomTypes(transformedData);
      } catch (err) {
        console.error('Error fetching room types:', err);
        setError(err instanceof Error ? err : new Error('Failed to load room types'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomTypes();
  }, [accommodationId, checkIn, checkOut]);

  return { roomTypes, isLoading, error };
}
