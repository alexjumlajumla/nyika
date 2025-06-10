'use client';

import { Globe, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current locale from pathname (e.g., /en/about -> en)
  const currentLocale = pathname ? pathname.split('/')[1] : 'en';
  const currentLang = LANGUAGES.find(lang => lang.code === currentLocale) || LANGUAGES[0];

  const changeLanguage = (language: string) => {
    if (!pathname) return;
    
    // Update the URL to the new language
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = language; // Replace the locale segment
    } else {
      segments.push(language); // Add locale if not present
    }
    const newPath = segments.join('/');
    
    // Save language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', language);
    }
    
    // Navigate to the new URL
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-3">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 ${currentLocale === lang.code ? 'bg-accent' : ''}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
