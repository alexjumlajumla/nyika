'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { cn } from '@/lib/utils';

interface PerNightDisplayProps {
  amount: number;
  className?: string;
  showPerNight?: boolean;
}

export function PerNightDisplay({ 
  amount, 
  className = '',
  showPerNight = true 
}: PerNightDisplayProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <span className={cn('whitespace-nowrap', className)}>
      {formatPrice(amount, true)}
      {showPerNight && <span className="text-sm text-gray-500"> / night</span>}
    </span>
  );
}
