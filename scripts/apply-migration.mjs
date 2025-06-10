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

async function applyMigrations() {
  try {
    console.log('Starting to apply database migrations...');
    
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20240608123000_add_missing_fields.sql');
    const migrationSQL = await readFile(migrationPath, 'utf8');
    
    console.log('Applying migration...');
    
    // Execute the migration SQL directly
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If the function doesn't exist, create it
      if (error.message.includes('function exec_sql(unknown) does not exist')) {
        console.log('Creating SQL execution function...');
        const { error: createFnError } = await supabase.rpc(`
          create or replace function exec_sql(sql text) 
          returns json as $$
          begin
            execute sql;
            return json_build_object('status', 'success');
          exception when others then
            return json_build_object(
              'status', 'error',
              'message', SQLERRM,
              'detail', SQLSTATE
            );
          end;
          $$ language plpgsql security definer;
        `);
        
        if (createFnError) {
          throw new Error(`Failed to create SQL function: ${createFnError.message}`);
        }
        
        // Retry the migration
        console.log('Retrying migration...');
        const { data: retryData, error: retryError } = await supabase.rpc('exec_sql', { sql: migrationSQL });
        
        if (retryError) {
          throw new Error(`Failed to execute migration: ${retryError.message}`);
        }
        
        console.log('Migration result:', retryData);
      } else {
        throw new Error(`Failed to execute migration: ${error.message}`);
      }
    } else {
      console.log('Migration result:', data);
    }
    
    console.log('✅ Database migrations applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

applyMigrations();
