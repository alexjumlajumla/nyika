'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Destination {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  url: string;
  tags?: string[];
  size?: 'small' | 'wide' | 'tall';
  height?: 'sm' | 'md' | 'lg';
};

interface FeaturedDestinationsProps {
  destinations?: Destination[];
}

// Sample images from Unsplash with specific dimensions for better collage effect
const destinationImages = {
  serengeti: 'https://images.unsplash.com/photo-1547471080-7cc2ea01e1d9?w=1200&h=800&fit=crop&crop=entropy&q=80',
  kilimanjaro: 'https://images.unsplash.com/photo-1516026672322-bf52a9c237c3?w=800&h=1200&fit=crop&crop=entropy&q=80',
  zanzibar: 'https://images.unsplash.com/photo-1573848953384-9c8bf42e1a6f?w=1200&h=800&fit=crop&crop=entropy&q=80',
  mara: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=1000&fit=crop&crop=entropy&q=80',
  gorilla: 'https://images.unsplash.com/photo-1529107386315-95f3d5a021dc?w=1000&h=1200&fit=crop&crop=entropy&q=80',
  victoria: 'https://images.unsplash.com/photo-1567596056663-9d3f9f4b0b5e?w=1200&h=800&fit=crop&crop=entropy&q=80',
  namibia: 'https://images.unsplash.com/photo-1509316785289-25f7ec9a0db9?w=800&h=1000&fit=crop&crop=entropy&q=80',
  okavango: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop&crop=entropy&q=80',
  capeTown: 'https://images.unsplash.com/photo-1526771375920-8e63cb42056b?w=1000&h=1200&fit=crop&crop=entropy&q=80',
  kruger: 'https://images.unsplash.com/photo-1533416784636-2b0ccfea6b97?w=1200&h=800&fit=crop&crop=entropy&q=80',
  ngorongoro: 'https://images.unsplash.com/photo-1589985270828-15f25a0ff6a2?w=1200&h=800&fit=crop&crop=entropy&q=80',
  botswana: 'https://images.unsplash.com/photo-1567596056663-9d3f9f4b0b5e?w=1200&h=800&fit=crop&crop=entropy&q=80',
};

const defaultDestinations: Destination[] = [
  // First row - one wide, two tall
  {
    id: '1',
    title: 'Serengeti National Park',
    subtitle: 'Witness the Great Migration',
    image: destinationImages.serengeti,
    url: '/destinations/serengeti',
    tags: ['Safari', 'Wildlife', 'Tanzania'],
    size: 'wide',
    height: 'md'
  },
  {
    id: '2',
    title: 'Mount Kilimanjaro',
    subtitle: 'Conquer Africa\'s Highest Peak',
    image: destinationImages.kilimanjaro,
    url: '/destinations/kilimanjaro',
    tags: ['Trekking', 'Adventure'],
    size: 'tall',
    height: 'lg'
  },
  
  // Second row - one tall, one wide
  {
    id: '3',
    title: 'Zanzibar Beaches',
    subtitle: 'Pristine White Sands & Turquoise Waters',
    image: destinationImages.zanzibar,
    url: '/destinations/zanzibar',
    tags: ['Beach', 'Luxury'],
    size: 'wide',
    height: 'md'
  },
  {
    id: '4',
    title: 'Maasai Mara',
    subtitle: 'The Great Migration Spectacle',
    image: destinationImages.mara,
    url: '/destinations/maasai-mara',
    tags: ['Safari', 'Wildlife'],
    size: 'tall',
    height: 'lg'
  },
  
  // Third row - one wide, one tall
  {
    id: '5',
    title: 'Bwindi Forest',
    subtitle: 'Home of the Mountain Gorillas',
    image: destinationImages.gorilla,
    url: '/destinations/bwindi',
    tags: ['Gorilla Trekking'],
    size: 'wide',
    height: 'md'
  },
  {
    id: '6',
    title: 'Victoria Falls',
    subtitle: 'The Smoke That Thunders',
    image: destinationImages.victoria,
    url: '/destinations/victoria-falls',
    tags: ['Waterfalls', 'Adventure'],
    size: 'tall',
    height: 'lg'
  },
  
  // Fourth row - two small, one wide
  {
    id: '7',
    title: 'Namib Desert',
    subtitle: 'Ancient Dunes & Starry Skies',
    image: destinationImages.namibia,
    url: '/destinations/namib-desert',
    tags: ['Desert', 'Landscape'],
    size: 'small',
    height: 'sm'
  },
  {
    id: '8',
    title: 'Okavango Delta',
    subtitle: 'Water in the Desert',
    image: destinationImages.okavango,
    url: '/destinations/okavango',
    tags: ['Delta', 'Wildlife'],
    size: 'small',
    height: 'sm'
  },
  {
    id: '9',
    title: 'Cape Town',
    subtitle: 'Where Mountains Meet the Sea',
    image: destinationImages.capeTown,
    url: '/destinations/cape-town',
    tags: ['City', 'Beach', 'Mountain'],
    size: 'wide',
    height: 'md'
  }
];

const FeaturedDestinations = ({ destinations = defaultDestinations }: FeaturedDestinationsProps) => {
  // Grid layout configuration
  const getGridClasses = (size: string) => {
    switch (size) {
      case 'wide':
        return 'md:col-span-2';
      case 'tall':
        return 'md:row-span-2';
      case 'small':
      default:
        return 'md:col-span-1';
    }
  };

  // Height configuration
  const getHeightClasses = (height: string) => {
    switch (height) {
      case 'sm':
        return 'h-[250px]';
      case 'lg':
        return 'h-[500px]';
      case 'md':
      default:
        return 'h-[300px]';
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-[#2c2520] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Discover Our Destinations
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore the most breathtaking locations in Africa with our curated selection of destinations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 auto-rows-fr">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id}
              className={`group relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl ${getGridClasses(destination.size || 'small')} ${getHeightClasses(destination.height || 'md')}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3} // Only prioritize first 3 images for better LCP
                  loading={index > 2 ? 'lazy' : 'eager'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              {/* Glassy Overlay */}
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-500" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-5 md:p-6 text-white">
                {/* Tags */}
                {destination.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {destination.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 text-[10px] md:text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <h3 className="text-lg md:text-xl font-bold mb-1">{destination.title}</h3>
                {destination.subtitle && (
                  <p className="text-xs md:text-sm text-gray-200 mb-3 line-clamp-2">{destination.subtitle}</p>
                )}
                
                <a 
                  href={destination.url}
                  className="inline-flex items-center text-xs md:text-sm font-medium text-amber-300 hover:text-white transition-colors group-hover:translate-x-1 duration-300"
                >
                  Explore more
                  <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/destinations" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
          >
            View All Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
