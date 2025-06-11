import { notFound, redirect } from 'next/navigation';
import { getTourBySlug } from '@/lib/supabase/tours';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CheckoutFormWrapper } from '@/components/checkout/CheckoutFormWrapper';


export const metadata = {
  title: 'Book Your Tour - Nyika Safaris',
  description: 'Complete your booking for this amazing experience.',
};

export default async function BookTourPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/auth/signin?redirectTo=/tours/${params.slug}/book`);
  }

  // Get the tour data by slug
  const tour = await getTourBySlug(params.slug);
  
  if (!tour) {
    return notFound();
  }

  // Get booking data from cookies or session
  let bookingData = null;
  try {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .eq('tour_id', tour.id)
      .order('created_at', { ascending: false })
      .single();
    
    bookingData = data;
  } catch (error) {
    // In a production app, you would log this to an error reporting service
    // For now, we'll just log to the console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching booking data:', error);
    }
    // Optionally set an error state that can be displayed to the user
  }

  const bookingDate = bookingData?.date || new Date().toISOString();
  const guestCount = bookingData?.guests || 1;
  const serviceFee = 50; // Fixed service fee
  const pricePerPerson = bookingData?.total_price ? bookingData.total_price / Math.max(1, bookingData.guests || 1) : tour.price;
  const subtotal = pricePerPerson * guestCount;

  if (!bookingDate) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">Booking session expired. Please select your date and try again.</p>
        <Button 
          variant="link" 
          className="mt-4"
          onClick={() => window.history.back()}
          type="button"
        >
          ← Back to Tour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Tour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{tour.title}</h3>
                    <p className="text-muted-foreground">
                      {format(new Date(bookingDate), 'MMMM d, yyyy')} • {tour.duration} days
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Booking Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p>{format(new Date(bookingDate), 'MMMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Guests</p>
                        <p>{guestCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            
            <Card>
              <CardHeader>
                <CardTitle>Traveler Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutFormWrapper />
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>1 × {tour.title}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>$50.00</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(subtotal + serviceFee).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our customer service team is available 24/7 to assist you with any questions or special requests.
                </p>
                <a href="mailto:support@nyikasafaris.com" className="text-primary hover:underline">
                  Contact Support
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
