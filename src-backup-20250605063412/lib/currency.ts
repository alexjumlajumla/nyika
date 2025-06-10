import currency from 'currency.js';

type CurrencyCode = keyof typeof CURRENCY_FORMATS;

const CURRENCY_FORMATS = {
  USD: { symbol: '$', decimal: '.', separator: ',', precision: 2 },
  EUR: { symbol: '€', decimal: ',', separator: '.', precision: 2 },
  GBP: { symbol: '£', decimal: '.', separator: ',', precision: 2 },
  KES: { symbol: 'KSh', decimal: '.', separator: ',', precision: 0 },
  TZS: { symbol: 'TSh', decimal: '.', separator: ',', precision: 0 },
} as const;

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const format = CURRENCY_FORMATS[currencyCode];
  return currency(amount, {
    symbol: format.symbol,
    decimal: format.decimal,
    separator: format.separator,
    precision: format.precision,
  }).format();
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first
  const amountInUSD = amount / (rates[fromCurrency] || 1);
  // Convert to target currency
  return amountInUSD * (rates[toCurrency] || 1);
}

export function formatPrice(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  rates: Record<string, number> = {}
): string {
  if (Object.keys(rates).length > 0) {
    const convertedAmount = convertCurrency(amount, 'USD', currencyCode, rates);
    return formatCurrency(convertedAmount, currencyCode);
  }
  return formatCurrency(amount, currencyCode);
}
