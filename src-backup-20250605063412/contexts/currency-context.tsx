'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import currency from 'currency.js';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES' | 'TZS';

export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling' },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling' },
} as const;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convert: (amount: number, from?: CurrencyCode, to?: CurrencyCode) => number;
  format: (amount: number, from?: CurrencyCode) => string;
  symbol: string;
  rates: Record<CurrencyCode, number>;
  isLoading: boolean;
}

const defaultRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  KES: 130.5,
  TZS: 2500,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(defaultRates);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch latest rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // In production, use ExchangeRate.host API
        // const response = await fetch('https://api.exchangerate.host/latest?base=USD');
        // const data = await response.json();
        // setRates(prev => ({
        //   ...prev,
        //   ...data.rates,
        // }));
        
        // For demo, use static rates with a small random fluctuation
        const now = new Date();
        const hour = now.getHours();
        const fluctuation = 1 + (Math.sin(hour) * 0.02); // Small daily fluctuation
        
        setRates({
          USD: 1,
          EUR: 0.92 * fluctuation,
          GBP: 0.79 * fluctuation,
          KES: 130.5 * fluctuation,
          TZS: 2500 * fluctuation,
        });
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
    // Refresh rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convert = (
    amount: number, 
    from: CurrencyCode = 'USD',
    to: CurrencyCode = currentCurrency
  ): number => {
    if (from === to) return amount;
    const amountInUSD = currency(amount).divide(rates[from] || 1);
    return amountInUSD.multiply(rates[to]).value;
  };

  const format = (amount: number, from: CurrencyCode = 'USD'): string => {
    const value = convert(amount, from);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: currentCurrency,
        setCurrency: (code) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('preferred_currency', code);
          }
          setCurrentCurrency(code);
        },
        convert,
        format,
        symbol: CURRENCIES[currentCurrency].symbol,
        rates,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
