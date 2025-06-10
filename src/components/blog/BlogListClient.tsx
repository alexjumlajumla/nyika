'use client';

import dynamic from 'next/dynamic';
import { BlogPost } from '@/types/blog';

interface BlogListClientProps {
  posts: BlogPost[];
}

// Dynamically import BlogList with SSR disabled
const BlogList = dynamic<BlogListClientProps>(
  () => import('./BlogList'),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="h-48 animate-pulse bg-gray-200"></div>
            <div className="p-6">
              <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-4 space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-3 w-full animate-pulse rounded bg-gray-100"></div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }
);

export default function BlogListClient({ posts }: BlogListClientProps) {
  return <BlogList posts={posts} />;
}
