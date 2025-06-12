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

async function checkAccommodations() {
  try {
    console.log('Checking accommodations table...');
    
    // Try to query the accommodations table directly
    console.log('Attempting to query the accommodations table...');
    
    const { data, error, count } = await supabase
      .from('accommodations')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') { // Table does not exist
        console.log('The accommodations table does not exist in the database.');
        return;
      }
      throw error;
    }
    
    if (count !== null && count > 0) {
      console.log(`Found ${count} accommodations in the database.`);
      
      // Get a sample of the accommodations
      const { data: sampleData, error: sampleError } = await supabase
        .from('accommodations')
        .select('*')
        .limit(1);
      
      if (sampleError) throw sampleError;
      
      if (sampleData && sampleData.length > 0) {
        console.log('Sample accommodation:', sampleData[0]);
      }
    } else {
      console.log('The accommodations table exists but is empty.');
    }
    
  } catch (error) {
    console.error('Error checking accommodations:', error);
  }
}

checkAccommodations();
