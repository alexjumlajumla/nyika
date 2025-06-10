// This file is used to declare types that should be available globally
// or to augment existing module declarations

declare module '@/types/user' {
  export interface User {
    id: string;
    name?: string | null;
    email: string;
    phone?: string;
    address?: string;
    roles: ('admin' | 'editor' | 'user')[];
    updatedAt: string;
    createdAt: string;
  }

  export interface UpdateUserData {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }

  export interface AuthUser {
    id: string;
    name?: string | null;
    email: string;
    roles: string[];
    accessToken?: string;
  }
}

// This makes the types available without importing them
declare module '@/types/user';

// If you're using Payload CMS, you might also need to declare its types
declare module 'payload' {
  export interface User {
    id: string;
    email: string;
    roles: string[];
    [key: string]: unknown;
  }

  export interface Payload {
    find: (options: {
      collection: string;
      where: Record<string, any>;
      limit?: number;
      depth?: number;
    }) => Promise<{ docs: any[] }>;
    
    update: (options: {
      collection: string;
      id: string;
      data: Record<string, any>;
      depth?: number;
    }) => Promise<any>;
  }

  export function getPayload(config?: any): Promise<Payload>;
}
