import { Metadata } from 'next';
import { defaultLocale } from '@/i18n/routing';

// Message loaders for each locale
const messageLoaders = {
  en: () => import('@/messages/en.json').then((mod) => mod.default),
  sw: () => import('@/messages/sw.json').then((mod) => mod.default),
} as const;

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}): Promise<Metadata> {
  const locale = params?.locale ?? defaultLocale;
  
  try {
    // Load messages for the current locale, fallback to default if needed
    const messages = await (messageLoaders[locale as keyof typeof messageLoaders] || messageLoaders[defaultLocale])();
    
    // Get the title and description from the messages
    const title = messages?.home?.title || 'Nyika Safaris';
    const description = messages?.home?.subtitle || 'Experience the best safaris in Africa with Nyika Safaris';
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale,
        siteName: 'Nyika Safaris',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    // Fallback to default metadata if there's an error loading messages
    return {
      title: 'Nyika Safaris',
      description: 'Experience the best safaris in Africa with Nyika Safaris',
    };
  }
}
