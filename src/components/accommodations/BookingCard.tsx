'use client';

import { useState } from 'react';
import { Calendar, Users, Moon, Sun, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';

interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxOccupancy: number;
  size: string;
  beds: string;
  amenities: string[];
  images: string[];
}

interface BookingCardProps {
  roomTypes: RoomType[];
  onBook: (data: { 
    checkIn: string; 
    checkOut: string; 
    guests: number; 
    roomType: string;
    total: number;
    nights: number;
  }) => void;
}

export default function BookingCard({ roomTypes, onBook }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0].id);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState<string | null>(null);

  const selectedRoom = roomTypes.find(room => room.id === selectedRoomType) || roomTypes[0];
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const total = nights * selectedRoom.price;

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setCheckIn(date);
    
    // Auto-set checkout to next day if not set
    if (date && !checkOut) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    
    setIsBooking(true);
    
    // Simulate API call
    setTimeout(() => {
      onBook({
        checkIn,
        checkOut,
        guests,
        roomType: selectedRoomType,
        total,
        nights
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
        <p className="mb-6 text-gray-600">Your reservation has been successfully made. We've sent the details to your email.</p>
        <Button className="w-full" onClick={() => setIsBooked(false)}>
          Make Another Reservation
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Your Reservation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Check-in</label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={handleCheckInChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
                  required
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Check-out</label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                  className="focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
                  required
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Guests</label>
            <div className="relative">
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="focus:ring-primary-500 focus:border-primary-500 w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <label className="mb-3 block text-sm font-medium text-gray-700">Room Type</label>
            <div className="space-y-3">
              {roomTypes.map((room) => (
                <div key={room.id} className="space-y-2">
                  <div 
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedRoomType === room.id
                        ? 'border-primary-500 bg-primary-50 ring-primary-200 ring-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedRoomType(room.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{room.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{room.beds} • {room.size}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${room.price}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="text-primary-600 hover:text-primary-800 mt-2 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRoomDetails(showRoomDetails === room.id ? null : room.id);
                      }}
                    >
                      {showRoomDetails === room.id ? 'Hide details' : 'View details'}
                    </button>
                  </div>
                  
                  {showRoomDetails === room.id && (
                    <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                      <p>{room.description}</p>
                      <div className="mt-2">
                        <h5 className="mb-1 font-medium text-gray-900">Room Amenities:</h5>
                        <ul className="grid grid-cols-2 gap-1">
                          {room.amenities.map((amenity, i) => (
                            <li key={i} className="flex items-center">
                              <span className="bg-primary-500 mr-2 h-1.5 w-1.5 rounded-full"></span>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {checkIn && checkOut && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-medium text-gray-900">Price Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ${selectedRoom.price} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span>${selectedRoom.price * nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>$0</span>
                </div>
                <div className="my-2 border-t border-gray-200"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="mt-2 w-full py-4 text-lg font-medium"
            disabled={!checkIn || !checkOut || isBooking}
          >
            {isBooking ? 'Processing...' : 'Reserve Now'}
          </Button>
          
          <p className="text-center text-sm text-gray-500">
            You won't be charged yet. Free cancellation up to 14 days before check-in.
          </p>
        </form>
      </div>
    </div>
  );
}
