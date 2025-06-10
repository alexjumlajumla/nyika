import { Metadata } from 'next';

// Components
import Hero from '@/components/Hero';
import FeaturedDestinations from '@/components/FeaturedDestinations';
import FeaturedBlogBanner from '@/components/FeaturedBlogBanner';

// Import types and utilities
import { Locale, siteConfig, locales as supportedLocales } from '@/config/site';
import { isValidLocale } from '@/lib/utils/locale';

// Define types for our translations
interface TranslationData {
  [key: string]: string | TranslationData;
}

interface Translations {
  [locale: string]: {
    [namespace: string]: TranslationData;
  };
}

// Simple in-memory translations for demo purposes
const translations: Translations = {
  en: {
    common: {
      home: 'Home',
      tours: 'Tours',
      about: 'About',
      contact: 'Contact',
      bookNow: 'Book Now',
      readMore: 'Read More',
    },
    home: {
      heroTitle: 'Unforgettable African Safaris',
      heroSubtitle: 'Experience the wild like never before with our expert guides',
      featuredDestinations: 'Featured Destinations',
      destinationsSubtitle: 'Explore the most breathtaking locations in Africa',
      featuredBlog: {
        title: 'The Ultimate Safari Guide',
        excerpt: 'Discover the best times to visit, what to pack, and top tips for an unforgettable safari experience.',
        cta: 'Read Our Safari Guide'
      },
      whyChooseUs: 'Why Choose Us',
      testimonials: 'What Our Guests Say',
    },
  },
  // Add more languages as needed
};

/**
 * Get translations for a specific locale and namespace
 */
async function getTranslations(locale: string, namespace: string = 'common'): Promise<TranslationData> {
  // In a real app, you would fetch translations from an API or file system
  const defaultLocale = 'en';
  return (translations[locale]?.[namespace] || translations[defaultLocale][namespace] || {}) as TranslationData;
}

// Featured blog post data is now passed directly to the FeaturedBlogBanner component

// Generate static params for all supported locales
export async function generateStaticParams() {
  return supportedLocales.map((locale: Locale) => ({
    locale,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: Locale } 
}): Promise<Metadata> {
  // Get locale from params with fallback
  const locale = params?.locale || 'en';
  const currentLocale = isValidLocale(locale) ? locale : 'en';
  const baseUrl = siteConfig.url;
  
  // Base metadata with fallbacks
  const baseMetadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${currentLocale}`,
      languages: supportedLocales.reduce<Record<string, string>>((acc, loc) => {
        acc[loc] = `/${loc}`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      type: 'website' as const,
      locale: currentLocale.replace('-', '_').toLowerCase(),
      url: `/${currentLocale}`,
      siteName: siteConfig.name,
      images: [
        {
          url: `${baseUrl}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${baseUrl}${siteConfig.twitterImage}`],
    },
  };
  
  if (!isValidLocale(locale)) {
    return baseMetadata;
  }

  try {
    const t = await getTranslations(locale, 'home');
    const title = (t.heroTitle as string) || baseMetadata.title;
    const description = (t.heroSubtitle as string) || baseMetadata.description;
    
    return {
      ...baseMetadata,
      title,
      description,
      openGraph: {
        ...baseMetadata.openGraph,
        title,
        description,
      },
    };
  } catch {
    return baseMetadata;
  }
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  // Safely get locale from params with fallback
  const locale = await Promise.resolve(params?.locale || 'en');
  const currentLocale = isValidLocale(locale) ? locale : 'en';
  
  // Get translations for the current locale
  const getTranslation = (key: string, ns: string = 'common'): string => {
    try {
      const keys = key.split('.');
      // Get the namespace object
      const namespace = (translations[currentLocale]?.[ns] || translations.en[ns]) as Record<string, any>;
      
      // Traverse the keys to get the final value
      let result = namespace;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return key; // Return key if path not found
        }
      }
      
      return typeof result === 'string' ? result : key;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`Translation error for key ${key}:`, error);
      }
      return key;
    }
  };
  
  // Get translations for common strings
  const t = (key: string, ns: string = 'common') => getTranslation(key, ns);
  
  // Helper function to safely access translation strings with fallback
  const tString = (key: string, fallback: string, ns: string = 'common'): string => {
    const result = t(key, ns);
    return result !== key ? result : fallback;
  };
  
  // Home translations will be used in the component
  // const homeT = (key: string) => t(key, 'home');

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* Why Choose Us Section */}
      <section className="relative py-20 overflow-hidden bg-white dark:bg-[#2c2520]" id="why-choose-us">
        {/* Frosty beige background */}
        <div className="absolute inset-0 bg-amber-50/30 dark:bg-[#2c2520]/80 backdrop-blur-sm -z-10">
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {tString('whyChooseUs', 'Why Choose Us', 'common')}
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the difference with our expert-led safaris and personalized service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Expert Local Guides',
                description: 'Our guides have 10+ years of experience and intimate knowledge of African wildlife and ecosystems.',
                icon: '👨‍🏫'
              },
              {
                title: 'Luxury Accommodations',
                description: 'Stay in handpicked lodges and luxury camps that blend comfort with authentic safari experiences.',
                icon: '🏨'
              },
              {
                title: 'Sustainable & Responsible',
                description: 'We support conservation efforts and local communities through responsible tourism practices.',
                icon: '🌿'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-amber-100/50 relative overflow-hidden"
              >
                {/* Frosty effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-amber-50/20 backdrop-blur-sm -z-10"></div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500/90 to-amber-600/90 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-white text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/10 rounded-full mix-blend-overlay blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-600/10 rounded-full mix-blend-overlay blur-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Banner */}
      <FeaturedBlogBanner 
        title="Discover the Magic of African Safaris"
        excerpt="Read our latest articles and travel guides to plan your perfect African adventure. From wildlife encounters to cultural experiences, we've got you covered with expert tips and insider knowledge."
        url="/blog/african-safari-guide"
        readMoreText="Read Article"
      />
    </main>
  );
}

// Extend Next.js types to include our locale parameter
declare module 'next' {
  interface PageParams {
    locale: Locale;
  }
}