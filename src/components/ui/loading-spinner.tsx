import React from 'react';
import styles from './loading-spinner.module.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  return <div className={styles.spinner}></div>;
};

export default LoadingSpinner;
