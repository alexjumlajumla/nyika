import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  destination?: string;
}

export interface BookingData {
  date: string;
  guests: number;
  totalPrice: number;
  serviceFee: number;
  tour: string | Tour;
  isAuthenticated: boolean;
}

interface BookingStore {
  // Booking data
  booking: BookingData;
  setBooking: (data: Partial<BookingData>) => void;
  clearBooking: () => void;
  
  // Modal state
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  
  // Authentication state
  checkAuth: () => Promise<boolean>;
  redirectToSignIn: (returnUrl?: string) => void;
}

const initialState: BookingData = {
  date: new Date().toISOString(),
  guests: 1,
  totalPrice: 0,
  serviceFee: 0,
  tour: '',
  isAuthenticated: false,
};

export const useBookingStore = create<BookingStore>((set) => ({
  // Initial state
  booking: initialState,
  isModalOpen: false,
  
  // Booking actions
  setBooking: (data) => set((state) => ({
    booking: { ...state.booking, ...data }
  })),
  
  clearBooking: () => set({ booking: initialState }),
  
  // Modal actions
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  
  // Auth actions
  checkAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session?.user;
    set(state => ({
      booking: { ...state.booking, isAuthenticated }
    }));
    return isAuthenticated;
  },
  
  redirectToSignIn: (returnUrl = window.location.pathname) => {
    window.location.href = `/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
}));
