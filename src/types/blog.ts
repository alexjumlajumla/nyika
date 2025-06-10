export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number; // in minutes
}

export interface BlogListProps {
  posts: BlogPost[];
  categories?: {
    id: string;
    name: string;
    slug: string;
    count: number;
  }[];
  currentCategory?: string;
  totalPosts?: number;
  currentPage?: number;
  totalPages?: number;
}
