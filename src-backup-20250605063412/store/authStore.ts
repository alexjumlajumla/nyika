import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Session } from 'next-auth';

interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
}

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
};

// Create a safe storage that works on both client and server
const createSafeStorage = (): StateStorage => {
  if (typeof window === 'undefined') {
    // Server-side: return a mock storage
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setSession: (session) => {
        if (!session?.user) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        
        const { user } = session;
        const authUser: AuthUser = {
          id: user.id || '',
          name: user.name || null,
          email: user.email || '',
          image: user.image || null,
          role: (user as any).role || 'user',
        };
        
        set({ 
          user: authUser, 
          isAuthenticated: true,
          isLoading: false 
        });
      },
      clearSession: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(createSafeStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setSession, clearSession, setLoading } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    setSession,
    clearSession,
    setLoading,
  };
};
