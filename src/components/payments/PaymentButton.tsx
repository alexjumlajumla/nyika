'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  bookingId: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentButton({
  amount,
  bookingId,
  email,
  phone,
  firstName,
  lastName,
  className = '',
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/payments/pesapal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          bookingId,
          email,
          phone,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate payment');
      }

      const { paymentUrl } = await response.json();
      
      // Redirect to PesaPal payment page
      window.location.href = paymentUrl;
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Payment error:', error);
      if (onError) onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay KES ${amount.toLocaleString()}`
      )}
    </Button>
  );
}
