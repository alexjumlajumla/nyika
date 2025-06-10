'use client';

import React from 'react';
import { FiAward, FiGlobe, FiShield, FiUsers, FiMap, FiHeart } from 'react-icons/fi';
import styles from './WhyBookWithUs.module.css';

const benefits = [
  {
    icon: 'award',
    title: 'Tailor Made, Private Tours',
    description: 'Customized itineraries designed specifically for your interests and preferences.'
  },
  {
    icon: 'globe',
    title: 'Expert Advice 24/7',
    description: 'Our team is available around the clock to assist you with any questions or concerns.'
  },
  {
    icon: 'users',
    title: 'World Class Guides',
    description: 'Knowledgeable and experienced guides to enhance your safari experience.'
  },
  {
    icon: 'map',
    title: 'Specialized Safari Vehicles',
    description: 'Comfortable and well-equipped vehicles designed for optimal wildlife viewing.'
  },
  {
    icon: 'shield',
    title: 'Full Financial Protection',
    description: 'Your payments are secure with our comprehensive financial protection.'
  },
  {
    icon: 'heart',
    title: 'One Stop African Operator',
    description: 'We handle all aspects of your African adventure in one place.'
  }
];

const iconComponents = {
  award: FiAward,
  globe: FiGlobe,
  users: FiUsers,
  map: FiMap,
  shield: FiShield,
  heart: FiHeart
};

const WhyBookWithUs = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Why Booking with Nyika Safari
        </h2>
        <p className={styles.subtitle}>
          We are committed to providing exceptional safari experiences with personalized service and attention to detail.
        </p>
        
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => {
            const IconComponent = iconComponents[benefit.icon as keyof typeof iconComponents];
            
            return (
              <div 
                key={index} 
                className={styles.benefitCard}
              >
                <div className={styles.iconContainer}>
                  {IconComponent && <IconComponent className={styles.icon} />}
                </div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className={styles.ctaContainer}>
          <a href="/contact" className={styles.ctaButton}>
            Start Planning Your Safari
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;
