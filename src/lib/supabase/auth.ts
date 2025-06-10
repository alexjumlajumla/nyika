'use server';

import { auth, type User } from './client';
import { cookies } from 'next/headers';

type Session = {
  user: User | null;
  // Add other session properties as needed
};

type SessionResponse = {
  data: {
    session: Session | null;
  } | null;
  error?: Error;
};

type SignInResponse = {
  data: { user: User | null; session: any } | null;
  error: Error | null;
};

type SignOutResponse = {
  error: Error | null;
};

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await auth.getSession() as unknown as SessionResponse;
    if (response?.error) {
      throw response.error;
    }
    return response?.data?.session?.user || null;
  } catch {
    return null;
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<SignInResponse> {
  try {
    const response = await auth.signInWithEmail(email, password);
    if ('error' in response && response.error) {
      throw response.error;
    }
    return { data: response, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to sign in') 
    };
  }
}

export async function signOut(): Promise<SignOutResponse> {
  try {
    const response = await auth.signOut();
    if ('error' in response && response.error) {
      throw response.error;
    }

    // Clear the auth cookie by setting it to expire in the past
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'sb-auth-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    return { error: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error : new Error('Failed to sign out') 
    };
  }
}
