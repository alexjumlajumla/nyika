import { locales } from '@/i18n/routing';

// This is a simplified version that only handles static paths
// For dynamic data fetching, consider using ISR or client-side fetching
export function generateStaticParams() {
  // Only return the locales without any dynamic data
  return locales.map((locale) => ({
    locale,
  }));
}

// If you need to fetch dynamic tour slugs, you can use this approach:
// 1. Create an API route to fetch all tour slugs
// 2. Use fetch() with revalidate to get the latest slugs
// 3. Combine with the locales for static generation

// Example (uncomment and implement if needed):
/*
async function getAllTourSlugs() {
  // Implement this to fetch all tour slugs from your database
  // This should not use cookies() or other request-specific APIs
  return [];
}

export async function generateStaticParams() {
  const [slugs, locales] = await Promise.all([
    getAllTourSlugs(),
    locales
  ]);

  return locales.flatMap(locale => 
    slugs.map(slug => ({
      locale,
      slug
    }))
  );
}
*/
