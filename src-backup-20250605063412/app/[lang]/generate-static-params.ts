// This file is used to generate static params for the [lang] segment
// It needs to be in a separate file from client components

const locales = ['en', 'sw', 'de'] as const;

// This function tells Next.js which params are allowed for this dynamic route
export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'sw' },
    { lang: 'de' },
  ];
}

export const dynamicParams = false; // No fallback for invalid locales
