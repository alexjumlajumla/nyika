'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedBlogBannerProps {
  title: string;
  excerpt: string;
  url: string;
  readMoreText?: string;
}

export default function FeaturedBlogBanner({ 
  title, 
  excerpt, 
  url, 
  readMoreText = 'Read More' 
}: FeaturedBlogBannerProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Frosty beige background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-amber-100/30 -z-10">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-amber-400/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-amber-600/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Frosty glass card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/50 shadow-xl overflow-hidden relative">
            {/* Frosty background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-amber-50/50 -z-10"></div>
            
            {/* Noise texture */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 -z-10"></div>
            
            <div className="relative z-10">
              <span className="inline-block text-amber-600 text-sm font-medium mb-3">Featured Article</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
              <p className="text-gray-700 text-lg mb-8 max-w-2xl">{excerpt}</p>
              
              <Link 
                href={url}
                className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors group shadow-md hover:shadow-lg"
              >
                {readMoreText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/10 rounded-full mix-blend-overlay filter blur-xl"></div>
            <div className="absolute -bottom-20 -left-16 w-64 h-64 bg-amber-600/10 rounded-full mix-blend-overlay filter blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
