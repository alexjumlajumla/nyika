import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  
  // Loading states
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
  getLoading: (key: string) => boolean;
  
  // Modals
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
}

type PersistedUIState = Pick<UIState, 'theme' | 'favorites' | 'cart'>;

const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      // Toasts
      toasts: [],
      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { ...toast, id: Date.now().toString() }]
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),
      clearToasts: () => set({ toasts: [] }),
      
      // Cart
      cart: [],
      addToCart: (item) => set((state) => ({
        cart: [
          ...state.cart,
          {
            ...item,
            id: item.id || `item-${Date.now()}`,
            quantity: item.quantity || 1
          }
        ]
      })),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),
      clearCart: () => set({ cart: [] }),
      
      // Favorites
      favorites: [],
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((favId) => favId !== id)
          : [...state.favorites, id]
      })),
      
      // Loading states
      loadingStates: {},
      setLoading: (key, isLoading) =>
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: isLoading
          }
        })),
      getLoading: (key) => get().loadingStates[key] || false,
      
      // Modals
      modals: {},
      openModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true }
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false }
        })),
      toggleModal: (modalId) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [modalId]: !state.modals[modalId]
          }
        })),
      isModalOpen: (modalId) => get().modals[modalId] || false
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: UIState): PersistedUIState => ({
        theme: state.theme,
        favorites: state.favorites,
        cart: state.cart
      })
    } as const
  )
);

// Export the store
export { useUIStore };

// Export hooks for better type safety and convenience
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };
};

export const useToasts = () => ({
  toasts: useUIStore((state) => state.toasts),
  addToast: useUIStore((state) => state.addToast),
  removeToast: useUIStore((state) => state.removeToast),
  clearToasts: useUIStore((state) => state.clearToasts)
});

export const useModal = (modalId: string) => ({
  isOpen: useUIStore((state) => state.isModalOpen(modalId)),
  open: () => useUIStore.getState().openModal(modalId),
  close: () => useUIStore.getState().closeModal(modalId),
  toggle: () => useUIStore.getState().toggleModal(modalId)
});

export const useLoading = (key: string) => {
  const isLoading = useUIStore((state) => state.getLoading(key));
  const setLoading = useUIStore((state) => state.setLoading);
  
  return {
    isLoading,
    start: () => setLoading(key, true),
    stop: () => setLoading(key, false)
  };
};

export const useCart = () => {
  const cart = useUIStore((state) => state.cart);
  const addToCart = useUIStore((state) => state.addToCart);
  const removeFromCart = useUIStore((state) => state.removeFromCart);
  const clearCart = useUIStore((state) => state.clearCart);
  
  return {
    cart,
    cartCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    cartTotal: cart.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    ),
    addToCart,
    removeFromCart,
    clearCart
  };
};

export const useFavorites = () => {
  const favorites = useUIStore((state) => state.favorites);
  const toggleFavorite = useUIStore((state) => state.toggleFavorite);
  
  return {
    favorites,
    toggleFavorite,
    isFavorite: (id: string) => favorites.includes(id)
  };
};