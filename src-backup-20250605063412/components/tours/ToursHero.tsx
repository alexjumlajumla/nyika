import Image from 'next/image';
import styles from './ToursHero.module.css';

export default function ToursHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Safari Tours & Packages</h1>
        <p className={styles.subtitle}>
          Discover the magic of Africa with our handpicked safari experiences
        </p>
      </div>
    </div>
  );
}
