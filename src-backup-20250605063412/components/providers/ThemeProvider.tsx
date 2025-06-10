// No 'use client' here – this file stays SSR-safe
import ThemeProviderClient from './ThemeProviderClient';
import type { ThemeProviderProps } from 'next-themes';

/**
 * Server-compatible wrapper that safely renders ThemeProviderClient
 */
export default function ThemeProvider(props: ThemeProviderProps) {
  return <ThemeProviderClient {...props} />;
}
