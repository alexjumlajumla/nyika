'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays, differenceInDays, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, User, Mail, Phone, Users } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';

// Form validation schema
const bookingFormSchema = z.object({
  checkIn: z.date({
    required_error: 'Check-in date is required',
  }),
  checkOut: z.date({
    required_error: 'Check-out date is required',
  }),
  adults: z.coerce.number({
    required_error: 'Number of adults is required',
  }).min(1, 'At least 1 adult is required'),
  children: z.coerce.number({
    required_error: 'Number of children is required',
  }).min(0, 'Number of children must be non-negative'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  specialRequests: z.string().optional(),
}).refine((data) => {
  if (!data.checkIn || !data.checkOut) return true;
  return isBefore(data.checkIn, data.checkOut);
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type BookingFormProps = {
  accommodationId: string;
  accommodationName: string;
  accommodationLocation: string;
  pricePerNight: number;
  maxGuests: number;
  onSuccess?: (bookingId: string) => void;
  className?: string;
};

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export function BookingForm({
  accommodationId,
  accommodationName,
  accommodationLocation,
  pricePerNight,
  maxGuests,
  onSuccess,
  className = '',
}: BookingFormProps) {
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [nights, setNights] = useState(1);
  const [totalAmount, setTotalAmount] = useState(pricePerNight);
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      adults: 1,
      children: 0,
      specialRequests: '',
      checkIn: addDays(new Date(), 1),
      checkOut: addDays(new Date(), 2),
    },
  });

  const checkIn = form.watch('checkIn');
  const checkOut = form.watch('checkOut');
  const adults = form.watch('adults') || 0;
  const children = form.watch('children') || 0;
  const totalGuests = adults + children;

  // Calculate nights and total when dates or guests change
  useEffect(() => {
    if (checkIn && checkOut && checkOut > checkIn) {
      const calculatedNights = differenceInDays(checkOut, checkIn);
      const calculatedTotal = calculatedNights * pricePerNight * (totalGuests || 1);
      
      if (calculatedNights !== nights) {
        setNights(calculatedNights);
      }
      setTotalAmount(calculatedTotal);
    }
  }, [checkIn, checkOut, totalGuests, pricePerNight]);

  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to make a booking');
      }

      // Ensure check-out is after check-in
      if (data.checkOut <= data.checkIn) {
        throw new Error('Check-out date must be after check-in date');
      }

      // Ensure total guests doesn't exceed maximum
      if (totalGuests > maxGuests) {
        throw new Error(`Maximum ${maxGuests} guests allowed for this accommodation`);
      }

      const bookingData = {
        user_id: session.user.id,
        accommodation_id: accommodationId,
        accommodation_name: accommodationName,
        accommodation_location: accommodationLocation,
        check_in: data.checkIn.toISOString(),
        check_out: data.checkOut.toISOString(),
        adults: data.adults,
        children: data.children,
        total_amount: totalAmount,
        status: 'pending',
        guest_name: data.fullName,
        guest_email: data.email,
        guest_phone: data.phone,
        special_requests: data.specialRequests,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Booking successful!',
        description: 'Your booking has been confirmed.',
      });

      if (onSuccess) {
        await onSuccess(booking.id);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Check-in Date */}
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-in</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Check-out Date */}
          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-out</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => 
                        date < new Date() || 
                        (form.getValues('checkIn') ? date <= form.getValues('checkIn') : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Adults */}
          <FormField
            control={form.control}
            name="adults"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Adults</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of adults" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Children */}
          <FormField
            control={form.control}
            name="children"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Children</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of children" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Child' : 'Children'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="John Doe" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Special Requests */}
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special requirements or requests?"
                    className="min-h-[100px]"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price Summary */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h4 className="mb-2 font-medium">Price Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {nights} {nights === 1 ? 'Night' : 'Nights'} × ${pricePerNight}
              </span>
              <span className="text-sm font-medium">${pricePerNight * nights}</span>
            </div>
            {totalGuests > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                </span>
                <span className="text-sm font-medium">
                  ${(totalAmount - (pricePerNight * nights)).toFixed(2)}
                </span>
              </div>
            )}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="bg-safari-brown hover:bg-safari-brown/90 w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Book Now'
          )}
        </Button>
      </form>
    </Form>
  );
}
