'use client';

import dynamic from 'next/dynamic';

// Dynamically import the NavbarClient component with SSR disabled
const NavbarClient = dynamic(() => import('./NavbarClient'), { ssr: false });

/**
 * Client-side Navbar wrapper
 * Uses dynamic import to disable SSR for the NavbarClient component
 */
export default function Navbar() {
  return <NavbarClient />;
}
