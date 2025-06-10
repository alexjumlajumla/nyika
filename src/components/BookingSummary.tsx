'use client';

import { useCurrency } from '@/contexts/CurrencyProvider';
import { format } from 'date-fns';
import { Hotel, Users, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface BookingSummaryProps {
  tour: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  checkIn?: Date;
  checkOut?: Date;
  guestCount: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function BookingSummary({
  tour,
  checkIn,
  checkOut,
  guestCount,
  onSubmit,
  isSubmitting = false,
}: BookingSummaryProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { formatPrice, currency } = useCurrency();

  // Ensure we're on the client before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading booking summary...</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  const getNights = (checkIn: Date, checkOut: Date) => {
    return Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = checkIn && checkOut 
    ? getNights(checkIn, checkOut)
    : 0;

  const subtotal = tour.price * (checkIn && checkOut ? getNights(checkIn, checkOut) : 1) * guestCount;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Format price function for display
  const formatCurrency = (amount: number) => {
    return formatPrice(amount, true);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/90 pb-4 text-white">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Hotel className="h-5 w-5" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{tour.name}</h3>
          <p className="text-muted-foreground">{tour.duration}-day tour</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Dates</p>
              <p className="text-muted-foreground">
                {checkIn && checkOut 
                  ? `${format(checkIn, 'MMM d, yyyy')} - ${format(checkOut, 'MMM d, yyyy')}`
                  : 'Select dates'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Guests</p>
              <p className="text-muted-foreground">
                {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{formatCurrency(tour.price)} × {nights} nights</span>
            <span>{formatCurrency(tour.price * nights)}</span>
          </div>
          {guestCount > 1 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">× {guestCount} guests</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes & Fees</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between pt-2 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={onSubmit} 
          disabled={!checkIn || !checkOut || isSubmitting}
          className="h-12 w-full text-base font-semibold"
        >
          {isSubmitting ? (
            <>
              <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Book Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
