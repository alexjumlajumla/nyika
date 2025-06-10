// src/store/useTourStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Tour } from '@/types/tour';

export interface TourFilterOptions {
  searchQuery: string;
  selectedDestinations: string[];
  selectedDurations: string[];
  priceRange: [number, number];
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'popularity';
}

interface TourStore {
  // State
  tours: Tour[];
  filteredTours: Tour[];
  filters: TourFilterOptions;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTours: (tours: Tour[]) => void;
  setFilteredTours: (tours: Tour[]) => void;
  setFilters: (filters: Partial<TourFilterOptions>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  fetchTours: () => Promise<void>;
  getTourById: (id: string) => Tour | undefined;
}

const initialFilters: TourFilterOptions = {
  searchQuery: '',
  selectedDestinations: [],
  selectedDurations: [],
  priceRange: [0, 10000],
  sortBy: 'popularity'
};

export const useTourStore = create<TourStore>()(
  persist(
    (set, get) => ({
      tours: [],
      filteredTours: [],
      filters: initialFilters,
      isLoading: false,
      error: null,

      setTours: (tours) => set({ tours }),
      
      setFilteredTours: (filteredTours) => set({ filteredTours }),
      
      setFilters: (filters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...filters } 
        })),
      
      resetFilters: () => set({ 
        filters: initialFilters,
        filteredTours: get().tours
      }),

      applyFilters: () => {
        const { tours, filters } = get();
        let result = [...tours];

        // Apply search filter
        if (filters.searchQuery) {
          const searchLower = filters.searchQuery.toLowerCase();
          result = result.filter(
            (tour) =>
              tour.title.toLowerCase().includes(searchLower) ||
              tour.destination.toLowerCase().includes(searchLower) ||
              (tour.highlights && 
                tour.highlights.some((h) => 
                  h.toLowerCase().includes(searchLower)
                ))
          );
        }

        // Apply destination filter
        if (filters.selectedDestinations.length > 0) {
          result = result.filter((tour) =>
            filters.selectedDestinations.includes(tour.destination)
          );
        }

        // Apply duration filter
        if (filters.selectedDurations.length > 0) {
          result = result.filter((tour) =>
            filters.selectedDurations.some((duration) => {
              const [min, max] = duration.split('-').map(Number);
              return tour.duration >= min && 
                     (isNaN(max) ? true : tour.duration <= max);
            })
          );
        }

        // Apply price range filter
        const [minPrice, maxPrice] = filters.priceRange;
        result = result.filter(
          (tour) => tour.price >= minPrice && tour.price <= maxPrice
        );

        // Apply sorting
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc':
              result.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              result.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              result.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'name-desc':
              result.sort((a, b) => b.title.localeCompare(a.title));
              break;
            case 'popularity':
            default:
              // Assuming higher rating means more popular
              result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }
        }

        set({ filteredTours: result });
      },

      fetchTours: async () => {
        set({ isLoading: true, error: null });
        try {
          // Replace with your actual API call
          // const response = await fetch('/api/tours');
          // const data = await response.json();
          // set({ tours: data, filteredTours: data });
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tours',
            isLoading: false
          });
        }
      },

      getTourById: (id) => {
        return get().tours.find((tour) => tour.id === id);
      }
    }),
    {
      name: 'tour-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tours: state.tours,
        filters: state.filters
      }),
    }
  )
);

// Export hooks for better type safety and convenience
export const useTours = () => useTourStore((state) => state.tours);
export const useFilteredTours = () => useTourStore((state) => state.filteredTours);
export const useTourFilters = () => useTourStore((state) => state.filters);
export const useIsToursLoading = () => useTourStore((state) => state.isLoading);
export const useToursError = () => useTourStore((state) => state.error);