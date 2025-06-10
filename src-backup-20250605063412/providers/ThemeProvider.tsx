'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

const ThemeProvider = ({ 
  children, 
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = false,
  ...props 
}: ThemeProviderProps) => (
  <NextThemesProvider 
    attribute={attribute}
    defaultTheme={defaultTheme}
    enableSystem={enableSystem}
    {...props}
  >
    {children}
  </NextThemesProvider>
);

export { ThemeProvider };
export default ThemeProvider;
