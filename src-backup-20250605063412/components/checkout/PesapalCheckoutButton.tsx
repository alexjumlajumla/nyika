'use client';

import { ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

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
  phone: string;
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
  phone,
  onSuccess,
  onError,
  disabled = false,
  className = '',
  children,
}: PesapalCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = async () => {
    if (disabled || !reference) return;
    
    setIsLoading(true);
    
    try {
      // First, create a booking record in our database
      const bookingResponse = await axios.post('/api/bookings', {
        tourId: reference.split('-')[1], // Extract tour ID from reference
        date: new Date().toISOString(), // Should be replaced with actual booking date
        guests: 1, // Should be replaced with actual guest count
        totalAmount: amount,
        status: 'PENDING',
        paymentMethod: 'PESAPAL',
        paymentReference: reference,
        customerEmail: email,
        customerName: `${firstName} ${lastName}`.trim(),
        customerPhone: phone,
      });

      if (!bookingResponse.data?.id) {
        throw new Error('Failed to create booking record');
      }

      // Then create the Pesapal order
      const { data } = await axios.post('/api/pesapal/create-order', {
        amount,
        description,
        reference,
        email,
        firstName,
        lastName,
        phone,
        bookingId: bookingResponse.data.id, // Link to our booking record
      });

      if (!data.redirectUrl) {
        throw new Error('No redirect URL received from payment provider');
      }

      // Open Pesapal checkout in a new window
      const newWindow = window.open('', 'Pesapal Checkout', 
        'width=600,height=700,resizable=yes,scrollbars=yes,status=yes');
      
      if (!newWindow) {
        throw new Error('Popup was blocked. Please allow popups for this website.');
      }
      
      // Redirect the new window to the Pesapal checkout
      newWindow.location.href = data.redirectUrl;
      
      // Handle payment status check
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        try {
          const message = event.data as PesapalPaymentStatusMessage;
          if (message.type === 'PESAPAL_PAYMENT_STATUS') {
            const { status, orderId } = message;
            
            if (status === 'COMPLETED') {
              onSuccess();
              toast.success('Payment completed successfully!');
            } else if (status === 'FAILED') {
              onError('Payment failed. Please try again.');
              toast.error('Payment failed. Please try again.');
            } else if (status === 'CANCELLED') {
              onError('Payment was cancelled.');
            }
            
            // Clean up event listener
            window.removeEventListener('message', handleMessage);
          }
        } catch (error) {
          console.error('Error processing payment status message:', error);
        }
      };
      
      // Listen for payment status messages
      window.addEventListener('message', handleMessage);
      
      // Also check if window is closed without completing payment
      const checkWindow = setInterval(() => {
        try {
          if (newWindow.closed) {
            clearInterval(checkWindow);
            window.removeEventListener('message', handleMessage);
            
            // If we get here and haven't received a success message,
            // we'll assume the payment was cancelled
            if (!document.hasFocus()) {
              onError('Payment was cancelled or the window was closed.');
            }
          }
        } catch (error) {
          console.error('Error checking window status:', error);
          clearInterval(checkWindow);
        }
      }, 1000);
      
      // Clean up interval on component unmount
      return () => {
        clearInterval(checkWindow);
        window.removeEventListener('message', handleMessage);
      };
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.';
      toast.error(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || disabled}
      className={`rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white 
        transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 
        focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        'Pay with Pesapal'
      )}
    </button>
  );
}
