import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing required environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function executeSql(query: string) {
  const { error } = await supabase.rpc('exec', { query });
  
  if (error) {
    throw new Error(`SQL Error: ${error.message}`);
  }
  
  return true;
}

export async function executeSqlFile(filePath: string) {
  const { readFile } = await import('fs/promises');
  const sql = await readFile(filePath, 'utf-8');
  return executeSql(sql);
}
