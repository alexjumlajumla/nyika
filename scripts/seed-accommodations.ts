import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample accommodations data
const sampleAccommodations = [
  {
    name: 'Serengeti Serena Safari Lodge',
    slug: 'serengeti-serena-safari-lodge',
    description: 'Overlooking the world-famous Serengeti National Park, this lodge offers luxury accommodation with breathtaking views of the endless plains and abundant wildlife.',
    location: 'Serengeti National Park, Tanzania',
    address: 'Serengeti National Park, Tanzania',
    city: 'Serengeti',
    country: 'Tanzania',
    latitude: -2.1540,
    longitude: 34.6857,
    type: 'lodge' as const,
    price_per_night: 450,
    rating: 4.8,
    review_count: 128,
    is_featured: true,
    amenities: ['WiFi', 'Restaurant', 'Pool', 'Spa', 'Bar', 'Air Conditioning', 'Laundry Service', 'Airport Shuttle'],
    images: [
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    featured_image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    check_in_time: '14:00',
    check_out_time: '11:00',
    max_guests: 4,
    min_nights: 2,
    cancellation_policy: 'Free cancellation up to 30 days before check-in',
    tags: ['luxury', 'safari', 'family-friendly', 'honeymoon'],
    contact_email: 'reservations@serenaserengeti.com',
    contact_phone: '+255 123 456 789',
    website: 'https://www.serenahotels.com/serengeti',
    social_links: {
      facebook: 'https://facebook.com/serenahotels',
      instagram: 'https://instagram.com/serenahotels',
      twitter: 'https://twitter.com/serenahotels'
    },
    policies: {
      check_in: 'From 14:00',
      check_out: 'Until 11:00',
      pets: 'Not allowed',
      parties_events: 'Not allowed',
      smoking: 'Designated areas only'
    }
  },
  {
    name: 'Mara Intrepids Camp',
    slug: 'mara-intrepids-camp',
    description: 'Set on the banks of the Talek River in the heart of the Masai Mara, this luxury tented camp offers an authentic safari experience with modern comforts.',
    location: 'Masai Mara, Kenya',
    address: 'Talek River, Masai Mara National Reserve, Kenya',
    city: 'Masai Mara',
    country: 'Kenya',
    latitude: -1.4064,
    longitude: 35.1195,
    type: 'camp' as const,
    price_per_night: 380,
    rating: 4.7,
    review_count: 95,
    is_featured: true,
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Laundry Service', 'Guided Game Drives', 'Bush Dinners'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    featured_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    check_in_time: '12:00',
    check_out_time: '10:00',
    max_guests: 2,
    min_nights: 3,
    cancellation_policy: 'Free cancellation up to 14 days before check-in',
    tags: ['luxury', 'safari', 'romantic', 'adventure'],
    contact_email: 'bookings@maraintrepids.com',
    contact_phone: '+254 123 456 789',
    website: 'https://www.heritage-eastafrica.com/mara-intrepids-camp',
    social_links: {
      facebook: 'https://facebook.com/heritageeastafrica',
      instagram: 'https://instagram.com/heritageeastafrica',
      twitter: 'https://twitter.com/heritageeastafrica'
    },
    policies: {
      check_in: 'From 12:00',
      check_out: 'Until 10:00',
      pets: 'Not allowed',
      parties_events: 'Not allowed',
      smoking: 'Not allowed'
    }
  },
  {
    name: 'Zanzibar Beach Resort',
    slug: 'zanzibar-beach-resort',
    description: 'A stunning beachfront property on the white sands of Nungwi Beach, offering luxurious rooms, world-class dining, and a wide range of water activities.',
    location: 'Nungwi, Zanzibar',
    address: 'Nungwi Beach, Zanzibar, Tanzania',
    city: 'Nungwi',
    country: 'Tanzania',
    latitude: -5.7265,
    longitude: 39.2930,
    type: 'resort' as const,
    price_per_night: 520,
    rating: 4.9,
    review_count: 156,
    is_featured: true,
    amenities: ['WiFi', 'Restaurant', 'Pool', 'Spa', 'Gym', 'Bar', 'Beach Access', 'Water Sports', 'Diving Center', 'Kids Club'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    featured_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    check_in_time: '15:00',
    check_out_time: '12:00',
    max_guests: 6,
    min_nights: 2,
    cancellation_policy: 'Free cancellation up to 7 days before check-in',
    tags: ['luxury', 'beach', 'family-friendly', 'honeymoon', 'all-inclusive'],
    contact_email: 'reservations@zanzibarresort.com',
    contact_phone: '+255 123 456 789',
    website: 'https://www.zanzibarresort.com',
    social_links: {
      facebook: 'https://facebook.com/zanzibarresort',
      instagram: 'https://instagram.com/zanzibarresort',
      twitter: 'https://twitter.com/zanzibarresort'
    },
    policies: {
      check_in: 'From 15:00',
      check_out: 'Until 12:00',
      pets: 'Not allowed',
      parties_events: 'Allowed with prior notice',
      smoking: 'Designated areas only'
    }
  }
];

async function seedAccommodations() {
  console.log('Starting to seed accommodations...');

  try {
    // Check the current accommodation_type enum values
    const { data: enumData, error: enumError } = await supabase
      .rpc('get_enum_values', { enum_name: 'accommodation_type' });

    if (enumError) {
      console.error('Error fetching enum values:', enumError);
      // Fallback to a direct query if the RPC function doesn't exist
      const { data: sampleData } = await supabase
        .from('accommodations')
        .select('type')
        .limit(1);
      
      console.log('Sample accommodation type:', sampleData?.[0]?.type);
    } else {
      console.log('Accommodation types:', enumData);
    }

    // First, check if accommodations already exist
    const { data: existingAccommodations, error: fetchError } = await supabase
      .from('accommodations')
      .select('*')
      .limit(1);

    if (fetchError) {
      throw fetchError;
    }

    if (existingAccommodations && existingAccommodations.length > 0) {
      console.log('Accommodations already exist in the database. Skipping seed.');
      return;
    }

    // Transform sample data to match the database schema
    const transformedAccommodations = sampleAccommodations.map(acc => {
      const accommodation = {
        // Basic info
        name: acc.name,
        slug: acc.slug,
        description: acc.description,
        type: acc.type,
        
        // Location
        location: acc.location,
        address: acc.address,
        city: acc.city,
        country: acc.country,
        latitude: acc.latitude,
        longitude: acc.longitude,
        
        // Pricing and ratings - handle both price and price_per_night
        price_per_night: acc.price ?? acc.price_per_night,
        rating: acc.rating,
        review_count: acc.review_count,
        is_featured: acc.is_featured,
        
        // Media
        amenities: acc.amenities,
        images: acc.images,
        featured_image: acc.featured_image,
        
        // Booking details
        check_in_time: acc.check_in_time,
        check_out_time: acc.check_out_time,
        max_guests: acc.max_guests,
        min_nights: acc.min_nights,
        
        // Additional info
        cancellation_policy: acc.cancellation_policy,
        tags: acc.tags,
        contact_email: acc.contact_email,
        contact_phone: acc.contact_phone,
        website: acc.website,
        social_links: acc.social_links,
        policies: acc.policies,
        
        // System fields
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        is_verified: true
      };

      // Clean up any potential price property
      if ('price' in accommodation) {
        delete (accommodation as any).price;
      }

      return accommodation;
    });

    console.log('Inserting accommodations:', JSON.stringify(transformedAccommodations, null, 2));
    
    // Insert sample accommodations
    const { data, error } = await supabase
      .from('accommodations')
      .insert(transformedAccommodations)
      .select();

    if (error) {
      throw error;
    }

    console.log('Successfully seeded accommodations:', data);
  } catch (error) {
    console.error('Error seeding accommodations:', error);
  } finally {
    // Close the Supabase connection
    // Close the Supabase client if needed
    if (supabase && typeof supabase.removeAllChannels === 'function') {
      supabase.removeAllChannels();
    }
  }
}

// Run the seed function
seedAccommodations()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
