import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

// --- Types ---
interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface ContactInfo {
  icon: React.ReactNode;
  text: string | React.ReactNode;
}

// --- Data ---
const footerLinks: FooterSection[] = [
  {
    title: 'Explore',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Destinations', href: '/destinations' },
      { name: 'Tours', href: '/tours' },
      { name: 'Attractions', href: '/attractions' },
      { name: 'Accommodations', href: '/accommodations' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/about#team' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Booking Policy', href: '/booking-policy' },
      { name: 'Cancellation Policy', href: '/cancellation-policy' },
    ],
  },
];

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/nyikasafaris',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/nyikasafaris',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06..."
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  // Add Twitter, YouTube, etc...
];

const contactInfo: ContactInfo[] = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: '123 Safari Lane, Arusha, Tanzania',
  },
  // Add phone/email if needed
];

// --- Footer Component ---
interface FooterProps {
  lang: string;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-800">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="transition hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm">
            {contactInfo.map((info, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>{info.icon}</span>
                <span>{info.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-4">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-sm">© {new Date().getFullYear()} Nyika Safaris. All rights reserved.</div>
    </footer>
  );
}
