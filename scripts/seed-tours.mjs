import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
// We'll use a basic type for our tour data since we can't import the Database type directly

/** @type {import('@supabase/supabase-js').SupabaseClient} */
let supabase;

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key in environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not Set');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set');
  process.exit(1);
}

// Initialize the Supabase client with the proper type
supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to create a tour object that matches our database schema
// Function to create a tour with only the fields that exist in the database
function createTour(tourData) {
  // Start with the minimal required fields
  const tour = {
    id: tourData.id || uuidv4(),
    title: tourData.title,
    slug: tourData.slug || tourData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^\-|\-$)/g, ''),
    description: tourData.description,
    duration_days: tourData.duration_days || tourData.duration || 1,
    min_people: tourData.min_people || 1,
    is_featured: !!tourData.is_featured,
    is_active: tourData.is_active !== undefined ? tourData.is_active : true,
    created_at: tourData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add optional fields if they exist in the input
  const optionalFields = [
    'overview',
    'highlights',
    'included',
    'max_people',
    'duration_nights'
  ];

  optionalFields.forEach(field => {
    if (tourData[field] !== undefined) {
      if (Array.isArray(tourData[field])) {
        tour[field] = [...tourData[field]]; // Create a copy of the array
      } else if (typeof tourData[field] === 'object' && tourData[field] !== null) {
        tour[field] = { ...tourData[field] }; // Create a shallow copy of the object
      } else {
        tour[field] = tourData[field];
      }
    }
  });
  
  return tour;
};

// Sample tour data
const sampleTours = [
  createTour({
    title: 'Serengeti Great Migration Safari',
    slug: 'serengeti-great-migration-safari',
    description: 'Witness the spectacular Great Migration in the Serengeti, where millions of wildebeest and zebras cross the plains in search of fresh grazing.',
    duration_days: 7,
    max_people: 12,
    difficulty_level: 'Moderate',
    overview: {
      summary: 'Experience the greatest wildlife spectacle on earth with our 7-day safari package.',
      highlights: [
        'Witness the Great Migration',
        'Game drives in Serengeti and Ngorongoro',
        'Luxury tented accommodation',
        'Expert guides'
      ]
    },
    highlights: [
      'Great Migration viewing',
      'Big Five game viewing',
      'Hot air balloon safari option',
      'Cultural visits to Maasai villages'
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
    ]
  }),
  createTour({
    title: 'Mount Kilimanjaro Climb - Machame Route',
    slug: 'kilimanjaro-climb-machame',
    description: 'Conquer the Roof of Africa on this 8-day trek via the scenic Machame Route, known for its breathtaking views and high success rate.',
    duration_days: 8,
    max_people: 10,
    difficulty_level: 'Challenging',
    overview: {
      summary: 'Reach the summit of Mount Kilimanjaro via the beautiful Machame Route with experienced guides and porters.',
      highlights: [
        'Climb Africa\'s highest peak',
        'Scenic Machame Route',
        'Professional mountain guides',
        'All necessary equipment included'
      ]
    },
    highlights: [
      'Summit Uhuru Peak (5,895m)',
      'Diverse ecological zones',
      'Small group experience',
      'Certificate of achievement'
    ],
    included: [
      'All park fees and taxes',
      'Professional mountain guides and porters',
      'All meals during the climb',
      'Quality camping equipment',
      'Oxygen cylinders and first aid kit',
      'Airport transfers'
    ],
    excluded: [
      'International flights',
      'Tanzania visa',
      'Travel insurance',
      'Tips for guides and porters',
      'Personal trekking gear'
    ]
  })
];

async function getTableSchema(tableName) {
  try {
    // Try to get the table structure using a direct SQL query
    const { data, error } = await supabase.rpc('get_table_columns', { 
      table_name: tableName 
    });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching table schema:', error);
    
    // If the function doesn't exist, create it
    if (error.message.includes('function get_table_columns(unknown) does not exist')) {
      console.log('Creating helper function to get table columns...');
      const { error: createFnError } = await supabase.rpc('create_get_columns_function');
      
      if (!createFnError) {
        // Try again after creating the function
        const { data, error: retryError } = await supabase.rpc('get_table_columns', { 
          table_name: tableName 
        });
        
        if (!retryError) return data || [];
      }
    }
    
    // Fallback to an empty array if we can't get the schema
    return [];
  }
}

// Create a function to get table columns
async function createGetColumnsFunction() {
  const { error } = await supabase.rpc(`
    create or replace function get_table_columns(table_name text)
    returns table (column_name text, data_type text, is_nullable text) as $$
    begin
      return query execute format(
        'select column_name, data_type, is_nullable ' ||
        'from information_schema.columns ' ||
        'where table_name = %L',
        table_name
      );
    end;
    $$ language plpgsql;
  `);
  
  if (error) {
    console.error('Error creating get_table_columns function:', error);
    return false;
  }
  return true;
}

async function seedTours() {
  try {
    console.log('Starting to seed tours...');
    
    // First, create the helper function if it doesn't exist
    console.log('Ensuring helper function exists...');
    await createGetColumnsFunction();
    
    // Then, check the table schema
    console.log('Fetching tours table schema...');
    const schema = await getTableSchema('tours');
    
    if (schema && schema.length > 0) {
      console.log('Tours table columns:', schema.map(col => `${col.column_name} (${col.data_type}${col.is_nullable === 'YES' ? ', nullable' : ''})`).join('\n'));
    } else {
      console.log('Could not fetch table schema. The table might not exist or we might not have permission.');
    }
    
    // Log the first tour to see what we're trying to insert
    console.log('Sample tour data:', JSON.stringify(sampleTours[0], null, 2));
    
    // First, try to delete any existing tours
    console.log('Deleting existing tours...');
    try {
      const { error: deleteError } = await supabase
        .from('tours')
        .delete()
        .not('id', 'is', null); // Delete all records
      
      if (deleteError) {
        console.warn('Warning: Could not delete existing tours:', deleteError.message);
        console.log('This might be expected if the table is empty or we don\'t have delete permissions');
      }
    } catch (deleteError) {
      console.warn('Warning: Error when trying to delete tours:', deleteError.message);
      console.log('Continuing with insert...');
    }

    console.log(`Inserting ${sampleTours.length} tours...`);
    // Insert the sample tours in batches to avoid hitting limits
    const batchSize = 5;
    for (let i = 0; i < sampleTours.length; i += batchSize) {
      const batch = sampleTours.slice(i, i + batchSize);
      console.log(`Inserting batch ${i / batchSize + 1}...`);
      const { data, error: insertError } = await supabase
        .from('tours')
        .insert(batch)
        .select();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw new Error(`Error inserting batch ${i / batchSize + 1}: ${insertError.message}`);
      }
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(sampleTours.length / batchSize)}`, data);
    }

    console.log('✅ Successfully seeded tours table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tours:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the seed function
seedTours();
