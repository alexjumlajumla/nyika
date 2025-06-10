import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Users, Wifi, Coffee, Utensils, Droplets, Bed, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getAccommodationBySlug } from '../_lib/accommodations';
import { CurrencyDisplay, PerNightDisplay } from '@/components/CurrencyDisplay';

type Params = {
  params: {
    slug: string;
  };
};

export default async function AccommodationDetailPage({ params }: Params) {
  const accommodation = await getAccommodationBySlug(params.slug);

  if (!accommodation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link 
              href="/accommodations" 
              className="text-safari-brown hover:text-safari-brown/80 flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Accommodations
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <Image
          src={accommodation.image}
          alt={accommodation.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end bg-black/30">
          <div className="container mx-auto px-4 pb-8 text-white">
            <div className="max-w-3xl">
              <div className="mb-2 flex items-center">
                <div className="flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                  <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{accommodation.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-sm">{accommodation.reviewCount} reviews</span>
                </div>
                <span className="bg-safari-brown/90 ml-3 rounded-full px-3 py-1 text-sm font-medium text-white">
                  {accommodation.type}
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-bold md:text-5xl">{accommodation.name}</h1>
              <div className="flex items-center text-lg">
                <MapPin className="mr-1.5 h-5 w-5" />
                <span>{accommodation.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left Column */}
          <div className="lg:w-2/3">
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About this accommodation</h2>
              <p className="mb-6 text-gray-700">{accommodation.description}</p>
              
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Amenities</h3>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {amenity.includes('WiFi') && <Wifi className="text-safari-brown mr-2 h-5 w-5" />}
                    {amenity.includes('Restaurant') && <Utensils className="text-safari-brown mr-2 h-5 w-5" />}
                    {amenity.includes('Pool') && <Droplets className="text-safari-brown mr-2 h-5 w-5" />}
                    {amenity.includes('Breakfast') && <Coffee className="text-safari-brown mr-2 h-5 w-5" />}
                    {amenity.includes('Room') && <Bed className="text-safari-brown mr-2 h-5 w-5" />}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="mb-2 flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-500">
                        U{review}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">User {review}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      This was an amazing place to stay! The location was perfect and the amenities were top-notch. 
                      Would definitely recommend to anyone visiting the area.
                    </p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>April 2024</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-6 rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    <PerNightDisplay 
                      amount={accommodation.pricePerNight} 
                      className="text-2xl font-semibold" 
                    />
                  </div>
                  <p className="text-sm text-gray-500">Exclusive of taxes & fees</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{accommodation.rating}</span>
                  <span className="mx-1">•</span>
                  <a href="#reviews" className="text-safari-brown hover:underline">
                    {accommodation.reviewCount} reviews
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="check-in" className="mb-1 block text-sm font-medium text-gray-700">
                      Check-in
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="check-in"
                        className="focus:ring-safari-brown w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="check-out" className="mb-1 block text-sm font-medium text-gray-700">
                      Check-out
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="check-out"
                        className="focus:ring-safari-brown w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="mb-1 block text-sm font-medium text-gray-700">
                    Guests
                  </label>
                  <select
                    id="guests"
                    className="focus:ring-safari-brown w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="bg-safari-brown hover:bg-safari-brown/90 w-full rounded-md px-4 py-3 font-medium text-white transition-colors"
                >
                  Check availability
                </button>

                <div className="text-center text-sm text-gray-500">
                  You won't be charged yet
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">${accommodation.price} x 3 nights</span>
                    <span className="font-medium">${(accommodation.price * 3).toLocaleString()}</span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">$45.00</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>${(accommodation.price * 3 + 45).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const accommodation = await getAccommodationBySlug(params.slug);

  if (!accommodation) {
    return {
      title: 'Accommodation Not Found',
    };
  }

  return {
    title: `${accommodation.name} | Nyika Safaris`,
    description: accommodation.description,
    openGraph: {
      title: accommodation.name,
      description: accommodation.description,
      images: [accommodation.image],
    },
  };
}
