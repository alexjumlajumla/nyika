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

async function executeSQL(sql) {
  console.log(`Executing: ${sql.substring(0, 100)}...`);
  const { error } = await supabase.rpc('pg_temp.execute_sql', { sql });
  
  if (error) {
    // If the function doesn't exist, create it
    if (error.message.includes('function pg_temp.execute_sql(unknown) does not exist')) {
      console.log('Creating temporary SQL execution function...');
      const createFnSQL = `
        create or replace function pg_temp.execute_sql(sql text) 
        returns void as $$
        begin
          execute sql;
        end;
        $$ language plpgsql;
      `;
      
      const { error: createFnError } = await supabase.rpc('pg_temp.execute_sql', { sql: createFnSQL });
      if (createFnError) {
        throw new Error(`Failed to create temporary SQL function: ${createFnError.message}`);
      }
      
      // Retry the original statement
      const { error: retryError } = await supabase.rpc('pg_temp.execute_sql', { sql });
      if (retryError) {
        throw new Error(`Failed to execute SQL after creating function: ${retryError.message}\nStatement: ${sql}`);
      }
      return;
    }
    throw new Error(`Failed to execute SQL: ${error.message}\nStatement: ${sql}`);
  }
}

async function applyMigrations() {
  try {
    console.log('Starting to apply database migrations...');
    
    // Get all migration files
    const migrationsDir = join(__dirname, '../supabase/migrations');
    const migrationFiles = [
      '20240609000000_core_roles_permissions.sql',
      '20240609000001_booking_system.sql',
      '20240609000002_media_and_content.sql',
      '20240609000003_settings_reviews_notifications.sql'
    ];
    
    // Execute each migration file
    for (const migrationFile of migrationFiles) {
      const migrationPath = join(migrationsDir, migrationFile);
      console.log(`\nApplying migration: ${migrationFile}`);
      
      // Read the migration file
      const migrationSQL = await readFile(migrationPath, 'utf8');
      
      // Split the SQL into individual statements and execute them one by one
      const statements = migrationSQL
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      for (const statement of statements) {
        if (statement) {
          try {
            await executeSQL(statement);
          } catch (error) {
            console.error(`Error executing statement: ${error.message}`);
            throw error;
          }
        }
      }
      
      console.log(`✅ Applied migration: ${migrationFile}`);
    }
    
    console.log('\n✅ All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

// Run the migrations
applyMigrations();
