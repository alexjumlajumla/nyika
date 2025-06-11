import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or service role key');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to generate random number in range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate mock tour categories
const generateCategories = () => {
  return [
    {
      name: 'Safari Tours',
      slug: 'safari-tours',
      description: 'Experience the best wildlife safaris in Africa',
      icon: 'safari',
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Beach Holidays',
      slug: 'beach-holidays',
      description: 'Relax on the most beautiful beaches of Africa',
      icon: 'beach',
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Mountain Trekking',
      slug: 'mountain-trekking',
      description: 'Challenge yourself with amazing mountain treks',
      icon: 'mountain',
      is_active: true,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Cultural Experiences',
      slug: 'cultural-experiences',
      description: 'Immerse yourself in rich African cultures',
      icon: 'culture',
      is_active: true,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

// Generate mock destinations
const generateDestinations = () => {
  return [
    {
      name: 'Serengeti National Park',
      slug: 'serengeti-national-park',
      description: 'Famous for its annual migration of over 1.5 million wildebeest and 250,000 zebras',
      country: 'Tanzania',
      region: 'Northern Tanzania',
      latitude: -2.3333,
      longitude: 34.8333,
      is_active: true,
      featured_image: 'https://source.unsplash.com/random/800x600/?serengeti',
      gallery: [
        'https://source.unsplash.com/random/800x600/?serengeti-1',
        'https://source.unsplash.com/random/800x600/?serengeti-2',
        'https://source.unsplash.com/random/800x600/?serengeti-3'
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Ngorongoro Crater',
      slug: 'ngorongoro-crater',
      description: 'The world\'s largest inactive, intact, and unfilled volcanic caldera',
      country: 'Tanzania',
      region: 'Northern Tanzania',
      latitude: -3.1667,
      longitude: 35.5833,
      is_active: true,
      featured_image: 'https://source.unsplash.com/random/800x600/?ngorongoro',
      gallery: [
        'https://source.unsplash.com/random/800x600/?ngorongoro-1',
        'https://source.unsplash.com/random/800x600/?ngorongoro-2'
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Zanzibar',
      slug: 'zanzibar',
      description: 'An archipelago known for its beautiful beaches, clear waters, and rich history',
      country: 'Tanzania',
      region: 'Zanzibar',
      latitude: -6.1357,
      longitude: 39.355,
      is_active: true,
      featured_image: 'https://source.unsplash.com/random/800x600/?zanzibar',
      gallery: [
        'https://source.unsplash.com/random/800x600/?zanzibar-1',
        'https://source.unsplash.com/random/800x600/?zanzibar-2',
        'https://source.unsplash.com/random/800x600/?zanzibar-3',
        'https://source.unsplash.com/random/800x600/?zanzibar-4'
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Mount Kilimanjaro',
      slug: 'mount-kilimanjaro',
      description: 'Africa\'s highest peak and the world\'s tallest free-standing mountain',
      country: 'Tanzania',
      region: 'Northern Tanzania',
      latitude: -3.0674,
      longitude: 37.3556,
      is_active: true,
      featured_image: 'https://source.unsplash.com/random/800x600/?kilimanjaro',
      gallery: [
        'https://source.unsplash.com/random/800x600/?kilimanjaro-1',
        'https://source.unsplash.com/random/800x600/?kilimanjaro-2',
        'https://source.unsplash.com/random/800x600/?kilimanjaro-3'
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

// Generate mock tours
const generateTours = (categoryIds: string[], destinationIds: string[]) => {
  const tours = [];
  
  // Generate 10 sample tours
  for (let i = 0; i < 10; i++) {
    const days = randomInRange(3, 14);
    const title = `${faker.word.adjective()} ${faker.word.noun()} ${faker.word.noun()}`.replace(/\b\w/g, l => l.toUpperCase());
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Generate gallery images (array of text)
    const gallery = Array(5).fill(0).map((_, i) => 
      `https://source.unsplash.com/random/800x600/?safari,${slug}-${i}`
    );
    
    // Generate highlights as a single text with bullet points
    const highlights = Array(5).fill(0).map(() => 
      `• ${faker.lorem.sentence()}`
    ).join('\n');
    
    const difficultyLevels = ['easy', 'moderate', 'challenging', 'difficult'];
    const groupSizeMin = randomInRange(2, 6);
    const groupSizeMax = groupSizeMin + randomInRange(2, 6);
    
    // Generate itinerary as JSONB
    const itinerary = Array(days).fill(0).map((_, day) => ({
      day: day + 1,
      title: `Day ${day + 1}: ${faker.lorem.words(3)}`,
      description: faker.lorem.paragraphs(2, '\n\n'),
      meals: {
        breakfast: Math.random() > 0.3,
        lunch: Math.random() > 0.2,
        dinner: Math.random() > 0.3
      },
      accommodation: faker.lorem.words(2) + ' ' + faker.helpers.arrayElement(['Lodge', 'Camp', 'Hotel', 'Tented Camp']),
      activities: Array(randomInRange(1, 3)).fill(0).map(() => faker.lorem.words(3)),
    }));
    
    tours.push({
      name: title,
      slug,
      short_description: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(3, '\n\n'),
      duration_days: days,
      duration_nights: days - 1,
      price_start_from: randomInRange(1000, 10000),
      featured_image: `https://source.unsplash.com/random/800x600/?safari,${slug}`,
      gallery,
      is_featured: Math.random() > 0.7, // 30% chance of being featured
      is_active: true,
      category_id: categoryIds[Math.floor(Math.random() * categoryIds.length)],
      destination_id: destinationIds[Math.floor(Math.random() * destinationIds.length)],
      meta_title: `${title} | Nyika Safaris`,
      meta_description: faker.lorem.sentence(),
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
      review_count: randomInRange(5, 100),
      
      // New fields
      difficulty_level: faker.helpers.arrayElement(difficultyLevels),
      group_size_min: groupSizeMin,
      group_size_max: groupSizeMax,
      start_location: faker.address.city() + ', Tanzania',
      end_location: faker.address.city() + ', Tanzania',
      price_includes: {
        items: [
          'All accommodations as per itinerary',
          'All meals as specified',
          'Professional English-speaking guide',
          'All park fees and government taxes',
          'Game drives as per the itinerary'
        ]
      },
      price_excludes: {
        items: [
          'International flights',
          'Visa fees',
          'Travel insurance',
          'Tips and gratuities',
          'Personal expenses'
        ]
      },
      highlights,
      itinerary,
      seo_keywords: [
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word(),
        faker.lorem.word()
      ],
      status: Math.random() > 0.2 ? 'published' : 'draft', // 80% chance of being published
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
    });
  }
  
  return tours;
};

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    // 1. Seed categories
    console.log('🌱 Seeding categories...');
    const categories = generateCategories();
    const insertedCategories = [];
    
    // Insert or update categories
    for (const category of categories) {
      const { data: existing, error: fetchError } = await supabase
        .from('tour_categories')
        .select('id, slug')
        .eq('slug', category.slug)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking for existing category:', fetchError);
        continue;
      }
      
      if (existing) {
        // Update existing category
        const { data: updated, error: updateError } = await supabase
          .from('tour_categories')
          .update(category)
          .eq('id', existing.id)
          .select('id, slug')
          .single();
        
        if (updateError) {
          console.error(`Error updating category ${category.slug}:`, updateError);
          continue;
        }
        
        insertedCategories.push(updated);
        console.log(`   ✅ Updated category: ${category.name}`);
      } else {
        // Insert new category
        const { data: inserted, error: insertError } = await supabase
          .from('tour_categories')
          .insert(category)
          .select('id, slug')
          .single();
        
        if (insertError) {
          console.error(`Error inserting category ${category.slug}:`, insertError);
          continue;
        }
        
        insertedCategories.push(inserted);
        console.log(`   ✅ Added category: ${category.name}`);
      }
    }
    
    console.log(`✅ Processed ${insertedCategories.length} categories`);
    
    // 2. Seed destinations
    console.log('🗺️ Seeding destinations...');
    const destinations = generateDestinations();
    const insertedDestinations = [];
    
    // Insert or update destinations
    for (const destination of destinations) {
      const { data: existing, error: fetchError } = await supabase
        .from('destinations')
        .select('id, slug')
        .eq('slug', destination.slug)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking for existing destination:', fetchError);
        continue;
      }
      
      if (existing) {
        // Update existing destination
        const { data: updated, error: updateError } = await supabase
          .from('destinations')
          .update(destination)
          .eq('id', existing.id)
          .select('id, slug')
          .single();
        
        if (updateError) {
          console.error(`Error updating destination ${destination.slug}:`, updateError);
          continue;
        }
        
        insertedDestinations.push(updated);
        console.log(`   ✅ Updated destination: ${destination.name}`);
      } else {
        // Insert new destination
        const { data: inserted, error: insertError } = await supabase
          .from('destinations')
          .insert(destination)
          .select('id, slug')
          .single();
        
        if (insertError) {
          console.error(`Error inserting destination ${destination.slug}:`, insertError);
          continue;
        }
        
        insertedDestinations.push(inserted);
        console.log(`   ✅ Added destination: ${destination.name}`);
      }
    }
    
    console.log(`✅ Processed ${insertedDestinations.length} destinations`);
    
    // 3. Get all categories and destinations for tour generation
    const { data: allCategories } = await supabase
      .from('tour_categories')
      .select('id, slug');
      
    const { data: allDestinations } = await supabase
      .from('destinations')
      .select('id, slug');
    
    if (!allCategories?.length || !allDestinations?.length) {
      throw new Error('No categories or destinations found');
    }
    
    const categoryIds = allCategories.map(c => c.id);
    const destinationIds = allDestinations.map(d => d.id);
    
    // 4. Seed tours
    console.log('🦁 Seeding tours...');
    const tours = generateTours(categoryIds, destinationIds);
    let successfulTours = 0;
    
    // Insert or update tours
    for (const tour of tours) {
      const { data: existing, error: fetchError } = await supabase
        .from('tours')
        .select('id')
        .eq('slug', tour.slug)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error checking for existing tour ${tour.slug}:`, fetchError);
        continue;
      }
      
      if (existing) {
        // Update existing tour
        const { error: updateError } = await supabase
          .from('tours')
          .update(tour)
          .eq('id', existing.id);
        
        if (updateError) {
          console.error(`Error updating tour ${tour.slug}:`, updateError);
          continue;
        }
        
        console.log(`   ✅ Updated tour: ${tour.name}`);
      } else {
        // Insert new tour
        const { error: insertError } = await supabase
          .from('tours')
          .insert(tour);
        
        if (insertError) {
          console.error(`Error inserting tour ${tour.slug}:`, insertError);
          continue;
        }
        
        console.log(`   ✅ Added tour: ${tour.name}`);
      }
      
      successfulTours++;
    }
    
    console.log(`✅ Successfully processed ${successfulTours} tours`);
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
