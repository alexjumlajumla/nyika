import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL(sql) {
  console.log('Executing SQL...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return false;
    }
    
    console.log('SQL executed successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception executing SQL:', error);
    return false;
  }
}

async function main() {
  try {
    // First, create the exec_sql function if it doesn't exist
    const createFunctionSQL = await readFile(join(__dirname, 'run-migration.sql'), 'utf8');
    console.log('Creating exec_sql function...');
    await runSQL(createFunctionSQL);
    
    // Now run the actual migration
    const migrationSQL = await readFile(join(__dirname, '../supabase/migrations/20240608123000_add_missing_fields.sql'), 'utf8');
    console.log('Running migration...');
    const success = await runSQL(migrationSQL);
    
    if (success) {
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Migration failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
