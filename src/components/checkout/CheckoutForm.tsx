'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useBookingStore } from '@/store/booking';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {}

export function CheckoutForm({}: CheckoutFormProps) {
  const [tour, setTour] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { booking } = useBookingStore();

  // Fetch tour data
  useEffect(() => {
    let isMounted = true;
    
    const fetchTour = async () => {
      try {
        if (typeof booking.tour === 'string') {
          const response = await fetch(`/api/tours/${booking.tour}`);
          const data = await response.json();
          if (isMounted) setTour(data);
        } else if (booking.tour) {
          if (isMounted) setTour(booking.tour);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load tour details:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchTour();
    
    return () => {
      isMounted = false;
    };
  }, [booking.tour]);

  if (isLoading || !tour || !booking.date) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalPrice = tour.price * (booking.guests || 1);
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Summary</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tour Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium">{tour.title}</h3>
            <p className="text-gray-600">Date: {formattedDate}</p>
            <p className="text-gray-600">Guests: {booking.guests || 1}</p>
            <p className="text-gray-600">Duration: {tour.duration} days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${totalPrice}</p>
            <p className="text-sm text-gray-500">Total for {booking.guests || 1} {booking.guests === 1 ? 'guest' : 'guests'}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/checkout/payment')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
