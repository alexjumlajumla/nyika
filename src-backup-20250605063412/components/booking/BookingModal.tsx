'use client';

import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Users, CreditCard, Loader2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import PesapalCheckoutButton from '@/components/checkout/PesapalCheckoutButton';

// Simple date picker component since we don't have the Calendar component
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
  
  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i + 1);
    return date;
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !selected && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid max-h-[300px] grid-cols-1 gap-1 overflow-y-auto p-2">
          {next30Days.map((date) => {
            const isDisabled = disabled ? disabled(date) : false;
            const isSelected = selected && date.toDateString() === selected.toDateString();
            
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? 'default' : 'ghost'}
                disabled={isDisabled}
                onClick={() => {
                  onSelect(date);
                  setIsOpen(false);
                }}
                className="justify-start text-left"
              >
                {format(date, 'PPP')}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: {
    id: string;
    name: string;
    price: number;
    duration: number;
    image: string;
  };
}

export function BookingModal({ isOpen, onClose, tour }: BookingModalProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guestCount, setGuestCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(tour.price);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateTotalPrice = (guests: number) => {
    return tour.price * guests;
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    setGuestCount(Math.max(1, value));
    setTotalPrice(calculateTotalPrice(value));
  };

  const handleSubmit = async () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive',
      });
      return;
    }

    if (status === 'unauthenticated') {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to continue with your booking',
        variant: 'default',
      });
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful',
      description: 'Your booking has been confirmed!',
      variant: 'default',
    });
    onClose();
    router.push('/bookings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Complete Your Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Left Side - Booking Form */}
          <div>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Tour Details</h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium">{tour.name}</h4>
                  <p className="text-sm text-gray-600">{tour.duration}-day tour</p>
                </div>
              </div>

              <div>
                <Label htmlFor="date" className="mb-2 block">
                  Select Date
                </Label>
                <DatePicker
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <Label htmlFor="guests" className="mb-2 block">
                  Number of Guests
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={handleGuestChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={session?.user?.email || ''}
                      placeholder="your@email.com"
                      disabled={isLoading || !!session?.user?.email}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-2 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+123 456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tour Price</span>
                <span>${tour.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests</span>
                <span>x{guestCount}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="w-full">
                <PesapalCheckoutButton
                  amount={totalPrice}
                  description={`Booking for ${tour.name}`}
                  reference={`TOUR-${tour.id}-${Date.now()}`}
                  email={session?.user?.email || ''}
                  firstName={session?.user?.name?.split(' ')[0] || ''}
                  lastName={session?.user?.name?.split(' ')[1] || ''}
                  phone={phone}
                  onSuccess={handlePaymentSuccess}
                  onError={(error: string) => {
                    toast({
                      title: 'Payment Error',
                      description: error || 'An error occurred during payment',
                      variant: 'destructive',
                    });
                  }}
                  disabled={!date || isLoading || !phone}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay with Pesapal (${totalPrice.toFixed(2)})
                    </>
                  )}
                </PesapalCheckoutButton>
              </div>
              
              <p className="mt-2 text-center text-xs text-gray-500">
                Secure payment powered by Pesapal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
