'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);
  const { formatPrice } = useCurrency();
  
  // Ensure we're on the client before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Fallback for server-side rendering
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    
    return <span className={className}>{formattedAmount}</span>;
  }
  
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
