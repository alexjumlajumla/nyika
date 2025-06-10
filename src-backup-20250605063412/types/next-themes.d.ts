declare module 'next-themes' {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    /** HTML attribute modified based on the active theme. Accepts `class` or `data-*` (default: `class`) */
    attribute?: string | 'class';
    /** Name of the local storage key used to store the theme preference (default: `theme`) */
    storageKey?: string;
    /** Default theme (default: `light`) */
    defaultTheme?: string;
    /** Forced theme for the root element (only applied if `enableSystem` is false) */
    forcedTheme?: string;
    /** Whether to enable system theme detection (default: `false`) */
    enableSystem?: boolean;
    /** Key used to store theme in localStorage (default: `theme`) */
    themeStorageKey?: string;
    /** Key used to store system preference in localStorage (default: `theme-system`) */
    systemThemeStorageKey?: string;
    /** Key used to store resolved theme in localStorage (default: `theme-resolved`) */
    resolvedThemeStorageKey?: string;
    /** Whether to prevent adding the data-theme attribute to the HTML element (default: `false`) */
    disableTransitionOnChange?: boolean;
    /** Whether to use the `prefers-color-scheme` media query (default: `true`) */
    enableColorScheme?: boolean;
    /** Whether to indicate to browsers which color scheme is used (dark or light) (default: `true`) */
    enableCSSVariables?: boolean;
  }

  export interface UseThemeProps {
    /** Active theme name */
    theme: string | undefined;
    /** List of all available theme names */
    themes: string[];
    /** Update the theme */
    setTheme: (theme: string) => void;
    /** Toggle between themes */
    toggleTheme: () => void;
    /** Forced page color scheme (if set) */
    forcedTheme?: string;
    /** Whether the active theme is the system theme */
    systemTheme?: 'light' | 'dark';
    /** Whether the theme is being resolved (only relevant when `enableSystem` is true) */
    isThemeResolved: boolean;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export const useTheme: () => UseThemeProps;
  export const useThemeContext: () => UseThemeProps;
  export const ThemeContext: React.Context<UseThemeProps>;
  export const ThemeScript: React.FC<Omit<ThemeProviderProps, 'children'>>;
}
