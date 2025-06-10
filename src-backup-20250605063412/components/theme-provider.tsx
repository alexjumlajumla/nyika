'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Attribute = 'class' | 'data-theme' | 'data-theme-attribute';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute;
  defaultTheme?: string;
  enableSystem?: boolean;
}

/**
 * ThemeProvider - wraps the application in a theme context
 * Enables support for dark/light/system themes using `next-themes`
 */
export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemesProvider>
  );
}
