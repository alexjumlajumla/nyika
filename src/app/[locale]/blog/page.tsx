import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';


// Sample blog post data
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Ultimate Guide to African Safaris',
    excerpt: 'Everything you need to know to plan your dream safari adventure in Africa.',
    slug: 'ultimate-guide-african-safaris',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop&crop=entropy&q=80',
    date: 'June 8, 2024',
    readTime: '8 min read',
    category: 'Travel Tips'
  },
  {
    id: 2,
    title: 'Top 10 Wildlife Photography Tips',
    excerpt: 'Learn how to capture stunning wildlife photos on your next safari adventure.',
    slug: 'wildlife-photography-tips',
    image: 'https://images.unsplash.com/photo-1533415648777-407b626eb0fa?w=800&h=600&fit=crop&crop=entropy&q=80',
    date: 'June 1, 2024',
    readTime: '6 min read',
    category: 'Photography'
  },
  {
    id: 3,
    title: 'Best Time to Visit Tanzania',
    excerpt: 'A month-by-month guide to help you plan your perfect Tanzanian adventure.',
    slug: 'best-time-to-visit-tanzania',
    image: 'https://images.unsplash.com/photo-1567596056663-9d3f9f4b0b5e?w=800&h=600&fit=crop&crop=entropy&q=80',
    date: 'May 25, 2024',
    readTime: '7 min read',
    category: 'Destinations'
  },
  {
    id: 4,
    title: 'Luxury Safari Lodges in Kenya',
    excerpt: 'Experience the ultimate in comfort and wildlife viewing at these top lodges.',
    slug: 'luxury-safari-lodges-kenya',
    image: 'https://images.unsplash.com/photo-1580336278537-7ce1efba044f?w=800&h=600&fit=crop&crop=entropy&q=80',
    date: 'May 18, 2024',
    readTime: '5 min read',
    category: 'Accommodations'
  },
  {
    id: 5,
    title: 'Family-Friendly Safari Destinations',
    excerpt: 'The best African safari destinations for families with children of all ages.',
    slug: 'family-friendly-safari-destinations',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop&crop=entropy&q=80',
    date: 'May 10, 2024',
    readTime: '9 min read',
    category: 'Family Travel'
  },
  {
    id: 6,
    title: 'Conservation Efforts in Africa',
    excerpt: 'How responsible tourism is helping to protect Africa\'s wildlife and ecosystems.',
    slug: 'conservation-efforts-africa',
    image: 'https://images.unsplash.com/photo-1529107386315-95f3d5a021dc?w=800&h=600&fit=crop&crop=entropy&q=80',
    date: 'May 2, 2024',
    readTime: '10 min read',
    category: 'Conservation'
  }
];

export const metadata: Metadata = {
  title: 'Blog - Nyika Safaris',
  description: 'Read our latest articles, travel guides, and insider tips for planning your African safari adventure.',
};

// Type for blog post
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}

// Define supported locales
type Locale = 'en' | 'sw';

// List of supported locales (exported for use in other files if needed)
export const SUPPORTED_LOCALES: Locale[] = ['en', 'sw'];

// Type guard to check if a string is a valid locale
// This would be used in a real app for runtime locale validation

interface PageProps {
  params: {
    locale: Locale; 
  };
}

function getAllPosts(): BlogPost[] {
  return blogPosts;
}

// Translation function would be implemented here in a real app
// using next-intl or similar library

export default function BlogPage({ params }: PageProps) {
  // Validate and get the current locale
  const currentLocale = params.locale;
  
  // Get all posts (in a real app, you might filter by locale here)
  const filteredPosts = getAllPosts();
  
  // In a real app, you would use next-intl or similar for translations

  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nyika Safaris Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover expert travel tips, destination guides, and safari insights to plan your perfect African adventure.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Article</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <Image
                  className="h-full w-full object-cover"
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  width={800}
                  height={600}
                  priority
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-amber-600 font-semibold mb-1">
                  {blogPosts[0].category}
                </div>
                <Link 
                  href={`/blog/${blogPosts[0].slug}`}
                  className="block mt-1 text-2xl font-semibold text-gray-900 hover:text-amber-600 transition-colors duration-200"
                >
                  {blogPosts[0].title}
                </Link>
                <p className="text-center text-gray-600">
                  &copy; {new Date().getFullYear()} Nyika Safaris. All rights reserved.
                  {currentLocale === 'sw' ? ' (Kiswahili)' : ' (English)'}
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-500">{blogPosts[0].date} · {blogPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post: BlogPost) => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="block text-xl font-semibold text-gray-900 hover:text-amber-600 transition-colors duration-200 mb-2"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Never Miss a Post</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest travel tips, destination guides, and special offers straight to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
  }));
}
