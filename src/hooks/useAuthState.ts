import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase/client';

export const useAuthState = () => {
  const { user, setUser, setProfile, setLoading, setError, reset } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and set the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        try {
          if (session?.user) {
            setUser(session.user);
            // Fetch user profile
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;
            setProfile(profile);
          } else {
            reset();
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred while handling authentication';
          setError(errorMessage);
          // In a production app, you might want to use a proper error logging service
          // logger.error('Auth state change error:', { error });
        } finally {
          setLoading(false);
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;
          setProfile(profile);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to check session';
        setError(errorMessage);
        // In a production app, you might want to use a proper error logging service
        // logger.error('Session check error:', { error });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, setError, reset, router]);

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  return {
    user,
    isLoading,
    error,
    reset,
  };
};

export default useAuthState;
