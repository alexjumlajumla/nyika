import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, type Locale, isValidLocale } from '@/lib/i18n';

type PageProps = {
  params: { locale: Locale };
};

export default function TestPage({ params }: PageProps) {
  const t = useTranslations('TestPage');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t('description')}
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('i18nInfo')}
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  {t('currentLocale')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {params.locale}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  {t('availableLocales')}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {locales.join(', ')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('backToHome')}
          </a>
        </div>
      </div>
    </div>
  );
}

// This function tells Next.js which locales are supported
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

// This function runs on the server before the page is rendered
export async function generateMetadata({ params }: PageProps) {
  // Handle params asynchronously
  const locale = await Promise.resolve(params.locale);
  
  // Validate the locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Import translations for the current locale
  const messages = (await import(`@/messages/${locale}/test.json`)).default;

  return {
    title: messages.title,
    description: messages.description,
  };
}
