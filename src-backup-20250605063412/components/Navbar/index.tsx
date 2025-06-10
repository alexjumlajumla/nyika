'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import NavbarClient from './NavbarClient';

/**
 * Server-rendered Navbar wrapper
 * Fetches the current user's session and passes it to the client-side Navbar
 */
export default async function Navbar() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error fetching server session:', error);
    // Optionally log this to a monitoring tool like Sentry
  }

  return <NavbarClient session={session} />;
}
