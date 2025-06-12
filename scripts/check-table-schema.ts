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

async function checkTableSchema() {
  try {
    console.log('Checking accommodations table schema...');
    
    // Get a single row from the accommodations table to infer the schema
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying accommodations table:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No data found in the accommodations table.');
      return;
    }
    
    console.log('Sample accommodation data:');
    console.log(JSON.stringify(data[0], null, 2));
    
    // Get the column names from the first row
    const columns = Object.keys(data[0]);
    console.log('\nColumns in accommodations table:');
    console.table(columns.map(col => ({ column: col, type: typeof data[0][col] })));
    
  } catch (error) {
    console.error('Error checking table schema:', error);
  }
}

checkTableSchema();
