'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

// --- Types ---
interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
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

// Social links
const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/nyikasafaris',
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/nyikasafaris',
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/nyikasafaris',
    icon: <Twitter className="h-5 w-5" />,
  },
];

// Contact information
const contactInfo: ContactInfo[] = [
  {
    icon: <MapPin className="h-5 w-5 text-brand-green" />,
    text: 'Nairobi, Kenya',
  },
  {
    icon: <Mail className="h-5 w-5 text-brand-green" />,
    text: 'info@nyikasafaris.com',
  },
  {
    icon: <Phone className="h-5 w-5 text-brand-green" />,
    text: '+254 712 345 678',
  },
];

// Footer links
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

// --- Footer Component ---
interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t bg-background/95 backdrop-blur-sm', className)}>
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-brand-navy">Nyika Safaris</span>
            </div>
            <p className="text-muted-foreground">
              Experience the best safaris in Africa with our expert guides and personalized itineraries.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.name}
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-brand-green">{info.icon}</span>
                  <span className="text-sm text-muted-foreground">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nyika Safaris. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
