'use client';

import dynamic from 'next/dynamic';

interface ContactFormClientProps {
  onSubmit: (data: any) => Promise<void>;
}

// Dynamically import ContactForm with SSR disabled
const ContactForm = dynamic<ContactFormClientProps>(
  () => import('./ContactForm').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 animate-pulse rounded-md bg-gray-100"></div>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
            <div className="h-32 animate-pulse rounded-md bg-gray-100"></div>
          </div>
          <div className="h-12 w-40 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>
    ),
  }
);

export default function ContactFormClient({ onSubmit }: ContactFormClientProps) {
  return <ContactForm onSubmit={onSubmit} />;
}
