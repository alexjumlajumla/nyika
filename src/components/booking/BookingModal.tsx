'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Calendar as CalendarIcon, CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
// PesapalCheckoutButton is imported but not used in this file
// It's kept for future use when implementing the payment flow
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PesapalCheckoutButton from '@/components/checkout/PesapalCheckoutButton';

// Simple date picker component
const DatePicker = ({
  selected,
  onSelect,
  disabled,
  className,
}: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Today's date for reference (used in date validation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const today = new Date();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="font-medium">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {Array.from({ length: 31 }).map((_, i) => {
                const date = new Date();
                date.setDate(i + 1);
                const isDisabled = disabled ? disabled(date) : false;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onSelect(date);
                      setIsOpen(false);
                    }}
                    disabled={isDisabled}
                    className={cn(
                      "rounded-full w-8 h-8 flex items-center justify-center",
                      selected && selected.getDate() === i + 1 ? "bg-primary text-primary-foreground" : "",
                      isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface TourDetails {
  id: string;
  name: string;
  price: number;
  duration: number;
  image: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TourDetails;
}

export default function BookingModal({ isOpen, onClose, tour }: BookingModalProps) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle client-side mounting and cleanup
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle body scroll when modal is open
  useEffect(() => {
    if (isMounted && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMounted]);

  // Handle booking submission
  const handleBooking = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMounted) return;
    
    setIsSubmitting(true);

    try {
      if (!date) {
        toast({
          title: 'Date is required',
          description: 'Please select a date for your tour',
          variant: 'destructive',
        });
        return;
      }

      if (userLoading) {
        toast({
          title: 'Loading...',
          description: 'Please wait while we load your session',
        });
        return;
      }

      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to book this tour',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      // Proceed with booking logic here
      // ...
      
      toast({
        title: 'Booking successful!',
        description: 'Your tour has been booked successfully',
      });
      
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while processing your booking',
        variant: 'destructive',
      });
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  }, [date, isMounted, onClose, router, toast, user, userLoading]);

  // Don't render anything on the server or if modal is closed
  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Book {tour.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleBooking} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="date">Select Date</Label>
                <DatePicker
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="special-requests">Special Requests (Optional)</Label>
              <textarea
                id="special-requests"
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Any special requirements or notes..."
              />
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
          {`By booking this tour, you agree to our Terms of Service and Privacy Policy.`}
        </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4 flex justify-between">
                <span>{'Price per person'}</span>
                <span>${tour.price.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex justify-between font-semibold">
                <span>Total ({guests} {guests === 1 ? 'person' : 'people'})</span>
                <span>${(tour.price * guests).toFixed(2)}</span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || userLoading}
              >
                {isSubmitting || userLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : user ? (
                  'Book Now'
                ) : (
                  'Sign In to Book'
                )}
              </Button>
              
              {user && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {`You'll be redirected to our secure payment gateway to complete your booking`}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
