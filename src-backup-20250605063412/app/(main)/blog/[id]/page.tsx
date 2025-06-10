import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

// Mock function to fetch blog post data
export async function getBlogPost(id: string) {
  // In a real app, this would be a database query or API call
  const blogPosts = [
    {
      id: '1',
      title: 'The Ultimate Guide to the Great Migration',
      content: `
        <p>The Great Migration is one of the most spectacular natural events on the planet. Every year, over two million wildebeest, zebras, and gazelles make their way across the Serengeti in Tanzania and the Masai Mara in Kenya in search of fresh grazing and water.</p>
        
        <h2>When to Go</h2>
        <p>The migration is a year-round event, but the most dramatic moments typically occur between July and October when the herds cross the Mara River. This is when you'll witness the famous river crossings, where crocodiles lie in wait for the migrating animals.</p>
        
        <h2>Where to Stay</h2>
        <p>For the best experience, we recommend staying in mobile camps that move with the migration. These camps offer front-row seats to the action while providing comfortable accommodations and expert guides.</p>
        
        <h2>Photography Tips</h2>
        <p>Bring a telephoto lens (at least 300mm) to capture the action from a distance. Early morning and late afternoon provide the best lighting conditions for photography.</p>
      `,
      excerpt: 'Everything you need to know about planning your trip to witness one of nature\'s greatest spectacles.',
      date: 'May 15, 2025',
      readTime: '8 min read',
      category: 'Wildlife',
      image: '/images/blog/great-migration.jpg',
      author: {
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah-johnson.jpg',
        bio: 'Wildlife biologist and safari guide with over 15 years of experience in East Africa.'
      },
      relatedPosts: [
        { id: '2', title: 'Top 10 Luxury Lodges in East Africa', category: 'Accommodation', image: '/images/blog/luxury-lodges.jpg' },
        { id: '3', title: 'Photographing African Wildlife: Tips from the Pros', category: 'Photography', image: '/images/blog/wildlife-photography.jpg' }
      ]
    }
  ];

  return blogPosts.find(post => post.id === id) || null;
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/blog" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {post.date}
              </span>
              <span>•</span>
              <span className="inline-flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {post.readTime}
              </span>
              <span>•</span>
              <span className="inline-flex items-center">
                <User className="mr-1 h-4 w-4" />
                {post.author.name}
              </span>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            
            <div className="mb-8 h-96 overflow-hidden rounded-lg bg-gray-200">
              <img 
                src={post.image} 
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </header>

          <div className="prose mb-12 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <footer className="mb-12 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{post.author.name}</h3>
                <p className="text-muted-foreground">{post.author.bio}</p>
              </div>
            </div>
          </footer>
        </article>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {post.relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <span className="text-sm font-medium text-primary">{relatedPost.category}</span>
                  <CardTitle className="text-xl">
                    <Link href={`/blog/${relatedPost.id}`} className="hover:underline">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
