'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number;
  showCurrency?: boolean;
  className?: string;
}

export function CurrencyDisplay({ 
  amount, 
  showCurrency = true,
  className = '' 
}: CurrencyDisplayProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <span className={className}>
      {formatPrice(amount, showCurrency)}
    </span>
  );
}

interface PriceRangeDisplayProps {
  min: number;
  max: number;
  showCurrency?: boolean;
  className?: string;
}

export function PriceRangeDisplay({ 
  min, 
  max, 
  showCurrency = true,
  className = '' 
}: PriceRangeDisplayProps) {
  return (
    <span className={className}>
      <CurrencyDisplay amount={min} showCurrency={showCurrency} /> -{' '}
      <CurrencyDisplay amount={max} showCurrency={showCurrency} />
    </span>
  );
}

interface PerNightDisplayProps {
  amount: number;
  showCurrency?: boolean;
  className?: string;
}

export function PerNightDisplay({ 
  amount, 
  showCurrency = true,
  className = '' 
}: PerNightDisplayProps) {
  return (
    <span className={className}>
      <CurrencyDisplay amount={amount} showCurrency={showCurrency} /> / night
    </span>
  );
}
