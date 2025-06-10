import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error('Missing required environment variable: DATABASE_URL or SUPABASE_DB_URL');
  process.exit(1);
}

async function runMigrations() {
  try {
    console.log('Starting to apply database migrations...');
    
    // Migration files in order
    const migrationFiles = [
      '20240609000000_core_roles_permissions.sql',
      '20240609000001_booking_system.sql',
      '20240609000002_media_and_content.sql',
      '20240609000003_settings_reviews_notifications.sql'
    ];
    
    // Apply each migration
    for (const migrationFile of migrationFiles) {
      const migrationPath = join(__dirname, '../supabase/migrations', migrationFile);
      console.log(`\nApplying migration: ${migrationFile}`);
      
      try {
        // Use psql to execute the SQL file
        const command = `psql ${databaseUrl} -f ${migrationPath}`;
        console.log(`Executing: ${command}`);
        
        const output = execSync(command, { stdio: 'inherit' });
        console.log(`✅ Applied migration: ${migrationFile}`);
      } catch (error) {
        console.error(`❌ Error applying migration ${migrationFile}:`, error.message);
        throw error;
      }
    }
    
    console.log('\n✅ All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

// Run the migrations
runMigrations();
