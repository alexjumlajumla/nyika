'use server';

import { createServerClient as createSupabaseClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

type CookieOptions = {
  name: string;
  value: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  maxAge?: number;
  expires?: Date;
  domain?: string;
};

// Create a server client with cookie handling for Next.js 14+
export async function createServerClient() {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  // Create a simple cookie handler that works with Next.js 14+
  const cookieHandler = {
    get(name: string) {
      try {
        // In Next.js 14+, we can use the get method on the cookies object
        return cookieStore.get(name)?.value;
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error getting cookie:', error);
        }
        return undefined;
      }
    },
    set(name: string, value: string, options: Partial<CookieOptions> = {}) {
      try {
        const sameSiteValue = options.sameSite === true ? 'strict' : 
                         options.sameSite === false ? 'lax' : 
                         options.sameSite || 'lax';
        
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        
        // In Next.js 14+, we can use the set method on the cookies object
        cookieStore.set({
          name,
          value: stringValue,
          path: options.path || '/',
          httpOnly: options.httpOnly !== false,
          secure: options.secure ?? isProduction,
          sameSite: sameSiteValue as 'lax' | 'strict' | 'none',
          ...(options.maxAge && { maxAge: options.maxAge }),
          ...(options.expires && { expires: options.expires }),
          ...(options.domain && { domain: options.domain }),
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error setting cookie:', error);
        }
      }
    },
    remove(name: string) {
      try {
        // In Next.js 14+, we can use the delete method on the cookies object
        cookieStore.delete(name);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error removing cookie:', error);
        }
      }
    },
  };

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      cookies: {
        get: (name) => cookieHandler.get(name),
        set: (name, value, options) => cookieHandler.set(name, value, options || {}),
        remove: (name) => cookieHandler.remove(name),
      },
    }
  );
}

const handleError = (error: unknown, context: string) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(`[Supabase ${context} Error]:`, error);
  }
  return null;
};

export const getSession = async () => {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    return handleError(error, 'Session');
  }
};

export const getUser = async () => {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    return handleError(error, 'User');
  }
};

export const signOut = async () => {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error, 'SignOut') };
  }
};