import { create } from 'zustand';
import { Tour } from '@/types/tour';

// Define the tour store interface
interface TourStore {
  tours: Tour[];
  setTours: (tours: Tour[]) => void;
  filteredTours: Tour[];
  setFilteredTours: (tours: Tour[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDestinations: string[];
  setSelectedDestinations: (destinations: string[]) => void;
  selectedDurations: string[];
  setSelectedDurations: (durations: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  handleFilterChange: (filters: {
    search: string;
    selectedDestinations: string[];
    selectedDurations: string[];
    priceRange: [number, number];
  }) => void;
}

// Create the Zustand store
const useTourStore = create<TourStore>((set, get) => ({
  tours: [],
  setTours: (tours) => set({ tours }),
  filteredTours: [],
  setFilteredTours: (filteredTours) => set({ filteredTours }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectedDestinations: [],
  setSelectedDestinations: (selectedDestinations) => set({ selectedDestinations }),
  selectedDurations: [],
  setSelectedDurations: (selectedDurations) => set({ selectedDurations }),
  priceRange: [0, 10000],
  setPriceRange: (priceRange) => set({ priceRange }),
  handleFilterChange: (filters) => {
    const { tours } = get();
    let result = [...tours];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchLower) ||
          tour.destination.toLowerCase().includes(searchLower) ||
          (tour.highlights && tour.highlights.some(
            (h) => typeof h === 'string' && h.toLowerCase().includes(searchLower)
          ))
      );
    }

    // Apply destination filter
    if (filters.selectedDestinations.length > 0) {
      result = result.filter((tour) =>
        filters.selectedDestinations.some((dest) =>
          tour.destination.toLowerCase().includes(dest.toLowerCase())
        )
      );
    }

    // Apply duration filter
    if (filters.selectedDurations.length > 0) {
      result = result.filter((tour) =>
        filters.selectedDurations.some(duration => 
          tour.duration.toLowerCase().includes(duration.toLowerCase())
        )
      );
    }

    // Apply price range filter
    result = result.filter(
      (tour) =>
        tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1]
    );

    set({ filteredTours: result });
  },
}));

export default useTourStore;
