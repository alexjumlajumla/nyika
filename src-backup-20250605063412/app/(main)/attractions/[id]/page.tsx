import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import Link from 'next/link';

// Mock function to fetch attraction data
export async function getAttraction(id: string) {
  const attractions = [
    {
      id: '1',
      name: 'Great Wildebeest Migration',
      location: 'Masai Mara, Kenya / Serengeti, Tanzania',
      description: 'The Great Wildebeest Migration is one of the most spectacular natural events on Earth, where over two million wildebeest, zebras, and gazelles make a circular 1,200-mile journey through the Serengeti and Masai Mara ecosystems in search of fresh grazing and water.',
      longDescription: `
        <p>The Great Migration is a continuous, year-round journey where wildebeest, zebra, and other herbivores follow an age-old route in search of fresh grazing and water. This incredible natural phenomenon is driven by rainfall patterns and the resulting growth of new grass.</p>
        
        <h3 class="text-xl font-semibold mt-6 mb-3">The Migration Cycle</h3>
        <p>From December to March, the herds gather in the southern Serengeti and Ngorongoro Conservation Area, where the wildebeest calving season occurs. This is when approximately 400,000 wildebeest are born within a 2-3 week period.</p>
        
        <p>As the rains end in May, the herds begin moving northwest into the central and western Serengeti. By July, they face their first major obstacle: crossing the Grumeti River, where crocodiles lie in wait.</p>
        
        <p>From August to October, the migration reaches the northern Serengeti and crosses into Kenya's Masai Mara, where they must cross the treacherous Mara River. This is often considered the most dramatic part of the migration, as crocodiles and strong currents make the crossing extremely dangerous.</p>
        
        <p>When the short rains begin in November, the herds start their journey back south to the Serengeti, completing the annual cycle.</p>
      `,
      image: '/images/attractions/migration-hero.jpg',
      gallery: [
        '/images/attractions/migration-1.jpg',
        '/images/attractions/migration-2.jpg',
        '/images/attractions/migration-3.jpg',
        '/images/attractions/migration-4.jpg',
      ],
      bestTime: 'July to October',
      difficulty: 'Easy',
      duration: '2-3 hours to full day',
      rating: 4.9,
      reviews: 128,
      category: 'Wildlife',
      highlights: [
        'Witness the dramatic river crossings',
        'See predators in action',
        'Experience the vast herds on the move',
        'Excellent photographic opportunities',
        'Expert guides with in-depth knowledge'
      ],
      tips: [
        'Book early as this is peak season',
        'Bring binoculars and a good camera with zoom lens',
        'Wear neutral-colored clothing',
        'Be prepared for early morning starts',
        'Pack for all weather conditions'
      ],
      nearbyAttractions: [
        { id: '2', name: 'Masai Mara National Reserve', image: '/images/attractions/masai-mara.jpg' },
        { id: '3', name: 'Serengeti National Park', image: '/images/attractions/serengeti.jpg' },
        { id: '4', name: 'Ngorongoro Crater', image: '/images/attractions/ngorongoro.jpg' }
      ]
    }
  ];

  return attractions.find(attraction => attraction.id === id) || null;
}

export default async function AttractionDetailPage({ params }: { params: { id: string } }) {
  const attraction = await getAttraction(params.id);

  if (!attraction) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link 
          href="/attractions" 
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Attractions
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative mt-4 h-96 md:h-[500px]">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent"></div>
        <img 
          src={attraction.image} 
          alt={attraction.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white md:p-12">
          <div className="mx-auto max-w-4xl">
            <span className="mb-4 inline-block rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-white">
              {attraction.category}
            </span>
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">{attraction.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{attraction.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Best time: {attraction.bestTime}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{attraction.duration}</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{attraction.rating} ({attraction.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Overview</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: attraction.longDescription }}
              />
            </section>

            {/* Gallery */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">Gallery</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {attraction.gallery.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={`${attraction.name} ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Highlights</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {attraction.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Travel Tips */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Travel Tips</h2>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="mb-3 text-lg font-semibold">Make the Most of Your Visit</h3>
                <ul className="space-y-2">
                  {attraction.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Now Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Experience This Attraction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Select Date</label>
                    <input 
                      type="date" 
                      className="w-full rounded-lg border p-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Number of Travelers</label>
                    <select className="w-full rounded-lg border p-2">
                      <option>1 Traveler</option>
                      <option>2 Travelers</option>
                      <option>3-5 Travelers</option>
                      <option>6+ Travelers</option>
                    </select>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Enquire Now
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Free cancellation up to 24 hours before
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Book With Us */}
            <Card>
              <CardHeader>
                <CardTitle>Why Book With Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: '✓', text: 'Best Price Guarantee' },
                  { icon: '✓', text: 'No Booking Fees' },
                  { icon: '✓', text: 'Local Expert Guides' },
                  { icon: '✓', text: 'Small Group Sizes' },
                  { icon: '✓', text: '24/7 Customer Support' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <span className="font-bold text-green-600">{item.icon}</span>
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nearby Attractions */}
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Nearby Attractions</h2>
            <Link href="/attractions" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attraction.nearbyAttractions.map((item) => (
              <Link href={`/attractions/${item.id}`} key={item.id} className="group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg transition-colors group-hover:text-primary">
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
