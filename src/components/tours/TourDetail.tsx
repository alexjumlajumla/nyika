'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, MapPin, Clock, Users, Check, X, Loader2,
  ChevronLeft, ChevronRight, CheckCircle, CreditCard, 
  Banknote, Wallet, Smartphone, ArrowRight, Calendar, Users as UsersIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Tour as TourType } from '@/types/tour';

type TabType = 'overview' | 'itinerary' | 'details' | 'reviews';


interface TourDetailProps {
  tour: TourType;
}

export const TourDetail = ({ tour }: TourDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState('pesapal');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const images = tour.images?.length ? tour.images : ['/placeholder-tour.jpg'];
  const subtotal = tour.price * guests;
  const serviceFee = Math.ceil(subtotal * 0.1); // 10% service fee
  const totalPrice = subtotal + serviceFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      // In a real app, you would call your API endpoint to process the payment
      // For PesaPal, you would typically redirect to their payment page
      console.log('Processing payment with PesaPal', {
        amount: totalPrice,
        tourId: tour.id,
        customerDetails: bookingDetails
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to PesaPal payment page (replace with actual implementation)
      // window.location.href = `https://pay.pesapal.com/?amount=${totalPrice}&...`;
      
      // For demo purposes, we'll just show a success message
      alert('Redirecting to PesaPal payment gateway...');
      setIsPaymentModalOpen(false);
      setIsBookingModalOpen(false);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const ImageGallery = () => (
    <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden">
      <Image
        src={images[currentImageIndex]}
        alt={`${tour.title} - Photo ${currentImageIndex + 1}`}
        fill
        className="object-cover"
        priority
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-md"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );

  const Thumbnails = () => (
    <div className="flex gap-2 mt-3 overflow-x-auto">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`h-16 w-20 flex-shrink-0 rounded-md overflow-hidden transition-opacity ${
            index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
          }`}
          aria-label={`View image ${index + 1}`}
        >
          <Image
            src={img}
            alt=""
            width={80}
            height={64}
            className="object-cover h-full w-full"
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">About {tour.title}</h2>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {tour.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              {tour.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{tour.rating.toFixed(1)}</span>
                  {tour.reviewCount && (
                    <span className="text-gray-500 ml-1">({tour.reviewCount})</span>
                  )}
                </div>
              )}
              {tour.destination && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-1" />
                  <span>{tour.destination}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-1" />
                <span>{tour.duration} days</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-1" />
                <span>Max {tour.maxGroupSize}</span>
              </div>
            </div>
            
            <ImageGallery />
            <Thumbnails />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
            <TabsList className="grid w-full grid-cols-4">
              {(['overview', 'itinerary', 'details', 'reviews'] as TabType[]).map((tab) => (
                <TabsTrigger key={tab} value={tab} className="capitalize">
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <h3 className="text-lg font-semibold">Tour Overview</h3>
              <p className="text-gray-700">{tour.description}</p>
              
              {tour.highlights?.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-900">{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="itinerary" className="mt-6 space-y-6">
              {tour.itinerary.map((day) => (
                <Card key={day.day} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 py-3">
                    <h3 className="font-semibold">Day {day.day}: {day.title}</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    {day.description && (
                      <p className="mb-3">{day.description}</p>
                    )}
                    {day.meals?.length ? (
                      <div className="mt-2">
                        <h4 className="font-medium">Meals:</h4>
                        <ul className="list-disc ml-5">
                          {day.meals.map((meal, i) => (
                            <li key={i}>{meal}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Included</h3>
                  <ul className="space-y-2">
                    {tour.included?.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Not Included</h3>
                  <ul className="space-y-2">
                    {tour.excluded?.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Card */}
        <div className="lg:sticky lg:top-8 h-fit">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold">{formatPrice(tour.price)}</p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
                {tour.originalPrice && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(tour.originalPrice)}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      Save {Math.round((1 - tour.price / tour.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Travelers</label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="rounded-none"
                  >
                    -
                  </Button>
                  <span className="flex-1 text-center">{guests}</span>
                  <Button
                    variant="ghost"
                    onClick={() => setGuests(Math.min(tour.maxGroupSize, guests + 1))}
                    className="rounded-none"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>{guests} × {formatPrice(tour.price)}</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Free cancellation up to 24 hours before
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Complete Your Booking</DialogTitle>
            <DialogDescription className="text-gray-600">
              Review your tour details and fill in your information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tour Details */}
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Tour Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{tour.title}</h4>
                    <p className="text-sm text-gray-600">{tour.duration} days</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !selectedDate && 'text-muted-foreground'
                            )}
                          >
                            {selectedDate ? (
                              format(selectedDate, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={(date) => {
                              setSelectedDate(date || null);
                              setIsDatePickerOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="rounded-none h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{guests}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setGuests(Math.min(tour.maxGroupSize, guests + 1))}
                          className="rounded-none h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                      <span className="ml-2 text-gray-500 text-xs">Max {tour.maxGroupSize} people</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Price Summary */}
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-4">Price Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{guests} × {formatPrice(tour.price)}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service fee</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </Card>

              {/* Personal Information */}
              <Card className="p-4 md:col-span-2">
                <h3 className="font-semibold text-lg mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={bookingDetails.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={bookingDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={bookingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows={3}
                      value={bookingDetails.specialRequests}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="px-8">
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Method Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Select Payment Method</DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose how you'd like to pay for your booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Payment Options</h3>
              <RadioGroup 
                value={activePaymentMethod} 
                onValueChange={setActivePaymentMethod}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="pesapal" id="pesapal" className="text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="pesapal" className="flex items-center cursor-pointer">
                      <div className="bg-blue-50 p-2 rounded-md mr-3">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">PesaPal</p>
                        <p className="text-sm text-gray-500">Pay securely via PesaPal</p>
                      </div>
                    </Label>
                  </div>
                  <img 
                    src="/pesapal-logo.png" 
                    alt="PesaPal" 
                    className="h-8 w-auto opacity-80"
                    onError={(e) => {
                      // Fallback if logo is not found
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="mpesa" id="mpesa" className="text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="mpesa" className="flex items-center cursor-pointer">
                      <div className="bg-green-50 p-2 rounded-md mr-3">
                        <Smartphone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-gray-500">Pay via M-Pesa (Coming Soon)</p>
                      </div>
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary transition-colors">
                  <RadioGroupItem value="bank" id="bank" className="text-primary" />
                  <div className="flex-1">
                    <Label htmlFor="bank" className="flex items-center cursor-pointer">
                      <div className="bg-purple-50 p-2 rounded-md mr-3">
                        <Banknote className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-gray-500">Direct bank transfer (Coming Soon)</p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total to pay</p>
                  <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
                </div>
                <Button 
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="px-8 py-6 text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay Now with PesaPal'
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};