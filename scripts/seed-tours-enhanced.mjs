import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configure dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase URL or key in environment variables');
  console.log('Please make sure you have the following environment variables set:');
  console.log('1. NEXT_PUBLIC_SUPABASE_URL');
  console.log('2. SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample tour categories
const sampleCategories = [
  {
    name: 'Safari Tours',
    slug: 'safari-tours',
    description: 'Experience the best wildlife adventures in Africa',
    icon: 'safari',
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1523805009345-7441085e9dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
  },
  {
    name: 'Beach Holidays',
    slug: 'beach-holidays',
    description: 'Relax on the most beautiful beaches of Africa',
    icon: 'beach',
    is_featured: true,
    featured_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
  }
];

// Sample destinations
const sampleDestinations = [
  {
    name: 'Serengeti National Park',
    slug: 'serengeti-national-park',
    description: 'Famous for the annual migration of wildebeest and zebra',
    featured_image: 'https://images.unsplash.com/photo-1523805009345-7441085e9dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    location: { lat: -2.3333, lng: 34.8333 },
    is_featured: true
  },
  {
    name: 'Zanzibar',
    slug: 'zanzibar',
    description: 'Beautiful island with pristine beaches and rich history',
    featured_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    location: { lat: -6.1659, lng: 39.2026 },
    is_featured: true
  }
];

// Sample tours
const sampleTours = [
  {
    title: 'Serengeti Great Migration Safari',
    slug: 'serengeti-great-migration-safari',
    description: 'Witness the spectacular Great Migration in the Serengeti, where millions of wildebeest and zebras cross the plains in search of fresh grazing.',
    duration_days: 7,
    duration_nights: 6,
    price: 3500,
    discount_price: 3150,
    group_size: 12,
    difficulty: 'moderate',
    featured: true,
    status: 'published',
    start_location: 'Arusha, Tanzania',
    end_location: 'Arusha, Tanzania',
    featured_image: 'https://images.unsplash.com/photo-1523805009345-7441085e9dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1523805009345-7441085e9dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ],
    includes: {
      items: [
        'All park fees and conservation fees',
        'Full-board accommodation',
        'Professional English-speaking guide',
        '4x4 safari vehicle with pop-up roof',
        'All game drives as per itinerary',
        'Drinking water in the vehicle',
        'Airport transfers'
      ]
    },
    excludes: {
      items: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Tips and gratuities',
        'Personal expenses'
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Arusha',
        description: 'Arrive at Kilimanjaro International Airport and transfer to your lodge.'
      },
      {
        day: 2,
        title: 'Tarangire National Park',
        description: 'Game drive in Tarangire, known for its large elephant herds and baobab trees.'
      }
    ],
    highlights: ['Kilimanjaro views', 'Cultural experiences', 'Wildlife viewing', 'Comfortable lodges', 'Small group experience'],
    meta_title: 'Serengeti Great Migration Safari | 7-Day Tanzania Safari',
    meta_description: 'Experience the Great Migration in Serengeti National Park. 7-day luxury safari with expert guides, luxury accommodations, and unforgettable wildlife encounters.'
  },
  {
    title: 'Zanzibar Beach Escape',
    slug: 'zanzibar-beach-escape',
    description: 'Relax on the pristine beaches of Zanzibar and explore the historic Stone Town.',
    duration_days: 5,
    duration_nights: 4,
    price: 1500,
    discount_price: 1350,
    group_size: 15,
    difficulty: 'easy',
    featured: true,
    status: 'published',
    start_location: 'Zanzibar Airport',
    end_location: 'Zanzibar Airport',
    featured_image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1471922694854-ff1b63b22fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ],
    includes: {
      items: [
        'All accommodations',
        'Meals as per itinerary',
        'Professional guide',
        'All activities mentioned',
        'Park fees',
        'Transport in 4x4 vehicle'
      ]
    },
    excludes: {
      items: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Meals not specified',
        'Personal expenses'
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Zanzibar',
        description: 'Transfer to your beach resort and enjoy the rest of the day at leisure.'
      },
      {
        day: 2,
        title: 'Spice Tour',
        description: 'Explore the spice plantations and learn about Zanzibar\'s spice trade history.'
      }
    ],
    highlights: ['Pristine beaches', 'Historic Stone Town', 'Spice tour', 'Relaxation time', 'Crystal clear waters'],
    meta_title: 'Zanzibar Beach Escape | 5-Day Tropical Getaway',
    meta_description: 'Relax on the beautiful beaches of Zanzibar. 5-day tropical getaway including spice tours, Stone Town exploration, and beachfront accommodation.'
  }
];

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // 1. Seed Categories
    console.log('🌱 Seeding categories...');
    const { data: categories, error: categoryError } = await supabase
      .from('tour_categories')
      .upsert(sampleCategories, { onConflict: 'slug' })
      .select('id, name, slug');
    
    if (categoryError) throw categoryError;
    console.log(`✅ Seeded ${categories.length} categories`);
    
    // 2. Seed Destinations
    console.log('🌍 Seeding destinations...');
    const { data: destinations, error: destinationError } = await supabase
      .from('destinations')
      .upsert(sampleDestinations, { onConflict: 'slug' })
      .select('id, name, slug');
    
    if (destinationError) throw destinationError;
    console.log(`✅ Seeded ${destinations.length} destinations`);
    
    // 3. Seed Tours
    console.log('🦁 Seeding tours...');
    const toursWithRelations = sampleTours.map(tour => {
      const category = categories.find(c => c.name === (tour.title.includes('Safari') ? 'Safari Tours' : 'Beach Holidays'));
      const destination = destinations.find(d => 
        tour.title.includes('Serengeti') ? d.name.includes('Serengeti') : d.name === 'Zanzibar'
      );
      
      const formattedTourData = {
        ...tour,
        highlights: tour.highlights,
        images: tour.images,
        category_id: category?.id || null,
        destination_id: destination?.id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return formattedTourData;
    });
    
    const { data: seededTours, error: tourError } = await supabase
      .from('tours')
      .upsert(toursWithRelations, { onConflict: 'slug' })
      .select('id, title, slug');
    
    if (tourError) throw tourError;
    console.log(`✅ Seeded ${seededTours.length} tours`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSeeded Data Summary:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Destinations: ${destinations.length}`);
    console.log(`- Tours: ${seededTours.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
