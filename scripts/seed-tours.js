const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample tour data
const sampleTours = [
  {
    title: 'Serengeti Great Migration Safari',
    slug: 'serengeti-great-migration-safari',
    description: 'Witness the spectacular Great Migration in the Serengeti, where millions of wildebeest and zebras cross the plains in search of fresh grazing.',
    duration: 7,
    price: 3500,
    discount: 10,
    maxGroupSize: 12,
    difficulty: 'Moderate',
    ratingsAverage: 4.8,
    ratingsQuantity: 124,
    startLocation: 'Arusha, Tanzania',
    locations: [
      'Serengeti National Park',
      'Ngorongoro Conservation Area',
      'Tarangire National Park'
    ],
    startDates: [
      '2025-07-15',
      '2025-08-20',
      '2025-09-10',
      '2025-10-05'
    ],
    coverImage: 'https://images.unsplash.com/photo-1523805009345-7441085e9dfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80',
    images: [
      'https://images.unsplash.com/photo-1523805009345-7441085e9dfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
      'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'
    ],
    included: [
      'All park fees and conservation levies',
      'Professional English-speaking guide',
      'All accommodation as specified',
      'All meals as specified',
      'All game drives and activities as specified',
      'Drinking water throughout the safari'
    ],
    excluded: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Tips and gratuities',
      'Personal expenses',
      'Optional activities'
    ],
    isFeatured: true,
    overview: 'This 7-day safari takes you to the heart of the Serengeti to witness the Great Migration, one of the most spectacular wildlife events on the planet. You\'ll also explore the Ngorongoro Crater and Tarangire National Park, home to large elephant herds and ancient baobab trees.',
    highlights: [
      'Witness the Great Migration in the Serengeti',
      'Game drives in the Ngorongoro Crater',
      'See the Big Five',
      'Stay in luxury tented camps',
      'Professional photography guidance'
    ],
    categories: ['Wildlife', 'Adventure', 'Photography'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Arusha',
        description: 'Arrive at Kilimanjaro International Airport and transfer to your lodge in Arusha for relaxation and briefing.'
      },
      {
        day: 2,
        title: 'Tarangire National Park',
        description: 'Morning game drive in Tarangire, famous for its large elephant herds and baobab trees.'
      },
      // Add more days as needed
    ]
  },
  // Add more sample tours as needed
];

async function seedTours() {
  try {
    console.log('Starting to seed tours...');
    
    // First, clear existing tours
    const { error: deleteError } = await supabase
      .from('tours')
      .delete()
      .neq('id', 0); // Delete all tours
    
    if (deleteError) {
      console.error('Error clearing existing tours:', deleteError);
      return;
    }
    
    console.log('Cleared existing tours');
    
    // Insert new tours
    const { data: insertedTours, error: insertError } = await supabase
      .from('tours')
      .insert(sampleTours)
      .select();
    
    if (insertError) {
      console.error('Error inserting tours:', insertError);
      return;
    }
    
    console.log(`Successfully seeded ${insertedTours?.length || 0} tours`);
    console.log('Tour seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding tours:', error);
  }
}

// Run the seed function
seedTours();
