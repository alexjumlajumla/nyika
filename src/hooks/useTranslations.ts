import { useParams } from 'next/navigation';

type TranslationFunction = (...args: any[]) => string;
type TranslationValue = string | TranslationFunction | NestedTranslations;

interface NestedTranslations {
  [key: string]: TranslationValue;
}

const defaultTranslations = {
  en: {
    common: {
      // Common UI elements
      days: (count: number) => `${count} ${count === 1 ? 'day' : 'days'}`,
      bookNow: 'Book Now',
      from: 'From',
      perPerson: 'per person',
      overview: 'Overview',
      itinerary: 'Itinerary',
      included: 'Included',
      reviews: 'Reviews',
      bookThisTour: 'Book This Tour',
      price: 'Price',
      duration: 'Duration',
      groupSize: 'Group Size',
      startingPoint: 'Starting Point',
      difficulty: 'Difficulty',
      availability: 'Availability',
      selectDate: 'Select Date',
      guests: 'Guests',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
      next: 'Next',
      previous: 'Previous'
    },
    // Add more namespaces as needed
    home: {
      heroTitle: 'Experience the Magic of Africa',
      heroSubtitle: 'Discover breathtaking safaris and create memories that last a lifetime',
      featuredTours: 'Featured Tours',
      viewAllTours: 'View All Tours',
      whyChooseUs: 'Why Choose Us',
      testimonials: 'What Our Guests Say',
      latestBlogPosts: 'Latest from Our Blog'
    },
    tours: {
      title: 'Our Safaris',
      filterBy: 'Filter by',
      sortBy: 'Sort by',
      noToursFound: 'No tours found matching your criteria',
      duration: 'Duration',
      priceRange: 'Price Range',
      difficultyLevel: 'Difficulty Level',
      groupSize: 'Group Size',
      resetFilters: 'Reset Filters',
      applyFilters: 'Apply Filters',
      showMore: 'Show More',
      showLess: 'Show Less'
    },
    tourDetail: {
      overview: 'Tour Overview',
      highlights: 'Tour Highlights',
      included: 'What\'s Included',
      notIncluded: 'Not Included',
      itinerary: 'Detailed Itinerary',
      day: 'Day',
      accommodation: 'Accommodation',
      meals: 'Meals',
      transportation: 'Transportation',
      activities: 'Activities',
      bookNow: 'Book This Tour',
      similarTours: 'You Might Also Like',
      viewAllPhotos: 'View All Photos',
      showMore: 'Show More',
      showLess: 'Show Less'
    },
    booking: {
      title: 'Book Your Safari',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      tourDetails: 'Tour Details',
      paymentInfo: 'Payment Information',
      reviewBooking: 'Review Your Booking',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      country: 'Country',
      specialRequirements: 'Special Requirements',
      additionalNotes: 'Additional Notes',
      cardNumber: 'Card Number',
      cardExpiry: 'Expiry Date',
      cardCvc: 'CVC',
      cardName: 'Name on Card',
      termsAgreement: 'I agree to the Terms & Conditions and Privacy Policy',
      completeBooking: 'Complete Booking',
      bookingConfirmation: 'Booking Confirmation',
      bookingReference: 'Booking Reference',
      thankYou: 'Thank You for Your Booking!',
      confirmationEmailSent: 'A confirmation email has been sent to',
      nextSteps: 'What\'s Next?',
      bookingDetails: 'Booking Details'
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Have questions? We\'d love to hear from you.',
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      sendMessage: 'Send Message',
      contactInfo: 'Contact Information',
      address: '123 Safari Way, Nairobi, Kenya',
      phone: '+254 700 000000',
      emailUs: 'info@nyikasafaris.com',
      followUs: 'Follow Us',
      officeHours: 'Office Hours',
      mondayToFriday: 'Monday - Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      closed: 'Closed'
    }
  }
  // Add more languages here as needed
} as const;

type DefaultTranslations = typeof defaultTranslations;
type Locale = keyof DefaultTranslations;

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function useTranslations<T extends string = string>(namespace?: T) {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';

  const t = (key: string, ...args: any[]): string => {
    try {
      // Get the translations for the current locale, fallback to English
      const translations = defaultTranslations[locale] || defaultTranslations.en;
      
      // Split the key into parts
      const keys = key.split('.');
      
      // Start with the translations object
      let result: any = translations;
      
      // If a namespace is provided, start with that
      if (namespace) {
        result = result[namespace as keyof typeof result];
      }
      
      // Navigate through the key parts
      for (const k of keys) {
        if (isObject(result) && k in result) {
          result = result[k as keyof typeof result];
        } else {
          // If we can't find the key, return it as is
          return key;
        }
      }
      
      // If the result is a function, call it with the provided arguments
      if (typeof result === 'function') {
        return result(...args);
      }
      
      // If it's a string, return it
      if (typeof result === 'string') {
        return result;
      }
      
      // If we get here, return the key as a fallback
      return key;
    } catch {
      // In case of any error, return the key
      return key;
    }
  };
  
  return { t };
}

export default useTranslations;
