'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import Image from 'next/image';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { useBookingStore } from '@/store/booking';

export function BookingConfirmationModal() {
  const {
    booking,
    isModalOpen,
    closeModal,
    checkAuth,
    redirectToSignIn,
  } = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);

  // If no tour is selected or tour is just an ID, don't render the modal
  if (!booking.tour || typeof booking.tour === 'string') return null;

  const tour = booking.tour;
  const subtotal = tour.price * booking.guests;
  const total = subtotal + booking.serviceFee;
  const mainImage = Array.isArray(tour.images) && tour.images.length > 0 
    ? tour.images[0] 
    : '/images/placeholder-tour.jpg';

  const handleBookNow = async () => {
    setIsLoading(true);
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        redirectToSignIn(`/tours/${tour.id}`);
        return;
      }
      // Handle authenticated booking flow here
      // For now, just close the modal
      closeModal();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error during booking:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 shadow-2xl">
        <style jsx global>{`
          [data-state=open] > [data-radix-dialog-overlay] {
            background-color: transparent !important;
            pointer-events: none;
          }
          [data-state=open] > [data-radix-dialog-content] {
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.1);
            pointer-events: auto;
          }
          .dark [data-state=open] > [data-radix-dialog-content] {
            background-color: rgba(17, 24, 39, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}</style>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Tour Image */}
          <div className="relative h-64 md:h-full">
            <Image
              src={mainImage}
              alt={tour.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Right side - Booking Details */}
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {tour.title}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Tour Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  {tour.destination && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {tour.destination}
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration} days
                  </div>
                  {tour.rating && (
                    <div className="flex items-center text-amber-500">
                      ★ {tour.rating.toFixed(1)}
                      {tour.reviewCount && (
                        <span className="text-muted-foreground ml-1">
                          ({tour.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {format(new Date(booking.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ${tour.price.toFixed(2)} × {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>${booking.serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleBookNow}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Book Now'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-foreground hover:text-foreground border-2 hover:bg-accent/50 transition-colors"
                onClick={closeModal}
              >
                Continue Exploring
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
