import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

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

// Function to clean up database tables
const cleanupDatabase = async () => {
  try {
    // Disable triggers temporarily to avoid foreign key constraint violations
    await supabase.rpc('disable_all_triggers');

    // Delete data from tables in the correct order to respect foreign key constraints
    const tables = [
      'bookings',
      'tour_accommodations',
      'tours',
      'accommodations'
    ];

    // Truncate tables in the correct order to respect foreign key constraints
    for (const table of tables) {
      try {
        // First try to delete all records
        const { error: deleteError } = await supabase.from(table).delete().neq('id', '');
        
        // If delete fails (e.g., due to foreign key constraints), try truncate
        if (deleteError) {
          console.log(`Delete from ${table} failed, trying TRUNCATE...`);
          const { error: truncateError } = await supabase.rpc('truncate_table', { table_name: table });
          if (truncateError) throw truncateError;
        }
      } catch (error) {
        console.error(`Error cleaning up table ${table}:`, error);
        // Continue with other tables even if one fails
      }
    }

    // Re-enable triggers
    await supabase.rpc('enable_all_triggers');
    
    process.stderr.write('Database cleanup completed successfully!\n');
  } catch (error) {
    const err = error as Error;
    process.stderr.write(`Error cleaning up database: ${err.message}\n`);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Execute the cleanup
cleanupDatabase();
