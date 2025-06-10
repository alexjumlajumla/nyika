// Re-export supabase client
export * from './client';

// Export auth utilities with explicit names
export { getCurrentUser, signIn, signOut } from './auth';
