import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

// Sample blog post data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    id: 1,
    title: 'The Ultimate Guide to African Safaris',
    excerpt: 'Everything you need to know to plan your dream safari adventure in Africa.',
    slug: 'ultimate-guide-african-safaris',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1600&h=900&fit=crop&crop=entropy&q=80',
    date: '2024-06-08',
    readTime: '8 min read',
    category: 'Travel Tips',
    content: `
      <h2>Planning Your Safari Adventure</h2>
      <p>Embarking on an African safari is a dream for many travelers. The vast landscapes, incredible wildlife, and rich cultures make it a once-in-a-lifetime experience. But with so many options available, planning the perfect safari can feel overwhelming.</p>
      
      <h3>Choosing the Right Destination</h3>
      <p>Africa is a vast continent with diverse ecosystems and wildlife viewing opportunities. Here are some of the top safari destinations:</p>
      <ul>
        <li><strong>Tanzania:</strong> Home to the Serengeti and Ngorongoro Crater, Tanzania offers some of the best wildlife viewing in Africa.</li>
        <li><strong>Kenya:</strong> Famous for the Maasai Mara and the Great Migration, Kenya is a classic safari destination.</li>
        <li><strong>South Africa:</strong> With its excellent infrastructure and malaria-free reserves, South Africa is perfect for first-time safari-goers.</li>
        <li><strong>Botswana:</strong> Known for its pristine wilderness areas like the Okavango Delta and Chobe National Park.</li>
      </ul>

      <h3>When to Go</h3>
      <p>The best time for a safari depends on what you want to see:</p>
      <ul>
        <li><strong>June to October:</strong> Dry season - best for wildlife viewing as animals gather around water sources.</li>
        <li><strong>November to May:</strong> Wet season - lush landscapes and fewer tourists, but some areas may be difficult to access.</li>
      </ul>

      <h3>What to Pack</h3>
      <p>Packing the right gear is essential for a comfortable safari:</p>
      <ul>
        <li>Neutral-colored clothing (khaki, beige, olive green)</li>
        <li>Comfortable walking shoes</li>
        <li>Wide-brimmed hat and sunglasses</li>
        <li>Binoculars and camera with zoom lens</li>
        <li>Sunscreen and insect repellent</li>
      </ul>

      <h2>Making the Most of Your Safari</h2>
      <p>To truly enjoy your safari experience, keep these tips in mind:</p>
      <ul>
        <li>Be patient - wildlife viewing requires time and luck</li>
        <li>Listen to your guide's instructions</li>
        <li>Respect the wildlife and maintain a safe distance</li>
        <li>Wake up early for the best wildlife sightings</li>
        <li>Take time to appreciate the smaller details and landscapes, not just the 'Big Five'</li>
      </ul>
    `
  }
];

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: `${post.title} | Nyika Safaris Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{
        url: post.image,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
      type: 'article',
      publishedTime: post.date,
      section: 'Travel',
      authors: ['Nyika Safaris'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-8 -ml-2">
            <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 dark:text-gray-300 dark:hover:text-amber-400">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>

          <article className="mb-12">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 mb-4">
                <Tag className="w-4 h-4" />
                {post.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-10 shadow-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>

            <div 
              className="prose dark:prose-invert max-w-none prose-headings:font-display prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Button asChild variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/30">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
