'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type Currency = 'USD' | 'TZS' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number, showCurrency?: boolean) => string;
  convertPrice: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  exchangeRates: Record<Currency, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Default exchange rates (these should be updated from an API in production)
const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  TZS: 2500, // 1 USD = 2500 TZS
  EUR: 0.93, // 1 USD = 0.93 EUR
  GBP: 0.79, // 1 USD = 0.79 GBP
};

interface CurrencyProviderProps {
  children: ReactNode;
  initialCurrency?: Currency;
}

export function CurrencyProvider({ children, initialCurrency = 'USD' }: CurrencyProviderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Get currency from URL or use default
  const urlCurrency = searchParams?.get('currency') as Currency | null;
  const [currency, setCurrencyState] = useState<Currency>(urlCurrency || initialCurrency);
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(DEFAULT_EXCHANGE_RATES);

  // Update URL when currency changes
  useEffect(() => {
    if (searchParams && pathname) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('currency', currency);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [currency, pathname, router, searchParams]);

  // In a real app, you would fetch exchange rates from an API
  useEffect(() => {
    // Example: Fetch exchange rates from an API
    // fetch('https://api.exchangerate-api.com/v4/latest/USD')
    //   .then(res => res.json())
    //   .then(data => {
    //     setExchangeRates({
    //       USD: 1,
    //       TZS: data.rates.TZS || 2500,
    //       EUR: data.rates.EUR || 0.93,
    //       GBP: data.rates.GBP || 0.79,
    //     });
    //   })
    //   .catch(console.error);
  }, []);

  const convertPrice = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // First convert to USD, then to target currency
    const amountInUSD = amount / exchangeRates[fromCurrency];
    return amountInUSD * exchangeRates[toCurrency];
  };

  const formatPrice = (amount: number, showCurrency = true): string => {
    const convertedAmount = convertPrice(amount, 'USD', currency);
    
    const formatter = new Intl.NumberFormat(getLocaleFromCurrency(currency), {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'TZS' ? 0 : 2,
      maximumFractionDigits: currency === 'TZS' ? 0 : 2,
    });
    
    return formatter.format(convertedAmount) + (showCurrency ? '' : '');
  };

  const getLocaleFromCurrency = (curr: Currency): string => {
    switch (curr) {
      case 'USD':
        return 'en-US';
      case 'EUR':
        return 'de-DE';
      case 'GBP':
        return 'en-GB';
      case 'TZS':
        return 'sw-TZ';
      default:
        return 'en-US';
    }
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        exchangeRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
