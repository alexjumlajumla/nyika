'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface MegaMenuItem {
  title: string;
  href: string;
  description?: string;
  image?: string;
  featured?: boolean;
  links?: Array<{
    title: string;
    href: string;
    description?: string;
  }> | undefined;
}

export interface MegaMenuProps {
  items: MegaMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MegaMenu({ items, isOpen, onClose, className }: MegaMenuProps) {
  if (!isOpen || items.length === 0) return null;

  const fallbackHref = items[0]?.href.replace(/\/\w+$/, '') || '#';
  const viewAllLabel = items[0]?.title?.toLowerCase() || 'items';

  return (
    <div
      className={cn(
        'absolute left-0 right-0 z-50 w-full bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800',
        'transition-all duration-200 ease-in-out transform',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
        className
      )}
      onMouseLeave={onClose}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.title + index}
              className={cn(
                'group relative',
                item.featured ? 'md:col-span-2' : 'md:col-span-1',
                'transition-all duration-200 hover:scale-[1.02]'
              )}
            >
              <Link href={item.href} className="block">
                {item.image && (
                  <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                    />
                    {item.featured && (
                      <span className="bg-primary-600 absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white">
                        Featured
                      </span>
                    )}
                  </div>
                )}
                <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-lg font-semibold text-gray-900 transition-colors dark:text-white">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                )}
              </Link>

              {item.links && item.links.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {item.links.map((link, linkIndex) => (
                    <li key={link.title + linkIndex}>
                      <Link
                        href={link.href}
                        className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center text-sm text-gray-600 transition-colors dark:text-gray-400"
                      >
                        <span className="bg-primary-600 mr-2 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"></span>
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-6 text-center">
          <Link
            href={fallbackHref}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center text-sm font-medium transition-colors"
          >
            View all {viewAllLabel}
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
