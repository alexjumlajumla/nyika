import { notFound } from 'next/navigation';
import { TourDetail } from '@/components/tours/TourDetail';

// Mock data - replace with actual data fetching
const getTourBySlug = async (slug: string) => {
  // This is a mock implementation - replace with your actual data fetching logic
  const tours = [
    {
      id: '1',
      title: 'Wildlife Safari Adventure',
      subtitle: 'Experience the best of African wildlife',
      slug: 'wildlife-safari-adventure',
      destination: 'Masai Mara, Kenya',
      duration: '5 Days / 4 Nights',
      groupSize: '2-12 People',
      price: 2500,
      rating: 4.8,
      reviewCount: 42,
      images: [
        '/images/tours/safari-1.jpg',
        '/images/tours/safari-2.jpg',
        '/images/tours/safari-3.jpg',
      ],
      overview: 'Experience the breathtaking wildlife of Masai Mara in this 5-day safari adventure. Get up close with the Big Five and witness the Great Migration (seasonal).',
      highlights: [
        'Game drives in Masai Mara National Reserve',
        'Visit to Maasai village',
        'Hot air balloon safari (optional)',
        'Professional guide and photographer',
        'Luxury tented accommodation'
      ],
      included: [
        '4 nights accommodation',
        'All meals and drinking water',
        'Park entry fees',
        'Transport in 4x4 safari vehicle',
        'Professional guide'
      ],
      excluded: [
        'International flights',
        'Travel insurance',
        'Tips and gratuities',
        'Personal expenses'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Nairobi',
          description: 'Arrive at Jomo Kenyatta International Airport and transfer to your hotel. Briefing about the safari.'
        },
        {
          day: 2,
          title: 'Nairobi to Masai Mara',
          description: 'Morning drive to Masai Mara with a stop at the Great Rift Valley viewpoint. Afternoon game drive.'
        },
        {
          day: 3,
          title: 'Full Day in Masai Mara',
          description: 'Full day of game viewing in the reserve with picnic lunch by the Mara River.'
        },
        {
          day: 4,
          title: 'Masai Mara Exploration',
          description: 'Early morning game drive followed by a visit to a Maasai village. Afternoon at leisure.'
        },
        {
          day: 5,
          title: 'Return to Nairobi',
          description: 'Morning game drive en route to Nairobi. Transfer to the airport for your departure.'
        }
      ]
    },
    {
      id: '2',
      title: 'Serengeti Great Migration Safari',
      subtitle: 'Witness the greatest wildlife spectacle on earth',
      slug: 'serengeti-migration',
      destination: 'Serengeti, Tanzania',
      duration: '7 Days / 6 Nights',
      groupSize: '2-10 People',
      price: 3800,
      rating: 4.9,
      reviewCount: 65,
      images: [
        '/images/tours/serengeti-1.jpg',
        '/images/tours/serengeti-2.jpg',
        '/images/tours/serengeti-3.jpg',
      ],
      overview: 'Experience the awe-inspiring Great Migration in the Serengeti. Witness millions of wildebeest and zebras cross the plains in search of fresh grazing.',
      highlights: [
        'Witness the Great Migration river crossings',
        'Game drives in Serengeti National Park',
        'Visit Ngorongoro Crater',
        'Hot air balloon safari over the Serengeti',
        'Luxury tented camps with amazing views'
      ],
      included: [
        '6 nights accommodation',
        'All meals and drinking water',
        'Park entry fees and conservation fees',
        'Transport in 4x4 safari vehicle',
        'Professional safari guide',
        'All game drives as per itinerary'
      ],
      excluded: [
        'International flights',
        'Tanzania visa fees',
        'Travel insurance',
        'Tips and gratuities',
        'Personal expenses'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Arusha',
          description: 'Arrive at Kilimanjaro International Airport and transfer to your lodge in Arusha for overnight.'
        },
        {
          day: 2,
          title: 'Arusha to Serengeti',
          description: 'Morning flight to Serengeti. Afternoon game drive in search of the Great Migration herds.'
        },
        {
          day: 3,
          title: 'Full Day Serengeti',
          description: 'Full day of game viewing in the Serengeti, following the Great Migration.'
        },
        {
          day: 4,
          title: 'Serengeti to Ngorongoro',
          description: 'Morning game drive in Serengeti, then drive to Ngorongoro Conservation Area.'
        },
        {
          day: 5,
          title: 'Ngorongoro Crater',
          description: 'Full day game drive in Ngorongoro Crater, home to high concentrations of wildlife.'
        },
        {
          day: 6,
          title: 'Ngorongoro to Arusha',
          description: 'Morning visit to a Maasai village, then return to Arusha for overnight.'
        },
        {
          day: 7,
          title: 'Departure',
          description: 'Transfer to Kilimanjaro International Airport for your departure flight.'
        }
      ]
    }
  ];

  return tours.find(tour => tour.slug === slug) || null;
};

export default async function TourDetailPage({ params }: { params: { slug: string } }) {
  const tour = await getTourBySlug(params.slug);

  if (!tour) {
    notFound();
  }

  return <TourDetail tour={tour} />;
}

export async function generateStaticParams() {
  // This function is used for static generation at build time
  // Return an array of all possible slugs
  return [
    { slug: 'wildlife-safari-adventure' },
    { slug: 'serengeti-migration' },
    // Add more slugs as needed
  ];
}
