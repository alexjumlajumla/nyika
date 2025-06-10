import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/hero-section';
import { ArrowRight, MapPin, Star } from 'lucide-react';

interface TourCardProps {
  id: number;
  title: string;
  image: string;
  location: string;
  days: number;
  price: number;
  rating: number;
  width: string;
  height: string;
}

const TourCard: React.FC<TourCardProps> = ({
  id,
  title,
  image,
  location,
  days,
  price,
  rating,
  width,
  height,
}) => (
  <div 
    className={`group relative w-full overflow-hidden rounded-2xl ${width} ${height} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
  >
    <div className="absolute inset-0">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
      <div className="rounded-xl bg-black/30 p-3 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white md:text-xl">{title}</h3>
            <div className="flex items-center text-sm text-white/80">
              <MapPin className="mr-1 h-4 w-4" />
              {location}
            </div>
          </div>
          <div className="flex items-center rounded bg-amber-500 px-2 py-1 text-xs font-medium text-white">
            <Star className="mr-1 h-3 w-3 fill-current" />
            {rating}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-white">${price.toLocaleString()}</span>
          <span className="text-sm text-white/80">{days} days</span>
        </div>
      </div>
    </div>
    <Link 
      href={`/tours/${id}`} 
      className="absolute inset-0 z-10"
      aria-label={`View ${title} details`}
    />
  </div>
);

const featuredTours: TourCardProps[] = [
  {
    id: 1,
    title: 'Masai Mara Safari',
    image: '/images/tours/masai-mara.jpg',
    days: 5,
    price: 2500,
    location: 'Kenya',
    rating: 4.8,
    width: 'md:w-1/2',
    height: 'h-64',
  },
  {
    id: 2,
    title: 'Serengeti Migration',
    image: '/images/tours/serengeti.jpg',
    days: 7,
    price: 3200,
    location: 'Tanzania',
    rating: 4.9,
    width: 'md:w-1/3',
    height: 'h-56',
  },
  {
    id: 3,
    title: 'Gorilla Trekking',
    image: '/images/tours/gorilla.jpg',
    days: 4,
    price: 1800,
    location: 'Rwanda',
    rating: 5.0,
    width: 'md:w-1/4',
    height: 'h-48',
  },
  {
    id: 4,
    title: 'Victoria Falls',
    image: '/images/tours/victoria-falls.jpg',
    days: 3,
    price: 1200,
    location: 'Zambia/Zimbabwe',
    rating: 4.7,
    width: 'md:w-1/3',
    height: 'h-64',
  },
  {
    id: 5,
    title: 'Zanzibar Beach',
    image: '/images/tours/zanzibar.jpg',
    days: 6,
    price: 2100,
    location: 'Tanzania',
    rating: 4.8,
    width: 'md:w-1/4',
    height: 'h-56',
  },
  {
    id: 6,
    title: 'Okavango Delta',
    image: '/images/tours/okavango.jpg',
    days: 8,
    price: 3800,
    location: 'Botswana',
    rating: 4.9,
    width: 'md:w-1/3',
    height: 'h-48',
  },
  {
    id: 7,
    title: 'Mount Kilimanjaro',
    image: '/images/tours/kilimanjaro.jpg',
    days: 9,
    price: 4200,
    location: 'Tanzania',
    rating: 4.9,
    width: 'md:w-1/2',
    height: 'h-64',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Tours Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Safaris</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Discover our most popular safari experiences across Africa&apos;s most iconic destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
              <Link href="/tours" className="flex items-center justify-center">
                View All Safaris
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
