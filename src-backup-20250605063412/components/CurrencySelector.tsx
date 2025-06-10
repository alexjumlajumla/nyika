'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { useTranslation } from 'react-i18next';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const { t } = useTranslation();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as 'USD' | 'TZS' | 'EUR' | 'GBP');
  };

  return (
    <select
      value={currency}
      onChange={handleCurrencyChange}
      className="focus:ring-safari-brown rounded-md border border-gray-300 bg-white px-2 py-1 pr-8 text-sm text-gray-700 focus:border-transparent focus:outline-none focus:ring-2"
      aria-label={t('common.currencySelector')}
    >
      <option value="USD">{t('currency.usd')}</option>
      <option value="TZS">{t('currency.tzs')}</option>
      <option value="EUR">{t('currency.eur')}</option>
      <option value="GBP">{t('currency.gbp')}</option>
    </select>
  );
}
