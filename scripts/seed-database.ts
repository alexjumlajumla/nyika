import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

// Helper function to check if a table has data
async function tableHasData(supabase: any, tableName: string): Promise<boolean> {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error(`Error checking ${tableName}:`, error);
    return false;
  }
  
  return (count || 0) > 0;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to generate random date in the future
const randomFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * days) + 1);
  return date.toISOString().split('T')[0];
};

// Sample accommodation data
const createSampleAccommodations = async (count: number = 5) => {
  const accommodationTypes: Array<'hotel' | 'lodge' | 'camp' | 'resort' | 'villa'> = [
    'hotel', 'lodge', 'camp', 'resort', 'villa'
  ];

  const countries = ['Kenya', 'Tanzania', 'South Africa', 'Botswana', 'Namibia'];
  const cities = {
    'Kenya': ['Nairobi', 'Mombasa', 'Maasai Mara', 'Amboseli'],
    'Tanzania': ['Arusha', 'Zanzibar', 'Serengeti', 'Ngorongoro'],
    'South Africa': ['Cape Town', 'Kruger', 'Johannesburg', 'Durban'],
    'Botswana': ['Okavango Delta', 'Chobe', 'Maun', 'Kasane'],
    'Namibia': ['Windhoek', 'Swakopmund', 'Sossusvlei', 'Etosha']
  };

  const accommodations = [];
  
  for (let i = 0; i < count; i++) {
    const country = faker.helpers.arrayElement(countries);
    const city = faker.helpers.arrayElement(cities[country as keyof typeof cities]);
    const type = faker.helpers.arrayElement(accommodationTypes);
    const name = `${faker.location.city()} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    accommodations.push({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: faker.lorem.paragraphs(3),
      type,
      location: `${city}, ${country}`,
      address: faker.location.streetAddress(),
      city,
      country,
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      amenities: Array(5).fill(0).map(() => faker.helpers.arrayElement([
        'Free WiFi', 'Swimming Pool', 'Restaurant', 'Spa', 'Air Conditioning',
        'Bar', 'Airport Shuttle', 'Room Service', 'Fitness Center', 'Laundry'
      ])),
      images: Array(3).fill(0).map(() => faker.image.urlLoremFlickr({ category: 'hotel' })),
      featured_image: faker.image.urlLoremFlickr({ category: 'hotel' }),
      rating: parseFloat(faker.finance.amount({ min: 3, max: 5 })),
      price_per_night: parseFloat(faker.finance.amount({ min: 100, max: 1000 }))
    });
  }

  const { data, error } = await supabase
    .from('accommodations')
    .insert(accommodations)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

// Sample tour data
const createSampleTours = async (count: number = 10) => {
  const difficulties: Array<'easy' | 'moderate' | 'challenging' | 'strenuous'> = [
    'easy', 'moderate', 'challenging', 'strenuous'
  ];

  const locations = [
    { country: 'Kenya', destinations: ['Maasai Mara', 'Amboseli', 'Samburu', 'Lake Nakuru'] },
    { country: 'Tanzania', destinations: ['Serengeti', 'Ngorongoro', 'Mount Kilimanjaro', 'Zanzibar'] },
    { country: 'South Africa', destinations: ['Kruger', 'Cape Town', 'Garden Route', 'Drakensberg'] },
    { country: 'Botswana', destinations: ['Okavango Delta', 'Chobe', 'Moremi', 'Kalahari'] },
    { country: 'Namibia', destinations: ['Sossusvlei', 'Etosha', 'Skeleton Coast', 'Fish River Canyon'] },
  ];

  const tours = [];
  
  for (let i = 0; i < count; i++) {
    const location = faker.helpers.arrayElement(locations);
    const destination = faker.helpers.arrayElement(location.destinations);
    const title = `${destination} ${faker.helpers.arrayElement(['Safari', 'Adventure', 'Expedition', 'Experience'])}`;
    const durationDays = faker.helpers.arrayElement([3, 5, 7, 10, 14]);
    const price = faker.number.int({ min: 1000, max: 10000 });
    
    tours.push({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description: faker.lorem.paragraphs(5),
      short_description: faker.lorem.sentence(),
      duration_days: durationDays,
      duration_nights: durationDays - 1,
      difficulty: faker.helpers.arrayElement(difficulties),
      group_size: faker.helpers.arrayElement([4, 6, 8, 12]),
      price,
      discount_price: faker.datatype.boolean(0.3) ? price * 0.8 : null, // 30% chance of having a discount
      featured: faker.datatype.boolean(0.2), // 20% chance of being featured
      status: 'published',
      start_location: `${location.country} - ${destination}`,
      end_location: location.country,
      includes: [
        'Professional guide',
        'All park fees',
        'Accommodation',
        'Meals as per itinerary',
        'Transport in 4x4 vehicle'
      ],
      excludes: [
        'International flights',
        'Travel insurance',
        'Visa fees',
        'Personal expenses',
        'Tips and gratuities'
      ],
      highlights: Array(5).fill(0).map(() => faker.lorem.sentence()),
      images: Array(5).fill(0).map(() => faker.image.url()),
      featured_image: faker.image.url()
    });
  }

  const { data, error } = await supabase
    .from('tours')
    .insert(tours)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

// Sample bookings data
const createSampleBookings = async (count: number = 20) => {
  // Get existing users, tours, and accommodations
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id')
    .limit(5);

  if (usersError || !users.length) {
    return [];
  }

  const { data: accommodations } = await supabase
    .from('accommodations')
    .select('id, price_per_night');

  if (!accommodations?.length) {
    return [];
  }

  const { data: tours, error: toursError } = await supabase
    .from('tours')
    .select('id, title, price');

  if (toursError || !tours?.length) {
    // Create bookings
    const bookings = [];
    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(users);
      const tour = { 
        id: faker.string.uuid(), 
        title: faker.lorem.sentence(), 
        price: faker.number.float({ min: 500, max: 5000, fractionDigits: 2 }) 
      };
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + faker.number.int({ min: 1, max: 90 }));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + faker.number.int({ min: 2, max: 7 }));
      const numPeople = faker.number.int({ min: 1, max: 4 });
      const totalAmount = tour.price;
      
      bookings.push({
        user_id: user.id,
        tour_id: tour.id,
        tour_title: tour.title,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        num_people: numPeople,
        total_amount: totalAmount,
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed', 'cancelled']),
        payment_status: faker.helpers.arrayElement(['pending', 'paid', 'failed', 'refunded']),
        payment_method: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'paypal']),
        guest_name: faker.person.fullName(),
        guest_email: faker.internet.email(),
        guest_phone: faker.phone.number(),
        special_requests: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null
      });
    }
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookings)
      .select();

    if (error) {
      throw error;
    }

    return data;
  }

  const bookings = [];
  
  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const tour = faker.helpers.arrayElement(tours);
    const startDate = randomFutureDate(90); // Within next 90 days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 2, max: 7 }));
    const numPeople = faker.number.int({ min: 1, max: 4 });
    const totalAmount = tour.price || 0; // Just use the tour price for now
    
    bookings.push({
      user_id: user.id,
      tour_id: tour.id,
      tour_title: tour.title,
      start_date: startDate,
      end_date: endDate.toISOString().split('T')[0],
      num_people: numPeople,
      total_amount: totalAmount,
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed', 'cancelled']),
      payment_status: faker.helpers.arrayElement(['pending', 'paid', 'failed', 'refunded']),
      payment_method: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'paypal']),
      guest_name: faker.person.fullName(),
      guest_email: faker.internet.email(),
      guest_phone: faker.phone.number(),
      special_requests: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null
    });
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(bookings)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

// Main function to run all seeders
const seedDatabase = async () => {
  // Check if we already have data
  const hasData = await tableHasData(supabase, 'tours') || 
                  await tableHasData(supabase, 'accommodations');
  
  if (hasData) {
    console.log('Database already contains data. Skipping seed.');
    return [];
  }
  try {
    // Log start without console statement
    // Starting database seeding...
    
    // Seed accommodations
    await createSampleAccommodations(10);
    
    // Seed tours
    await createSampleTours(15);
    
    // Seed bookings
    await createSampleBookings(30);
    
    // Log success without console statement
    // Database seeding completed successfully!
  } catch (err) {
    // Log error without console statement
    const error = err as Error;
    process.stderr.write(`Error seeding database: ${error.message}\n`);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();
