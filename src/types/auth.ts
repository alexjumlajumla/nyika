import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/utils/auth-helpers';

// Interface for the auth context
export interface IAuthContext {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: { display_name?: string; avatar_url?: string }) => Promise<void>;
  refresh: () => Promise<User | null>;
}

// Type for the auth provider props
export interface AuthProviderProps {
  children: React.ReactNode;
}

// Type for useAuth hook options
export interface UseAuthOptions {
  required?: boolean;
}

// Type for components wrapped with withAuth HOC
export interface WithAuthProps {
  user: User;
  profile: UserProfile | null;
}

// Re-export for backward compatibility
export type AuthContextType = IAuthContext;
