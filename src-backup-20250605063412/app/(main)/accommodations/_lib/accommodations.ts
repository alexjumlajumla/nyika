export type Accommodation = {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: number; // Base price per night (in USD)
  pricePerNight: number; // Alias for price, for consistency
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  description: string;
  type: 'Lodge' | 'Camp' | 'Hotel' | 'Resort';
  isFeatured?: boolean;
};

export async function getAccommodations(): Promise<Accommodation[]> {
  // Simulate API call with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
    {
      id: '1',
      name: 'Serengeti Safari Lodge',
      slug: 'serengeti-safari-lodge',
      location: 'Serengeti National Park, Tanzania',
      price: 450,
      pricePerNight: 450,
      rating: 4.8,
      reviewCount: 127,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Spa', 'Airport Shuttle'],
      description: 'Experience luxury in the heart of the Serengeti with breathtaking views of the savannah. Our lodge offers spacious rooms, gourmet dining, and guided safari tours.',
      type: 'Lodge',
      isFeatured: true
    },
    {
      id: '2',
      name: 'Masai Mara Tented Camp',
      slug: 'masai-mara-tented-camp',
      location: 'Masai Mara National Reserve, Kenya',
      price: 380,
      pricePerNight: 380,
      rating: 4.9,
      reviewCount: 214,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Restaurant', 'Bar', 'Game Drives', 'Bush Dinners'],
      description: 'Immerse yourself in the wild with our luxury tented camp. Wake up to the sounds of nature and enjoy up-close wildlife encounters right from your tent.',
      type: 'Camp',
      isFeatured: true
    },
    {
      id: '3',
      name: 'Victoria Falls Safari Resort',
      slug: 'victoria-falls-safari-resort',
      location: 'Victoria Falls, Zimbabwe',
      price: 520,
      pricePerNight: 520,
      rating: 4.7,
      reviewCount: 189,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Free WiFi'],
      description: 'Luxurious resort with stunning views of Victoria Falls. Enjoy world-class amenities, fine dining, and exciting activities in one of Africa\'s most iconic locations.',
      type: 'Resort'
    },
    {
      id: '4',
      name: 'Ngorongoro Crater Lodge',
      slug: 'ngorongoro-crater-lodge',
      location: 'Ngorongoro Conservation Area, Tanzania',
      price: 680,
      pricePerNight: 680,
      rating: 4.9,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Luxury Tents', 'Gourmet Dining', 'Game Drives', 'Spa', 'Private Decks'],
      description: 'Perched on the rim of the Ngorongoro Crater, this luxury lodge offers unparalleled views and exclusive access to one of Africa\'s most famous wildlife viewing areas.',
      type: 'Lodge',
      isFeatured: true
    },
    {
      id: '5',
      name: 'Amboseli Serena Lodge',
      slug: 'amboseli-serena-lodge',
      location: 'Amboseli National Park, Kenya',
      price: 390,
      pricePerNight: 390,
      rating: 4.6,
      reviewCount: 203,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      amenities: ['Restaurant', 'Bar', 'Swimming Pool', 'Spa', 'Free WiFi'],
      description: 'Nestled in the foothills of Mount Kilimanjaro, this lodge offers spectacular views and comfortable accommodations in one of Kenya\'s most scenic national parks.',
      type: 'Lodge'
    }
      ]);
    }, 300); // 300ms delay to simulate network request
  });
}

export async function getAccommodationBySlug(slug: string): Promise<Accommodation | null> {
  try {
    const accommodations = await getAccommodations();
    return accommodations.find(acc => acc.slug === slug) || null;
  } catch (error) {
    console.error('Error finding accommodation by slug:', error);
    return null;
  }
}
