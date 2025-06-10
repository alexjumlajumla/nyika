import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  session: any;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: any; user: any; session: any }>;
  signOut: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          set({
            user: data.user,
            session: data.session,
            error: null,
          });
          
          // Fetch profile after successful sign in
          if (data.user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (!profileError && profile) {
              set({ profile });
            }
          }
          
          return { error: null, user: data.user, session: data.session };
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to sign in';
          set({ error: errorMessage });
          return { error, user: null, session: null };
        } finally {
          set({ isLoading: false });
        }
      },
      signOut: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          get().reset();
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign out' });
        } finally {
          set({ isLoading: false });
        }
      },
      reset: () => set({ 
        user: null, 
        profile: null, 
        session: null, 
        error: null, 
        isLoading: false 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
      }),
    }
  )
);

// Export hooks for better type safety and convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useSession = () => useAuthStore((state) => state.session);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
