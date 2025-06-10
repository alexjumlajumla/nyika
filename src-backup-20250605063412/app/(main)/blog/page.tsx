import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogPage() {
  // Mock data - replace with actual data fetching
  const blogPosts = [
    {
      id: 1,
      title: 'The Ultimate Guide to the Great Migration',
      excerpt: 'Everything you need to know about planning your trip to witness one of nature\'s greatest spectacles.',
      date: 'May 15, 2025',
      readTime: '8 min read',
      category: 'Wildlife',
      image: '/images/blog/great-migration.jpg',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg'
      }
    },
    {
      id: 2,
      title: 'Top 10 Luxury Lodges in East Africa',
      excerpt: 'Discover the most luxurious accommodations for your African safari adventure.',
      date: 'April 28, 2025',
      readTime: '6 min read',
      category: 'Accommodation',
      image: '/images/blog/luxury-lodges.jpg',
      author: {
        name: 'Michael Chen',
        avatar: '/images/authors/michael-chen.jpg'
      }
    },
    {
      id: 3,
      title: 'Photographing African Wildlife: Tips from the Pros',
      excerpt: 'Expert advice on capturing stunning wildlife photographs during your safari.',
      date: 'April 10, 2025',
      readTime: '10 min read',
      category: 'Photography',
      image: '/images/blog/wildlife-photography.jpg',
      author: {
        name: 'Amina Diallo',
        avatar: '/images/authors/amina-diallo.jpg'
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Nyika Safaris Blog</h1>
        <p className="text-xl text-muted-foreground">Stories, tips, and insights from our African adventures</p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="h-48 bg-gray-200">
              {/* Replace with Next/Image in production */}
              <img 
                src={post.image} 
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-primary">{post.category}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
              <CardTitle className="text-xl">
                <Link href={`/blog/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{post.readTime}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Articles
        </Button>
      </div>
    </div>
  );
}
