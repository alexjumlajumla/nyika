'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown, Check, DollarSign } from 'lucide-react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';

// Re-export the components we need from Radix UI
export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;
export const DropdownMenuContent = RadixDropdown.Content;
export const DropdownMenuItem = RadixDropdown.Item;
export const DropdownMenuPortal = RadixDropdown.Portal;

// Helper function to safely access cookies on the client side
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

type Language = {
  code: string;
  name: string;
  flag: string;
};

type Currency = {
  code: string;
  name: string;
  symbol: string;
};

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
];

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

export function LanguageCurrencyDropdowns() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [currentLang, setCurrentLang] = useState<Language>(LANGUAGES[0]);

  // Initialize state after component mounts on the client side
  useEffect(() => {
    // Set current language from URL
    const langFromUrl = pathname?.split('/')[1];
    const matchedLang = LANGUAGES.find(l => l.code === langFromUrl) || LANGUAGES[0];
    setCurrentLang(matchedLang);

    // Set currency from cookie
    const currencyFromCookie = getCookie('currency');
    if (currencyFromCookie) {
      const matchedCurrency = CURRENCIES.find(c => c.code === currencyFromCookie) || CURRENCIES[0];
      setCurrency(matchedCurrency);
    }

    setMounted(true);
  }, [pathname]);

  // Don't render anything on the server
  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-1 opacity-0">
          <Globe className="h-4 w-4" />
          <span>--</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
        <Button variant="ghost" size="sm" className="flex items-center gap-1 opacity-0">
          <DollarSign className="h-4 w-4" />
          <span>---</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  // Set currency in cookie and refresh the page
  const changeCurrency = (newCurrency: Currency) => {
    if (newCurrency.code === currency.code) return;
    
    document.cookie = `currency=${newCurrency.code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setCurrency(newCurrency);
    router.refresh();
  };

  // Change language
  const changeLanguage = (langCode: string) => {
    if (!pathname) return;
    const lang = LANGUAGES.find(l => l.code === langCode);
    if (!lang) return;
    
    setCurrentLang(lang);
    const segments = pathname.split('/');
    segments[1] = langCode; // Replace the language segment
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-4">
      {/* Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 font-medium text-foreground/90 hover:text-foreground">
            <Globe className="h-4 w-4 stroke-[2.5px] text-foreground/80 group-hover:text-foreground" />
            <span className="font-medium">{currentLang.code.toUpperCase()}</span>
            <ChevronDown className="h-4 w-4 text-foreground/60 group-hover:text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent 
            className="min-w-[120px] bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-50"
            align="end"
            sideOffset={8}
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onSelect={(e: Event) => {
                  e.preventDefault();
                  changeLanguage(lang.code);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none cursor-pointer"
              >
                <span>{lang.flag} {lang.name}</span>
                {currentLang.code === lang.code && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

      {/* Currency Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 font-medium text-foreground/90 hover:text-foreground">
            <DollarSign className="h-4 w-4 stroke-[2.5px] text-foreground/80 group-hover:text-foreground" />
            <span className="font-medium">{currency.code}</span>
            <ChevronDown className="h-4 w-4 text-foreground/60 group-hover:text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent 
            className="min-w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-50"
            align="end"
            sideOffset={8}
          >
            {CURRENCIES.map((curr) => (
              <DropdownMenuItem
                key={curr.code}
                onSelect={(e: Event) => {
                  e.preventDefault();
                  changeCurrency(curr);
                }}
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 outline-none cursor-pointer"
              >
                <span>{curr.name} ({curr.code})</span>
                {currency.code === curr.code && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
}