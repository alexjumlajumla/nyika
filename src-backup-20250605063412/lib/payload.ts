import { getPayload as getPayloadClient } from 'payload';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies as nextCookies, headers as nextHeaders } from 'next/headers';
import { NextRequest } from 'next/server';
import { CollectionName, CollectionDocument, Collections } from '@/payload-types';

// Define the shape of our Payload instance
type Payload = {
  find: <T extends CollectionName>(
    args: {
      collection: T;
      where?: Record<string, any>;
      page?: number;
      limit?: number;
      sort?: string;
      depth?: number;
      draft?: boolean;
      [key: string]: any;
    }
  ) => Promise<{
    docs: CollectionDocument<T>[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }>;

  findByID: <T extends CollectionName>(
    args: {
      collection: T;
      id: string;
      depth?: number;
      draft?: boolean;
      [key: string]: any;
    }
  ) => Promise<CollectionDocument<T>>;

  create: <T extends CollectionName>(
    args: {
      collection: T;
      data: Omit<CollectionDocument<T>, 'id' | 'createdAt' | 'updatedAt'>;
      draft?: boolean;
      [key: string]: any;
    }
  ) => Promise<CollectionDocument<T>>;

  update: <T extends CollectionName>(
    args: {
      collection: T;
      id: string;
      data: Partial<Omit<CollectionDocument<T>, 'id' | 'createdAt' | 'updatedAt'>>;
      draft?: boolean;
      [key: string]: any;
    }
  ) => Promise<CollectionDocument<T>>;

  delete: (args: {
    collection: CollectionName;
    id: string;
    [key: string]: any;
  }) => Promise<void>;
};

// Payload instance type

// Simplified type for find operations
type FindArgs = {
  where?: Record<string, any>;
  page?: number;
  limit?: number;
  sort?: string;
  depth?: number;
  draft?: boolean;
  [key: string]: any;
};

// Type for create/update operations
type DataOperation<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> & Record<string, any>;



import { User } from '@/payload-types';

let _payload: Payload | null = null;

export async function getPayload() {
  if (_payload) return _payload;
  
  noStore();
  
  try {
    const headers = Object.fromEntries((await nextHeaders()).entries());
    const cookies = (await nextCookies()).getAll().reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    // Initialize Payload with proper typing and configuration
    const payloadClient = await getPayloadClient({
      // @ts-ignore - Payload's type definitions don't include the req option
      req: {
        headers,
        cookies,
      },
    });
    
    // Cast to our Payload type
    _payload = payloadClient as unknown as Payload;

    return _payload;
  } catch (error) {
    console.error('Error initializing Payload:', error);
    throw new Error('Failed to initialize Payload');
  }
}

export async function getAuthenticatedUser(req?: NextRequest): Promise<User | null> {
  try {
    const payload = await getPayload();
    const cookieHeader = req?.headers.get('cookie') || '';
    
    // Get the user from the token
    const user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'user@example.com', // Replace with actual user lookup
        },
      },
      depth: 1,
    });

    return user.docs[0] as unknown as User || null;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export async function getCollectionItems<T extends CollectionName>(
  collection: T,
  query: FindArgs = {},
  draft: boolean = false
): Promise<{
  docs: CollectionDocument<T>[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}> {
  type ResultType = Awaited<ReturnType<Payload['find']>>;
  try {
    const payload = await getPayload();
    
    const result = await payload.find({
      collection,
      draft,
      ...query,
    }) as unknown as ResultType;

    // Ensure all required fields are present in the result
    return {
      docs: (result.docs || []) as CollectionDocument<T>[],
      totalDocs: result.totalDocs || 0,
      limit: result.limit || 10,
      totalPages: result.totalPages || 0,
      page: result.page || 1,
      pagingCounter: result.pagingCounter || 0,
      hasPrevPage: result.hasPrevPage || false,
      hasNextPage: result.hasNextPage || false,
      prevPage: result.prevPage || null,
      nextPage: result.nextPage || null,
    };
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return {
      docs: [],
      totalDocs: 0,
      limit: 0,
      totalPages: 0,
      page: 0,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }
}

export async function getCollectionItem<T extends CollectionName>(
  collection: T,
  id: string,
  query: FindArgs = {},
  draft: boolean = false
): Promise<CollectionDocument<T> | null> {
  try {
    const payload = await getPayload();
    
    let result;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // If it looks like an ID, try to find by ID first
result = await payload.findByID({
        collection,
        id,
        draft,
        ...query,
      });
    } else {
      // Otherwise, try to find by slug
const findResult = await payload.find({
        collection,
        where: {
          slug: {
            equals: id,
          },
          ...query.where,
        },
        limit: 1,
        draft,
        ...query,
      });
      
      result = findResult.docs[0] || null;
      
      // No need to check docs array since we already assigned the first doc or null
    }

    return result as CollectionDocument<T>;
  } catch (error) {
    console.error(`Error fetching ${collection} item:`, error);
    return null;
  }
}

export async function createCollectionItem<T extends CollectionName>(
  collection: T,
  data: any, // Use any to avoid complex type issues
  user?: User
): Promise<{ doc?: CollectionDocument<T>; error?: string }> {
  try {
    const payload = await getPayload();
    
    const doc = await payload.create({
      collection,
      data,
      user,
    });

    return { doc };
  } catch (error: any) {
    console.error(`Error creating ${collection} item:`, error);
    return { error: error.message || 'An error occurred' };
  }
}

export async function updateCollectionItem<T extends CollectionName>(
  collection: T,
  id: string,
  data: any, // Use any to avoid complex type issues
  user?: User
): Promise<{ doc?: CollectionDocument<T>; error?: string }> {
  try {
    const payload = await getPayload();
    
    const result = await payload.update({
      collection,
      id,
      data,
      user,
    });

    return { doc: result as CollectionDocument<T> };
  } catch (error: any) {
    console.error(`Error updating ${collection} item:`, error);
    return { error: error.message || 'An error occurred' };
  }
}

export async function deleteCollectionItem<T extends CollectionName>(
  collection: T,
  id: string,
  user?: User
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload();
    
    await payload.delete({
      collection,
      id,
      user,
    });

    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting ${collection} item:`, error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

// Helper function to handle file uploads
export async function uploadFile(file: File, folder: string = 'uploads'): Promise<{ url: string } | { error: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload file');
    }

    return { url: data.secure_url };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { error: error.message || 'Failed to upload file' };
  }
}

// Helper function to delete file from Cloudinary
export async function deleteFile(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateCloudinarySignature(publicId, timestamp);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          signature,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp,
        }),
      }
    );

    const data = await response.json();

    if (data.result !== 'ok') {
      throw new Error(data.message || 'Failed to delete file');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message || 'Failed to delete file' };
  }
}

// Helper function to generate Cloudinary signature
async function generateCloudinarySignature(publicId: string, timestamp: number): Promise<string> {
  const message = `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Helper function to format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper function to format price
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
