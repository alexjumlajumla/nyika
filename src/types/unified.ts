import { Accommodation as DatabaseAccommodation, Room as DatabaseRoom } from './database';
import { Accommodation as ClientAccommodation, Room as ClientRoom } from './accommodation';

export type UnifiedRoom = ClientRoom | DatabaseRoom;

export type UnifiedAccommodation = Omit<DatabaseAccommodation, 'rooms'> & 
  Partial<Omit<ClientAccommodation, 'rooms'>> & {
    // Ensure required fields are present
    price_per_night: number;
    price?: number;
    rooms?: UnifiedRoom[];
    amenities: string[];
    images: string[];
    description: string;
  };

export function toUnifiedAccommodation(acc: DatabaseAccommodation | ClientAccommodation): UnifiedAccommodation {
  // Helper function to ensure array type
  const ensureArray = <T>(value: unknown): T[] => 
    Array.isArray(value) ? value as T[] : [];
  
  // Common properties
  const commonProps = {
    amenities: ensureArray<string>(acc.amenities),
    images: ensureArray<string>(acc.images),
    description: acc.description || '',
    rooms: ensureArray<UnifiedRoom>(acc.rooms),
    price_per_night: 0, // Will be overridden
    price: 0, // Will be overridden
  };

  // Handle DatabaseAccommodation
  if ('price_per_night' in acc) {
    const dbAcc = acc as DatabaseAccommodation;
    return {
      ...dbAcc,
      ...commonProps,
      price_per_night: dbAcc.price_per_night || 0,
      price: dbAcc.price || dbAcc.price_per_night || 0,
      created_by: dbAcc.created_by || null,
      min_nights: dbAcc.min_nights || 1, // Ensure min_nights is a number
    } as unknown as UnifiedAccommodation;
  }
  
  // Handle ClientAccommodation
  const clientAcc = acc as ClientAccommodation;
  return {
    ...clientAcc,
    ...commonProps,
    price_per_night: clientAcc.price_per_night || 0,
    price: clientAcc.price_per_night, // For backward compatibility
    created_by: clientAcc.created_by || null,
    min_nights: clientAcc.min_nights || 1, // Ensure min_nights is a number
  } as unknown as UnifiedAccommodation;
}
