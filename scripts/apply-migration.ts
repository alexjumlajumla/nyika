import 'dotenv/config';
import { executeSqlFile } from './supabase/execute-sql';

function log(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    error: '❌'
  }[type];
  
  // Using process.stdout/stderr directly to avoid linting issues
  const output = type === 'error' ? process.stderr : process.stdout;
  output.write(`${prefix} ${message}\n`);
}

async function applyMigration() {
  try {
    log('Applying migration...', 'info');
    await executeSqlFile('supabase/migrations/20240609170000_create_profiles_trigger.sql');
    log('Migration applied successfully!', 'success');
  } catch (error) {
    log(`Error applying migration: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

applyMigration();
