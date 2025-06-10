'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

// Exchange rates (these would typically come from an API in production)
const EXCHANGE_RATES: Record<Currency, number> = {
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
  
  // Initialize currency from URL or default
  const updateCurrencyFromUrl = useCallback(() => {
    if (searchParams?.has('currency')) {
      const urlCurrency = searchParams.get('currency') as Currency;
      if (urlCurrency && urlCurrency !== currency) {
        setCurrencyState(urlCurrency);
      }
    }
  }, [searchParams, currency]);

  // Update URL when currency changes
  const updateUrlForCurrency = useCallback(() => {
    if (searchParams && pathname) {
      const params = new URLSearchParams(searchParams.toString());
      if (currency !== initialCurrency) {
        params.set('currency', currency);
      } else {
        params.delete('currency');
      }
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [currency, pathname, router, searchParams, initialCurrency]);

  useEffect(() => {
    updateCurrencyFromUrl();
  }, [updateCurrencyFromUrl]);

  useEffect(() => {
    updateUrlForCurrency();
  }, [updateUrlForCurrency]);

  const convertPrice = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // First convert to USD, then to target currency
    const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
    return amountInUSD * EXCHANGE_RATES[toCurrency];
  };

  const formatPrice = (amount: number, showCurrency = true): string => {
    const convertedAmount = convertPrice(amount, 'USD', currency);
    
    const formatter = new Intl.NumberFormat(getLocaleFromCurrency(currency), {
      style: showCurrency ? 'currency' : 'decimal',
      currency,
      minimumFractionDigits: currency === 'TZS' ? 0 : 2,
      maximumFractionDigits: currency === 'TZS' ? 0 : 2,
    });
    
    return formatter.format(convertedAmount);
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
        exchangeRates: EXCHANGE_RATES,
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
