'use client';

import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Only enable transitions after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Enable transitions after mount
      document.documentElement.classList.add('transition-colors');
      document.documentElement.classList.add('duration-200');
    }
  }, [mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    mounted,
  };
}
