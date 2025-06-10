'use client';

import { DollarSign, ChevronDown } from 'lucide-react';
import { useCurrency, CURRENCIES } from '@/contexts/currency-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CurrencyCode = keyof typeof CURRENCIES;

export function CurrencySwitcher() {
  const { currency, setCurrency, isLoading } = useCurrency();
  const currentCurrency = CURRENCIES[currency as CurrencyCode];

  if (isLoading) {
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
