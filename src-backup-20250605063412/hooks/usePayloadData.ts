import { useEffect, useState } from 'react';
import { collections } from '@/lib/api';

// Define types for collection methods
type CollectionMethods = {
  getBySlug?: (slug: string) => Promise<any>;
  getAll?: (query?: Record<string, any>) => Promise<any>;
  create?: (data: any) => Promise<any>;
  update?: (id: string, data: any) => Promise<any>;
  delete?: (id: string) => Promise<any>;
  [key: string]: any;
};

type CollectionName = keyof typeof collections;

type UsePayloadDataOptions<T> = {
  collection: CollectionName;
  idOrSlug?: string;
  query?: Record<string, any>;
  enabled?: boolean;
  initialData?: T;
};

export function usePayloadData<T>({
  collection,
  idOrSlug,
  query = {},
  enabled = true,
  initialData,
}: UsePayloadDataOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      const collectionMethods = collections[collection] as CollectionMethods;
      
      if (idOrSlug) {
        // Fetch single item by ID or slug
        if (collectionMethods.getBySlug) {
          result = await collectionMethods.getBySlug(idOrSlug);
          setData(result as T);
        } else {
          throw new Error(`getBySlug method not available for collection: ${collection}`);
        }
      } else {
        // Fetch collection
        if (collectionMethods.getAll) {
          result = await collectionMethods.getAll(query);
          setData(result as T);
        } else {
          throw new Error(`getAll method not available for collection: ${collection}`);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${collection}:`, err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collection, idOrSlug, JSON.stringify(query), enabled]);

  const refetch = () => {
    return fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// Hook for creating a new item
export function useCreateItem<T>(collection: CollectionName) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const create = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const collectionMethods = collections[collection] as CollectionMethods;
      if (!collectionMethods.create) {
        throw new Error(`create method not available for collection: ${collection}`);
      }
      const result = await collectionMethods.create(data);
      setData(result as T);
      return result;
    } catch (err) {
      console.error(`Error creating ${collection}:`, err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while creating the item'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    create,
    isLoading,
    error,
    data,
  };
}

// Hook for updating an item
export function useUpdateItem<T>(collection: CollectionName) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const update = async (id: string, data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const collectionMethods = collections[collection] as CollectionMethods;
      if (!collectionMethods.update) {
        throw new Error(`update method not available for collection: ${collection}`);
      }
      const result = await collectionMethods.update(id, data);
      setData(result as T);
      return result;
    } catch (err) {
      console.error(`Error updating ${collection}:`, err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while updating the item'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    update,
    isLoading,
    error,
    data,
  };
}

// Hook for deleting an item
export function useDeleteItem(collection: CollectionName) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const remove = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      const collectionMethods = collections[collection] as CollectionMethods;
      if (!collectionMethods.delete) {
        throw new Error(`delete method not available for collection: ${collection}`);
      }
      await collectionMethods.delete(id);
      setIsSuccess(true);
      return true;
    } catch (err) {
      console.error(`Error deleting ${collection}:`, err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while deleting the item'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    remove,
    isLoading,
    error,
    isSuccess,
  };
}
