'use client';

import { QueryClient, QueryKey, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { use } from 'react';

interface QueryOptions<TData = unknown, TError = unknown>
  extends Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
}

export function useQueryClient<TData = unknown, TError = unknown>(
  options: QueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const { queryKey, queryFn, ...rest } = options;
  
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...rest,
  });
}

// Server-side query hook for Next.js server components
export function useServerQuery<TData = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>
): TData {
  return use(queryFn());
}
