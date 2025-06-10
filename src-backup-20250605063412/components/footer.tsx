import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaTripadvisor } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-900 pb-8 pt-16 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Nyika Safaris</h3>
            <p className="text-light-300">
              Creating unforgettable African safari experiences with a commitment to sustainability and authentic cultural immersion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light-300 hover:text-primary-400 transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-300 hover:text-primary-400 transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-300 hover:text-primary-400 transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-300 hover:text-primary-400 transition-colors">
                <FaTripadvisor className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-light-300 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/destinations" className="text-light-300 hover:text-primary-400 transition-colors">Destinations</Link></li>
              <li><Link href="/tours" className="text-light-300 hover:text-primary-400 transition-colors">Safari Packages</Link></li>
              <li><Link href="/blog" className="text-light-300 hover:text-primary-400 transition-colors">Travel Blog</Link></li>
              <li><Link href="/contact" className="text-light-300 hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Contact Us</h4>
            <address className="space-y-2 not-italic">
              <p className="text-light-300">123 Safari Way, Nairobi, Kenya</p>
              <p className="text-light-300">Email: <a href="mailto:info@nyikasafaris.com" className="hover:text-primary-400 transition-colors">info@nyikasafaris.com</a></p>
              <p className="text-light-300">Phone: <a href="tel:+254700000000" className="hover:text-primary-400 transition-colors">+254 700 000 000</a></p>
              <p className="text-light-300">Hours: Mon - Fri, 8:00 AM - 5:00 PM EAT</p>
            </address>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-light-300 mb-4">Subscribe to our newsletter for the latest safari deals and travel tips.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-dark-800 border-dark-700 focus:ring-primary-500 w-full rounded-md border px-4 py-2 text-white focus:outline-none focus:ring-2"
                required 
              />
              <button 
                type="submit" 
                className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-4 py-2 font-medium text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-dark-800 border-t pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-light-400 text-sm">
              &copy; {currentYear} Nyika Safaris. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link href="/privacy-policy" className="text-light-400 hover:text-primary-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-light-400 hover:text-primary-400 text-sm transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
