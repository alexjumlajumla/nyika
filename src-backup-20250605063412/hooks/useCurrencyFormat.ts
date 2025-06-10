'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

export function useCurrencyFormat() {
  const { formatPrice } = useCurrency();
  
  // Format a price with the selected currency
  const format = (amount: number, showCurrency = true): string => {
    return formatPrice(amount, showCurrency);
  };
  
  // Format a price range (e.g., "$100 - $200")
  const formatRange = (min: number, max: number, showCurrency = true): string => {
    return `${formatPrice(min, showCurrency)} - ${formatPrice(max, showCurrency)}`;
  };
  
  // Format a price per night (e.g., "From $100 / night")
  const formatPerNight = (amount: number, showCurrency = true): string => {
    return `From ${formatPrice(amount, showCurrency)} / night`;
  };
  
  return {
    format,
    formatRange,
    formatPerNight,
  };
}
