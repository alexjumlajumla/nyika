'use client';

import { DollarSign, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

type Currency = 'USD' | 'TZS' | 'EUR' | 'GBP';

const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
} as const;

type CurrencyCode = keyof typeof CURRENCIES;

export function CurrencySwitcher() {
  const [isMounted, setIsMounted] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const currentCurrency = CURRENCIES[currency as CurrencyCode] || CURRENCIES.USD;

  // Ensure we're on the client before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 px-3" disabled>
        <DollarSign className="h-4 w-4 animate-pulse" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-3">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">{currency}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.entries(CURRENCIES).map(([code, { symbol, name }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrency(code as CurrencyCode)}
            className={`flex items-center gap-2 ${
              currency === code ? 'bg-accent' : ''
            }`}
          >
            <span className="w-8 font-medium">{symbol}</span>
            <span className="flex-1">{name}</span>
            <span className="text-muted-foreground">{code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
