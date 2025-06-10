declare module '*.json' {
  const value: {
    [key: string]: any;
  };
  export default value;
}

declare module '@/public/locales/en/common.json' {
  const value: {
    footer: {
      title: string;
      description: string;
      quickLinks: string;
      contactUs: string;
      address: string;
      hours: string;
      newsletter: string;
      newsletterDescription: string;
      emailPlaceholder: string;
      allRightsReserved: string;
      privacyPolicy: string;
      terms: string;
      socialLink: string;
      subscribe: string;
      subscribing: string;
      subscribed: string;
    };
    navigation: {
      home: string;
      destinations: string;
      tours: string;
      accommodations: string;
      about: string;
      contact: string;
      blog: string;
    };
    search: {
      placeholder: string;
      checkIn: string;
      checkOut: string;
      guests: string;
      search: string;
    };
    accommodation: {
      title: string;
      filter: {
        title: string;
        priceRange: string;
        type: string;
        amenities: string;
        rating: string;
      };
      sort: {
        title: string;
        priceLowToHigh: string;
        priceHighToLow: string;
        ratingHighToLow: string;
        nameAZ: string;
      };
    };
  };
  export default value;
}

declare module '@/public/locales/sw/common.json' {
  const value: {
    footer: {
      title: string;
      description: string;
      quickLinks: string;
      contactUs: string;
      address: string;
      hours: string;
      newsletter: string;
      newsletterDescription: string;
      emailPlaceholder: string;
      allRightsReserved: string;
      privacyPolicy: string;
      terms: string;
      socialLink: string;
      subscribe: string;
      subscribing: string;
      subscribed: string;
    };
    navigation: {
      home: string;
      destinations: string;
      tours: string;
      accommodations: string;
      about: string;
      contact: string;
      blog: string;
    };
    search: {
      placeholder: string;
      checkIn: string;
      checkOut: string;
      guests: string;
      search: string;
    };
    accommodation: {
      title: string;
      filter: {
        title: string;
        priceRange: string;
        type: string;
        amenities: string;
        rating: string;
      };
      sort: {
        title: string;
        priceLowToHigh: string;
        priceHighToLow: string;
        ratingHighToLow: string;
        nameAZ: string;
      };
    };
  };
  export default value;
}
