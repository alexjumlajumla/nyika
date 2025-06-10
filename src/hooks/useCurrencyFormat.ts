'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { useEffect, useState } from 'react';

type Currency = 'USD' | 'TZS' | 'EUR' | 'GBP';

const DEFAULT_CURRENCY: Currency = 'USD';

// Fallback formatter for server-side rendering or when the context is not available
const fallbackFormat = (amount: number, showCurrency: boolean = true): string => {
  return new Intl.NumberFormat('en-US', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function useCurrencyFormat() {
  const [isMounted, setIsMounted] = useState(false);
  const currencyContext = useCurrency();
  
  // Ensure we're on the client before using the context
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format a price with the selected currency
  const format = (amount: number, showCurrency = true): string => {
    if (!isMounted || !currencyContext) {
      return fallbackFormat(amount, showCurrency);
    }
    return currencyContext.formatPrice(amount, showCurrency);
  };
  
  // Format a price range (e.g., "$100 - $200")
  const formatRange = (min: number, max: number, showCurrency = true): string => {
    if (!isMounted || !currencyContext) {
      return `${fallbackFormat(min, showCurrency)} - ${fallbackFormat(max, showCurrency)}`;
    }
    return `${currencyContext.formatPrice(min, showCurrency)} - ${currencyContext.formatPrice(max, showCurrency)}`;
  };
  
  // Format a price per night (e.g., "From $100 / night")
  const formatPerNight = (amount: number, showCurrency = true): string => {
    if (!isMounted || !currencyContext) {
      return `From ${fallbackFormat(amount, showCurrency)} / night`;
    }
    return `From ${currencyContext.formatPrice(amount, showCurrency)} / night`;
  };
  
  return {
    format,
    formatRange,
    formatPerNight,
  };
}
