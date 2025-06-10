import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/contact/ContactForm';
import { locales, type Locale } from '@/i18n/routing';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

type PageProps = {
  params: { locale?: string };
};

export default async function ContactPage({ params }: PageProps) {
  const { locale = 'en' } = params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get translations
  const t = await getTranslations('ContactPage');

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {t('description')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                {t('form.title')}
              </h2>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                {t('contactInfo.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('contactInfo.address')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaPhone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('contactInfo.phone')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                    <a 
                      href={`mailto:${t('contactInfo.email')}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {t('contactInfo.email')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaClock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('contactInfo.hours')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Find Us on Map
              </h3>
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8542704761973!2d36.82115931475398!3d-1.2682358359795176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c0a1f9b4d%3A0x1e3c1b2b5e6c9c0f!2sNairobi%20National%20Park!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}
