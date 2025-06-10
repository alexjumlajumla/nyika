import { signIn, signOut } from 'next-auth/react';

// Export auth functions
export { signIn, signOut };

// Export types for better type safety
export type { Session, User } from 'next-auth';
export type { JWT } from 'next-auth/jwt';

// Re-export commonly used types
export type { DefaultSession } from 'next-auth';
export type { Session as NextAuthSession } from 'next-auth';
export type { DefaultSession as NextAuthDefaultSession } from 'next-auth';
