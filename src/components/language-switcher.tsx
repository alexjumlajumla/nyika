'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = {
  code: string;
  name: string;
  flag: string;
};

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
];

type LanguageSwitcherProps = {
  className?: string;
  lang?: string;
};

export function LanguageSwitcher({ className, lang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  if (typeof window === 'undefined') {
    return (
      <div className={cn('relative', className)}>
        <Button variant="ghost" size="icon" disabled>
          <Globe className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  const changeLanguage = (lang: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = lang; // Replace the language segment
    router.push(segments.join('/'));
  };

  const currentLang = lang 
    ? LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
    : LANGUAGES.find(l => pathname?.startsWith(`/${l.code}`)) || LANGUAGES[0];

  return (
    <div className={cn('relative', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center justify-between"
            >
              <span>{lang.flag} {lang.name}</span>
              {currentLang.code === lang.code && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
