import Image from 'next/image';
'use client';

import React from 'react';
import styles from './FeaturedDestinations.module.css';

interface Destination {
  id: string;
  title: string;
  subtitle?: string;
  width?: 'wide' | 'narrow' | 'third' | 'full';
  gradient?: string;
  image: string;
}

interface FeaturedDestinationsProps {
  destinations?: Destination[];
}

const defaultDestinations: Destination[] = [
  // Line 1
  {
    id: '1',
    title: 'Serengeti National Park',
    subtitle: 'Witness the Great Migration',
    width: 'wide',
    gradient: 'serengeti',
    image: 'https://source.unsplash.com/random/1200x800/?serengeti'
  },
  {
    id: '2',
    title: 'Trekking',
    width: 'narrow',
    gradient: 'trekking',
    image: 'https://source.unsplash.com/random/800x800/?hiking'
  },
  // Line 2
  {
    id: '3',
    title: 'Country Safari',
    width: 'third',
    gradient: 'safari',
    image: 'https://source.unsplash.com/random/800x600/?safari'
  },
  {
    id: '4',
    title: 'Cultural Experience',
    width: 'third',
    gradient: 'cultural',
    image: 'https://source.unsplash.com/random/800x600/?africa,culture'
  },
  {
    id: '5',
    title: 'Honeymoon',
    width: 'third',
    gradient: 'honeymoon',
    image: '/images/featured/honeymoon.jpg'
  },
  // Line 3
  {
    id: '6',
    title: 'Climb Kilimanjaro',
    width: 'narrow',
    gradient: 'kilimanjaro',
    image: '/images/featured/kilimanjaro.jpg'
  },
  {
    id: '7',
    title: 'Wildebeest Migration',
    subtitle: 'The Greatest Show on Earth',
    width: 'wide',
    gradient: 'migration',
    image: '/images/featured/migration.jpg'
  },
  // Line 4
  {
    id: '8',
    title: 'Victoria Falls - Day Trip',
    subtitle: 'Experience the Smoke That Thunders',
    width: 'full',
    gradient: 'victoria-falls',
    image: '/images/featured/victoria-falls.jpg'
  }
];

// Helper function to safely get the gradient class
const getGradientClass = (gradient?: string) => {
  if (!gradient) return '';
  return styles[`gradient-${gradient}`] || '';
};

const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({ destinations = defaultDestinations }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Featured Destinations
        </h2>
        
        <div className={styles.grid}>
          {destinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className={`${styles.destination} ${destination.width ? styles[destination.width] : ''} ${getGradientClass(destination.gradient)}`}
            >
              <div 
                className={styles.image}
                style={{ backgroundImage: `url(${destination.image})` }}
              >
                <div className={styles.overlay}>
                  <div className={styles.content}>
                    <h3 className={styles.destinationTitle}>{destination.title}</h3>
                    {destination.subtitle && (
                      <p className={styles.subtitle}>{destination.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
