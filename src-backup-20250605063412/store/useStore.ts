import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Cart
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Mobile menu state
        isMobileMenuOpen: false,
        toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
        closeMobileMenu: () => set({ isMobileMenuOpen: false }),
        
        // Theme state
        theme: 'light',
        setTheme: (theme) => set({ theme }),
        
        // Cart state
        cart: [],
        addToCart: (item) => set((state) => ({
          cart: [...state.cart, { ...item, id: `${item.id}-${Date.now()}` }]
        })),
        removeFromCart: (id) => set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        })),
        clearCart: () => set({ cart: [] }),
        
        // Favorites state
        favorites: [],
        toggleFavorite: (id) => set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(favId => favId !== id)
            : [...state.favorites, id]
        })),
        
        // Search state
        searchQuery: '',
        setSearchQuery: (query) => set({ searchQuery: query }),
        
        // Loading state
        isLoading: false,
        setIsLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'nyika-safaris-store',
        partialize: (state) => ({
          theme: state.theme,
          cart: state.cart,
          favorites: state.favorites,
        }),
      }
    )
  )
);

// Hook for theme management
export const useTheme = () => {
  const { theme, setTheme } = useStore();
  
  // You can add theme-related logic here, like toggling dark mode
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return { theme, setTheme, toggleTheme };
};

// Hook for cart operations
export const useCart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useStore();
  
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
  };
};

// Hook for favorites
export const useFavorites = () => {
  const { favorites, toggleFavorite } = useStore();
  
  const isFavorite = (id: string) => favorites.includes(id);
  
  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
