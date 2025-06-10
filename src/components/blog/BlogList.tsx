import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { BlogPost } from '@/types/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No blog posts found</h3>
        <p className="mt-1 text-gray-500">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article key={post.id} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
          <div className="relative h-48 w-full">
            <Image
              src={post.featuredImage?.url || '/images/placeholder-blog.jpg'}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-600">
                {post.categories?.[0]?.name || 'Uncategorized'}
              </p>
              <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-gray-900">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-base text-gray-500">
                {post.excerpt}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-sm text-gray-500">
                    {post.author?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {post.author?.name || 'Admin'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.publishedAt)}
                  </p>
                </div>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
                aria-label={`Read more about ${post.title}`}
              >
                Read more →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
