'use client';

import { ReactNode, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useUser } from '@/lib/supabase/useUser';

interface PesapalPaymentStatusMessage {
  type: 'PESAPAL_PAYMENT_STATUS';
  status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
  orderId: string;
}

interface PesapalCheckoutButtonProps {
  amount: number;
  description: string;
  reference: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export default function PesapalCheckoutButton({
  amount,
  description,
  reference,
  email,
  firstName,
  lastName,
  phone = '',
  onSuccess,
  onError,
  disabled = false,
  className = '',
  children,
}: PesapalCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const handleCheckout = async () => {
    if (userLoading) {
      toast.loading('Loading user session...');
      return;
    }
    
    if (!user) {
      toast.error('Please sign in to continue with checkout');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/checkout/pesapal', {
        amount,
        description,
        reference,
        email,
        firstName,
        lastName,
        phone,
      });

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      let errorMessage = 'An error occurred during checkout';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || isLoading}
      className={`${className} ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}
