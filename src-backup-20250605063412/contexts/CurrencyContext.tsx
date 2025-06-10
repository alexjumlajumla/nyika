'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'TZS';

// Exchange rates relative to USD (1 USD = X currency)
const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,  // Example rate, replace with real-time rates in production
  GBP: 0.79,  // Example rate, replace with real-time rates in production
  TZS: 2580,  // Example rate, replace with real-time rates in production
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrency?: Currency) => number;
  formatPrice: (price: number, fromCurrency?: Currency, options?: Intl.NumberFormatOptions) => string;
  exchangeRates: Record<Currency, number>;
  getCurrencySymbol: (currencyCode: string) => string;
  getCurrencyName: (currencyCode: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(DEFAULT_EXCHANGE_RATES);
  const { t } = useTranslation('common');

  // Load saved currency from localStorage on initial render
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency | null;
    if (savedCurrency && Object.keys(DEFAULT_EXCHANGE_RATES).includes(savedCurrency)) {
      setCurrency(savedCurrency as Currency);
    }
  }, []);

  // Save currency to localStorage when it changes
  const handleSetCurrency = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  }, []);

  // Fetch exchange rates from an API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // In a real app, replace this with an actual API call
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // setExchangeRates({
        //   USD: 1,
        //   EUR: data.rates.EUR,
        //   GBP: data.rates.GBP,
        //   TZS: data.rates.TZS,
        // });
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchRates();
    // Refresh rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertPrice = useCallback((price: number, fromCurrency: Currency = 'USD'): number => {
    if (fromCurrency === currency) return price;
    const rateFrom = exchangeRates[fromCurrency] || 1;
    const rateTo = exchangeRates[currency] || 1;
    return (price / rateFrom) * rateTo;
  }, [currency, exchangeRates]);

  const formatPrice = useCallback((
    price: number, 
    fromCurrency: Currency = 'USD',
    options: Intl.NumberFormatOptions = {}
  ): string => {
    const convertedPrice = convertPrice(price, fromCurrency);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'TZS' ? 0 : 2,
      maximumFractionDigits: currency === 'TZS' ? 0 : 2,
      ...options,
    }).format(convertedPrice);
  }, [convertPrice, currency]);

  const getCurrencySymbol = useCallback((currencyCode: string): string => {
    try {
      return (0)
        .toLocaleString(undefined, {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        .replace(/[0-9., ]/g, '')
        .trim();
    } catch (error) {
      return currencyCode;
    }
  }, []);

  const getCurrencyName = useCallback((currencyCode: string): string => {
    return t(`currency.${currencyCode}`, { defaultValue: currencyCode });
  }, [t]);

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

  const value = React.useMemo(() => ({
    currency,
    setCurrency: handleSetCurrency,
    convertPrice,
    formatPrice,
    exchangeRates,
    getCurrencySymbol,
    getCurrencyName,
  }), [
    currency, 
    handleSetCurrency, 
    convertPrice, 
    formatPrice, 
    exchangeRates, 
    getCurrencySymbol, 
    getCurrencyName
  ]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook to use the currency context
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Higher-order component for class components
export const withCurrency = <P extends object>(
  WrappedComponent: React.ComponentType<P & { currency: CurrencyContextType }>
) => {
  const WithCurrency: React.FC<P> = (props) => {
    const currency = useCurrency();
    return <WrappedComponent {...props} currency={currency} />;
  };
  return WithCurrency;
};

// Currency selector component
export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const { t } = useTranslation();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as Currency)}
      className="focus:ring-safari-brown rounded-md border border-gray-300 bg-white px-2 py-1 pr-8 text-sm text-gray-700 focus:border-transparent focus:outline-none focus:ring-2"
    >
      <option value="USD">{t('currency.usd')}</option>
      <option value="TZS">{t('currency.tzs')}</option>
      <option value="EUR">{t('currency.eur')}</option>
      <option value="GBP">{t('currency.gbp')}</option>
    </select>
  );
}
