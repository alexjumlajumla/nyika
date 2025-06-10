import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { Header } from '@/components/header';
import Footer from '@/components/layout/Footer';
import { SessionProvider } from '@/providers/SessionProvider';
import './globals.css';

// Define supported locales
export const locales = ['en', 'sw', 'de'] as const;
export type Locale = typeof locales[number];

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

type Props = {
  children: ReactNode;
  params: { lang: string };
};

export const metadata = {
  title: 'Nyika Safaris',
  description: 'Experience the best safaris in Africa with Nyika Safaris',
};

export default function LocaleLayout({ children, params }: Props) {
  const lang = (params?.lang || 'en') as Locale;

  return (
    <html lang={lang}>
      <body className={`${inter.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}>
        <SessionProvider>
          <Header lang={lang} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer lang={lang} />
        </SessionProvider>
      </body>
    </html>
  );
}
