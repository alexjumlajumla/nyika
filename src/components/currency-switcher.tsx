'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

type CurrencyInfo = {
  code: string;
  name: string;
  symbol: string;
};

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
] as const;

type CurrencySwitcherProps = {
  className?: string;
};

export function CurrencySwitcher({ className = '' }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();
  
  const changeCurrency = (newCurrency: CurrencyInfo) => {
    if (newCurrency.code === currency) return;
    setCurrency(newCurrency.code as any); // Safe cast since we know it's valid
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {CURRENCIES.map((curr) => (
        <Button
          key={curr.code}
          type="button"
          variant={currency === curr.code ? 'outline' : 'ghost'}
          size="sm"
          className={`h-8 px-2 text-xs font-medium ${
            currency === curr.code 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
              : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
          onClick={() => changeCurrency(curr)}
          title={`${curr.name} (${curr.code})`}
        >
          <span className="flex items-center gap-1">
            {currency === curr.code && <DollarSign className="h-3 w-3" />}
            {curr.code}
          </span>
        </Button>
      ))}
    </div>
  );
}
