import { useCallback, useEffect, useRef, useState } from 'react';

interface HomeData {
  featuredTours: any[];
  featuredDestinations: any[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/home');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        retryCount.current = 0; // Reset retry count on success
      } else {
        throw new Error(result.error || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error in useHomeData:', err);
      
      // Only retry if we haven't exceeded max retries
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        
        // Clear any existing timeout
        if (retryTimeout.current) {
          clearTimeout(retryTimeout.current);
        }
        
        // Set a new timeout for retry
        retryTimeout.current = setTimeout(() => {
          console.log(`Retrying (${retryCount.current}/${MAX_RETRIES})...`);
          fetchData();
        }, RETRY_DELAY);
        
        return; // Don't set error state yet
      }
      
      // Only set error state if we've exhausted all retries
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to manually retry
  const retry = useCallback(() => {
    retryCount.current = 0;
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, retry };
}
