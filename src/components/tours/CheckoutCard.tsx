'use client';

import { useState } from 'react';
import { Calendar, Users, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TourType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGroupSize: number;
}

interface CheckoutCardProps {
  price: number;
  tourTypes: TourType[];
  availableDates: string[];
  onBook: (data: { date: string; participants: number; tourType: string }) => void;
}

export default function CheckoutCard({ price, tourTypes, availableDates, onBook }: CheckoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(2);
  const [selectedTourType, setSelectedTourType] = useState(tourTypes[0].id);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const selectedTour = tourTypes.find(tour => tour.id === selectedTourType) || tourTypes[0];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    setIsBooking(true);
    
    // Simulate API call
    setTimeout(() => {
      onBook({
        date: selectedDate,
        participants,
        tourType: selectedTourType
      });
      setIsBooked(true);
      setIsBooking(false);
    }, 1500);
  };

  if (isBooked) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Booking Confirmed!</h3>
        <p className="mb-6 text-gray-600">Your tour has been successfully booked. We've sent the details to your email.</p>
        <Button className="w-full" onClick={() => setIsBooked(false)}>
          Make Another Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">From ${price}</h2>
            <p className="text-gray-500">per person</p>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-1 h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">Free cancellation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Select Date</label>
            <div className="relative">
              <select
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
              >
                <option value="">Choose a date</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Participants</label>
            <div className="relative">
              <select
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="focus:ring-primary-500 focus:border-primary-500 w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-6 flex w-full items-center justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>View pricing options</span>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>

          {isExpanded && (
            <div className="animate-fadeIn space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tour Type</label>
                <div className="grid gap-4">
                  {tourTypes.map((tour) => (
                    <div 
                      key={tour.id}
                      onClick={() => setSelectedTourType(tour.id)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        selectedTourType === tour.id
                          ? 'border-primary-500 bg-primary-50 ring-primary-200 ring-2'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{tour.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">{tour.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${tour.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 font-medium text-gray-900">Price Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">${selectedTour.price} × {participants} {participants === 1 ? 'person' : 'people'}</span>
                    <span className="font-medium">${selectedTour.price * participants}</span>
                  </div>
                  <div className="my-2 border-t border-gray-200"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${selectedTour.price * participants}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="mt-4 w-full py-4 text-lg font-medium"
            disabled={!selectedDate || isBooking}
          >
            {isBooking ? 'Processing...' : 'Book Now'}
          </Button>
        </form>
      </div>
    </div>
  );
}
