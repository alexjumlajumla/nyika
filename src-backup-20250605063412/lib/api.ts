import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { User } from '@/payload-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  body?: any,
  headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get the current session for authentication
    const session = await getServerSession(authOptions);
    
    // Define a type for the session user with optional accessToken
    type SessionUser = {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      accessToken?: string;
    };

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(session?.user && (session.user as SessionUser).accessToken && {
        'Authorization': `Bearer ${(session.user as SessionUser).accessToken}`,
      }),
      ...headers,
    };

    const config: RequestInit = {
      method,
      headers: defaultHeaders,
      credentials: 'include',
      next: { revalidate: 60 }, // Revalidate every 60 seconds by default
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || 'An error occurred',
        status: response.status,
      };
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { status: 204 } as ApiResponse<T>;
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500,
    };
  }
}

// Collection API helpers
export const collections = {
  // Users
  users: {
    getMe: () => apiRequest<User>('/users/me'),
    updateMe: (data: Partial<User>) => apiRequest<User>('/users/me', 'PATCH', data),
  },
  
  // Tours
  tours: {
    getAll: (query?: Record<string, any>) => 
      apiRequest<{ docs: any[]; totalDocs: number }>(
        `/tours${query ? `?${new URLSearchParams(query)}` : ''}`
      ),
    getBySlug: (slug: string) => apiRequest<any>(`/tours?where[slug][equals]=${slug}`),
    create: (data: any) => apiRequest<any>('/tours', 'POST', data),
    update: (id: string, data: any) => apiRequest<any>(`/tours/${id}`, 'PATCH', data),
    delete: (id: string) => apiRequest<void>(`/tours/${id}`, 'DELETE'),
  },
  
  // Attractions
  attractions: {
    getAll: (query?: Record<string, any>) => 
      apiRequest<{ docs: any[]; totalDocs: number }>(
        `/attractions${query ? `?${new URLSearchParams(query)}` : ''}`
      ),
    getBySlug: (slug: string) => apiRequest<any>(`/attractions?where[slug][equals]=${slug}`),
    create: (data: any) => apiRequest<any>('/attractions', 'POST', data),
    update: (id: string, data: any) => apiRequest<any>(`/attractions/${id}`, 'PATCH', data),
    delete: (id: string) => apiRequest<void>(`/attractions/${id}`, 'DELETE'),
  },
  
  // Accommodations
  accommodations: {
    getAll: (query?: Record<string, any>) => 
      apiRequest<{ docs: any[]; totalDocs: number }>(
        `/accommodations${query ? `?${new URLSearchParams(query)}` : ''}`
      ),
    getBySlug: (slug: string) => apiRequest<any>(`/accommodations?where[slug][equals]=${slug}`),
    create: (data: any) => apiRequest<any>('/accommodations', 'POST', data),
    update: (id: string, data: any) => apiRequest<any>(`/accommodations/${id}`, 'PATCH', data),
    delete: (id: string) => apiRequest<void>(`/accommodations/${id}`, 'DELETE'),
  },
  
  // Media
  media: {
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return apiRequest<{ url: string }>(
        '/media',
        'POST',
        formData,
        { 'Content-Type': 'multipart/form-data' }
      );
    },
    delete: (id: string) => apiRequest<void>(`/media/${id}`, 'DELETE'),
  },
};

// Utility function to handle API errors
export function handleApiError(error: unknown, defaultMessage = 'An error occurred') {
  if (error instanceof Error) {
    return { error: error.message };
  }
  if (typeof error === 'string') {
    return { error };
  }
  return { error: defaultMessage };
}

// Helper function to format API query parameters
export function formatQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (nestedValue !== undefined && nestedValue !== null) {
            searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          }
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}
