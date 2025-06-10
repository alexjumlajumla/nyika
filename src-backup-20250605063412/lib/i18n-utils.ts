import { useRouter, usePathname } from 'next/navigation';

export function useLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const changeLanguage = (newLocale: string) => {
    if (!pathname) return;
    
    // Get the current path without the locale
    const segments = pathname.split('/');
    const pathWithoutLocale = segments.slice(2).join('/');
    
    // Construct the new URL with the new locale
    const newUrl = `/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
    
    // Navigate to the new URL
    window.location.href = newUrl;
  };
  
  const getCurrentLocale = (): string => {
    if (!pathname) return 'en';
    return pathname.split('/')[1] || 'en';
  };
  
  return {
    changeLanguage,
    currentLocale: getCurrentLocale(),
  };
}

// Helper function to get the current language from the URL
export function getCurrentLanguage(pathname: string | null): string {
  if (!pathname) return 'en';
  const segments = pathname.split('/');
  return segments[1] || 'en';
}

// Helper function to get the current path without the language prefix
export function getPathWithoutLanguage(pathname: string | null): string {
  if (!pathname) return '/';
  const segments = pathname.split('/');
  return '/' + segments.slice(2).join('/') || '/';
}
