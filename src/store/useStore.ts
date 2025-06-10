// This file serves as a central export point for all stores
// Import and use individual stores directly for better type safety and tree-shaking

// Re-export all named exports from each store file
export * from './useAuthStore';
export * from './useUIStore';
export * from './useTourStore';

// Import the store hooks for use in the helper function
import { useAuthStore } from './useAuthStore';
import { useUIStore } from './useUIStore';
import { useTourStore } from './useTourStore';

/**
 * Helper function to get all stores in a single hook
 * Useful for debugging or when you need access to multiple stores
 */
export const useAllStores = () => ({
  auth: useAuthStore(),
  ui: useUIStore(),
  tour: useTourStore(),
});
