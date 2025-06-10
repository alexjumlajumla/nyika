'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Define a simplified theme provider props interface
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  [key: string]: any; // Allow any other props
}

/**
 * AppThemeProvider - A wrapper around next-themes ThemeProvider
 * with sensible defaults and proper TypeScript types
 */
const AppThemeProvider = ({ 
  children, 
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = false,
  ...props 
}: ThemeProviderProps) => {
  // Only render on client-side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
  
  return (
    <NextThemesProvider 
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};

export { AppThemeProvider };
export default AppThemeProvider;
