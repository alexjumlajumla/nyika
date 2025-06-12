import supabase from './client';
import { RoomType, RoomTypeFormData, AccommodationRoomType } from '@/types/room';
import { format } from 'date-fns';

interface RoomBooking {
  room_type_id: string;
  quantity: number;
}

export const getRoomTypes = async (): Promise<RoomType[]> => {
  const { data, error } = await supabase
    .from('room_types')
    .select('*')
    .order('base_price', { ascending: true });

  if (error) {
    console.error('Error fetching room types:', error);
    throw error;
  }

  return data || [];
};

export const getRoomTypeById = async (id: string): Promise<RoomType | null> => {
  if (!id) return null;
  
  const { data, error } = await supabase
    .from('room_types')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching room type ${id}:`, error);
    return null;
  }

  return data;
};

export const createRoomType = async (roomTypeData: RoomTypeFormData): Promise<RoomType | null> => {
  const { data, error } = await supabase
    .from('room_types')
    .insert([{
      name: roomTypeData.name,
      description: roomTypeData.description,
      icon: roomTypeData.icon,
      max_occupancy: roomTypeData.max_occupancy,
      base_price: roomTypeData.base_price,
      is_active: roomTypeData.is_active
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating room type:', error);
    throw error;
  }

  return data;
};

export const updateRoomType = async (id: string, roomTypeData: Partial<RoomTypeFormData>): Promise<RoomType | null> => {
  const { data, error } = await supabase
    .from('room_types')
    .update({
      ...roomTypeData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating room type ${id}:`, error);
    throw error;
  }

  return data;
};

export const deleteRoomType = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('room_types')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting room type ${id}:`, error);
    throw error;
  }

  return true;
};

export const getRoomTypeAmenities = async (roomTypeId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('room_type_amenities')
    .select('amenities(name)')
    .eq('room_type_id', roomTypeId);

  if (error) {
    console.error(`Error fetching amenities for room type ${roomTypeId}:`, error);
    return [];
  }

  // Type assertion to handle the response shape
  return (data as Array<{ amenities: { name: string }[] }>)
    .flatMap(item => item.amenities?.map(amenity => amenity.name) || [])
    .filter((name): name is string => Boolean(name));
};

export const getRoomTypesByAccommodation = async (
  accommodationId: string,
  checkIn?: Date,
  checkOut?: Date
): Promise<AccommodationRoomType[]> => {
  // Base query to get accommodation room types
  const { data, error } = await supabase
    .from('accommodation_room_types')
    .select(`
      *,
      room_type:room_types(*)
    `)
    .eq('accommodation_id', accommodationId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching room types for accommodation:', error);
    return [];
  }

  // If no check-in/check-out dates, return basic availability
  if (!checkIn || !checkOut) {
    return (data || []).map((room: AccommodationRoomType) => ({
      ...room,
      is_available: true,
      available_rooms: room.quantity_available || 0
    }));
  }

  // If we have dates, check availability
  const formattedCheckIn = format(checkIn, 'yyyy-MM-dd');
  const formattedCheckOut = format(checkOut, 'yyyy-MM-dd');

  // Get bookings that overlap with the selected dates
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('room_type_id, quantity')
    .or(`
      and(check_in.lte.${formattedCheckIn},check_out.gt.${formattedCheckIn}),
      and(check_in.lt.${formattedCheckOut},check_out.gte.${formattedCheckOut}),
      and(check_in.gte.${formattedCheckIn},check_out.lte.${formattedCheckOut})
    `);

  if (bookingsError) {
    console.error('Error checking room availability:', bookingsError);
    return (data || []).map((room: AccommodationRoomType) => ({
      ...room,
      is_available: false,
      available_rooms: 0
    }));
  }

  // Calculate available rooms for each room type
  const bookedRooms = new Map<string, number>();
  (bookings as RoomBooking[] | null)?.forEach((booking: RoomBooking) => {
    const count = bookedRooms.get(booking.room_type_id) || 0;
    bookedRooms.set(booking.room_type_id, count + (booking.quantity || 1));
  });

  // Return room types with availability
  return (data || []).map((room: AccommodationRoomType) => {
    const bookedCount = bookedRooms.get(room.room_type_id) || 0;
    const availableRooms = Math.max(0, (room.quantity_available || 0) - bookedCount);
    
    return {
      ...room,
      is_available: availableRooms > 0,
      available_rooms: availableRooms
    } as AccommodationRoomType;
  });
};

export const updateRoomTypeAmenities = async (
  roomTypeId: string,
  amenityIds: string[]
): Promise<boolean> => {
  // Start a transaction
  const { error: deleteError } = await supabase
    .from('room_type_amenities')
    .delete()
    .eq('room_type_id', roomTypeId);

  if (deleteError) {
    console.error('Error clearing room type amenities:', deleteError);
    throw deleteError;
  }

  if (amenityIds.length === 0) return true;

  const { error: insertError } = await supabase
    .from('room_type_amenities')
    .insert(amenityIds.map(amenityId => ({
      room_type_id: roomTypeId,
      amenity_id: amenityId
    })));

  if (insertError) {
    console.error('Error adding room type amenities:', insertError);
    throw insertError;
  }

  return true;
};
