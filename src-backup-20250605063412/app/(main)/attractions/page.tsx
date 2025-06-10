import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AttractionsPage() {
  // Mock data - replace with actual data fetching
  const attractions = [
    {
      id: 1,
      name: 'Great Wildebeest Migration',
      location: 'Masai Mara, Kenya',
      description: 'Witness one of the most spectacular natural events on Earth as millions of wildebeest cross the Mara River.',
      image: '/images/attractions/migration.jpg',
      category: 'Wildlife',
      bestTime: 'July - October'
    },
    {
      id: 2,
      name: 'Mount Kilimanjaro',
      location: 'Tanzania',
      description: 'Africa\'s highest peak and the world\'s tallest free-standing mountain, offering breathtaking trekking experiences.',
      image: '/images/attractions/kilimanjaro.jpg',
      category: 'Adventure',
      bestTime: 'January - March, June - October'
    },
    {
      id: 3,
      name: 'Victoria Falls',
      location: 'Zambia/Zimbabwe',
      description: 'One of the Seven Natural Wonders of the World, known locally as "The Smoke That Thunders".',
      image: '/images/attractions/victoria-falls.jpg',
      category: 'Natural Wonder',
      bestTime: 'February - May'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Top Attractions</h1>
        <p className="text-xl text-muted-foreground">Discover the most incredible experiences across Africa</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction) => (
          <Card key={attraction.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="h-48 bg-gray-200">
              {/* Replace with Next/Image in production */}
              <img 
                src={attraction.image} 
                alt={attraction.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{attraction.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                {attraction.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">{attraction.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-primary/10 px-2 py-1 text-primary">{attraction.category}</span>
                <span className="rounded bg-secondary/10 px-2 py-1 text-secondary-foreground">
                  Best time: {attraction.bestTime}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/attractions/${attraction.id}`} className="w-full">
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
