'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);
  const { formatPrice } = useCurrency();
  
  // Ensure we're on the client before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <span className={cn('whitespace-nowrap', className)}>
        ${amount.toFixed(2)}
        {showPerNight && <span className="text-sm text-gray-500"> / night</span>}
      </span>
    );
  }
  
  return (
    <span className={cn('whitespace-nowrap', className)}>
      {formatPrice(amount, true)}
      {showPerNight && <span className="text-sm text-gray-500"> / night</span>}
    </span>
  );
}
