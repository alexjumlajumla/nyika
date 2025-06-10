import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse database URL
function parseDatabaseUrl(url) {
  try {
    // Handle postgres:// format
    const urlObj = new URL(url.replace(/^postgres:/, 'postgresql:'));
    const auth = urlObj.username ? `${urlObj.username}:${urlObj.password}@` : '';
    
    return {
      host: urlObj.hostname,
      port: urlObj.port || '5432',
      database: urlObj.pathname.replace(/^\/+/, '') || 'postgres',
      username: urlObj.username || 'postgres',
      password: urlObj.password || '',
      connectionString: `postgresql://${auth}${urlObj.hostname}:${urlObj.port || '5432'}/${urlObj.pathname.replace(/^\/+/, '') || 'postgres'}`
    };
  } catch (error) {
    console.error('Error parsing database URL:', error.message);
    process.exit(1);
  }
}

async function runMigrations() {
  try {
    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL or SUPABASE_DB_URL environment variable is required');
    }
    
    const dbConfig = parseDatabaseUrl(dbUrl);
    console.log('Database connection configured for host:', dbConfig.host);
    
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
      console.log(`\n🔧 Applying migration: ${migrationFile}`);
      
      try {
        // Build the psql command with explicit parameters
        const command = [
          'psql',
          `-h ${dbConfig.host}`,
          `-p ${dbConfig.port}`,
          `-U ${dbConfig.username}`,
          `-d ${dbConfig.database}`,
          `-f "${migrationPath}"`,
          '-v ON_ERROR_STOP=1',
          `PGPASSWORD='${dbConfig.password.replace(/'/g, "''")}'`
        ].join(' ');
        
        console.log(`Executing: psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -f [migration_file]`);
        
        // Execute the command
        execSync(command, { stdio: 'inherit', shell: true });
        console.log(`✅ Successfully applied: ${migrationFile}`);
      } catch (error) {
        console.error(`❌ Failed to apply migration ${migrationFile}:`, error.message);
        process.exit(1);
      }
    }
    
    console.log('\n✨ All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    process.exit(1);
  }
}

// Run the migrations
runMigrations();
