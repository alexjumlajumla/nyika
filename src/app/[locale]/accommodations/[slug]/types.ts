// Define RoomType locally since we don't have the types/room module
export type RoomType = {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  max_occupancy: number;
  amenities: string[];
};

// This type is used by the AccommodationClient component
export type AccommodationWithRooms = {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  rating?: number;
  review_count?: number;
  location: string;
  images: string[];
  amenities: string[];
  rooms?: RoomType[];
};
