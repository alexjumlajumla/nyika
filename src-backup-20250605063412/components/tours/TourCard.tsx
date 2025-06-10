import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiClock, FiStar, FiHeart, FiShare2, FiEye } from 'react-icons/fi';
import styles from './TourCard.module.css';

export interface TourCardProps {
  id: string | number;
  title: string;
  slug: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  destinations: string[];
  image: string;
  highlights: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isLuxury?: boolean;
  isFamily?: boolean;
  discount?: number;
}

export default function TourCard({
  id,
  title,
  slug,
  duration,
  price,
  originalPrice,
  rating,
  reviewCount,
  destinations,
  image,
  highlights,
  isFeatured = false,
  isPopular = false,
  isLuxury = false,
  isFamily = false,
  discount = 0,
}: TourCardProps) {
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const formattedOriginalPrice = originalPrice
    ? originalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })
    : null;

  return (
    <div className={styles.card}>
      {/* Image Container */}
      <div className={styles.imageContainer}>
        <Image
          src={image || '/images/placeholder.jpg'}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.imageOverlay}></div>
        
        {/* Badges */}
        <div className={styles.badges}>
          {isFeatured && <span className={`${styles.badge} ${styles.featuredBadge}`}>Featured</span>}
          {isPopular && <span className={`${styles.badge} ${styles.popularBadge}`}>Popular</span>}
          {discount > 0 && (
            <span className={`${styles.badge} ${styles.discountBadge}`}>
              Save {discount}%
            </span>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button className={styles.actionButton} aria-label="Add to wishlist">
            <FiHeart className={styles.actionIcon} />
          </button>
          <button className={styles.actionButton} aria-label="Share">
            <FiShare2 className={styles.actionIcon} />
          </button>
          <button className={styles.actionButton} aria-label="Quick view">
            <FiEye className={styles.actionIcon} />
          </button>
        </div>
        
        {/* Rating */}
        <div className={styles.rating}>
          <FiStar className={styles.starIcon} />
          <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          <span className={styles.reviewCount}>({reviewCount})</span>
        </div>
      </div>
      
      {/* Content */}
      <div className={styles.content}>
        {/* Duration */}
        <div className={styles.duration}>
          <FiClock className={styles.icon} />
          <span>{duration}</span>
        </div>
        
        {/* Title */}
        <h3 className={styles.title}>
          <Link href={`/tours/${slug}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>
        
        {/* Destinations */}
        <div className={styles.destinations}>
          <FiMapPin className={styles.icon} />
          <span>{destinations.join(' → ')}</span>
        </div>
        
        {/* Highlights */}
        <div className={styles.highlights}>
          {highlights.slice(0, 3).map((highlight, index) => (
            <span key={index} className={styles.highlight}>
              {highlight}
            </span>
          ))}
        </div>
        
        {/* Footer */}
        <div className={styles.footer}>
          {/* Price */}
          <div className={styles.priceContainer}>
            {formattedOriginalPrice && (
              <div className={styles.originalPrice}>{formattedOriginalPrice}</div>
            )}
            <div className={styles.price}>
              <span className={styles.from}>From</span>
              <span className={styles.amount}>{formattedPrice}</span>
              <span className={styles.perPerson}>/person</span>
            </div>
          </div>
          {/* View Button */}
          <Link href={`/tours/${slug}`} className={styles.viewButton}>
            View Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
