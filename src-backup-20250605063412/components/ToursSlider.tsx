// Using a Client Component for the slider functionality
'use client';

import React from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import styles from './ToursSlider.module.css';

interface Tour {
  id: string;
  title: string;
  duration: string;
  price: string;
  image: string;
}

interface ToursSliderProps {
  tours?: Tour[];
}

const defaultTours: Tour[] = [
  {
    id: '1',
    title: 'Serengeti Migration Safari',
    duration: '7 Days',
    price: '$2,850',
    image: 'https://source.unsplash.com/random/800x600/?safari,africa'
  },
  {
    id: '2',
    title: 'Kilimanjaro Climb',
    duration: '8 Days',
    price: '$3,200',
    image: 'https://source.unsplash.com/random/800x600/?kilimanjaro'
  },
  {
    id: '3',
    title: 'Gorilla Trekking',
    duration: '4 Days',
    price: '$1,950',
    image: 'https://source.unsplash.com/random/800x600/?gorilla'
  },
  {
    id: '4',
    title: 'Zanzibar Beach Escape',
    duration: '5 Days',
    price: '$1,200',
    image: 'https://source.unsplash.com/random/800x600/?zanzibar,beach'
  },
];

const ToursSlider: React.FC<ToursSliderProps> = ({ tours = defaultTours }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(tours.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(tours.length / 2)) % Math.ceil(tours.length / 2));
  };

  return (
    <section className={styles.section}>
      <div className={styles.decorativeTop}></div>
      
      <div className={styles.container}>
        <h2 className={styles.title}>
          Breathtaking Tours
        </h2>
        
        <div className={styles.sliderContainer}>
          <div 
            className={styles.sliderTrack}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {tours.map((tour) => (
              <div key={tour.id} className={styles.tourCard}>
                <div className={styles.imageContainer}>
                  <div className={styles.imagePlaceholder}>
                    {tour.title} Image
                  </div>
                  <div className={styles.durationBadge}>
                    {tour.duration}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.tourTitle}>{tour.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{tour.price}</span>
                    <button className={styles.viewButton}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={prevSlide}
            className={styles.navButton}
            aria-label="Previous slide"
          >
            <FiArrowLeft className={styles.arrowIcon} />
          </button>
          <button 
            onClick={nextSlide}
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Next slide"
          >
            <FiArrowRight className={styles.arrowIcon} />
          </button>
        </div>
        
        <div className={styles.viewAllContainer}>
          <a href="/tours" className={styles.viewAllButton}>
            View All Tours
          </a>
        </div>
      </div>
    </section>
  );
};

export default ToursSlider;
