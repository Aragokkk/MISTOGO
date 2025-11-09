// ResponsiveContainer.tsx
import React, { ReactNode } from 'react';
import styles from './ResponsiveContainer.module.css';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'desktop' | 'tablet' | 'mobile' | 'full';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '',
  maxWidth = 'desktop'
}) => {
  const maxWidthClass = {
    desktop: styles.maxWidthDesktop,
    tablet: styles.maxWidthTablet,
    mobile: styles.maxWidthMobile,
    full: styles.maxWidthFull
  }[maxWidth];

  return (
    <div className={`${styles.responsiveContainer} ${maxWidthClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;