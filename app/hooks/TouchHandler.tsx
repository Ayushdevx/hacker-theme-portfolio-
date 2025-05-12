'use client';

import React, { useEffect } from 'react';
import { useMobileDetection } from './useMobileDetection';

interface TouchHandlerProps {
  children: React.ReactNode;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

/**
 * TouchHandler - Component to handle touch events in a React-friendly way
 * This helps fix issues with React 18's strict mode and hydration
 */
export const TouchHandler: React.FC<TouchHandlerProps> = ({ 
  children,
  containerClassName = '',
  containerStyle = {}
}) => {
  const isMobile = useMobileDetection();
  
  useEffect(() => {
    if (!isMobile) return;
    
    // Find all scrollable elements in this container and apply fixes
    const applyTouchFixes = () => {
      // Get the container with a small delay to ensure it's mounted
      setTimeout(() => {
        const containers = document.querySelectorAll('.touch-handler-container');
        containers.forEach(container => {
          const scrollableElements = container.querySelectorAll('.overflow-y-auto, .overflow-auto, .scroll-container, .log-container');
          
          scrollableElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.touchAction = 'auto';
              el.style.webkitOverflowScrolling = 'touch';
              el.style.overflowY = 'auto';
            }
          });
        });
      }, 100);
    };
    
    applyTouchFixes();
    window.addEventListener('resize', applyTouchFixes);
    
    return () => {
      window.removeEventListener('resize', applyTouchFixes);
    };
  }, [isMobile]);
  
  // Merge the provided styles with our default styles
  const mergedStyles = {
    touchAction: 'auto',
    webkitOverflowScrolling: 'touch',
    overscrollBehavior: 'auto',
    position: 'relative',
    ...containerStyle
  };
  
  return (
    <div 
      className={`touch-handler-container mobile-friendly ${containerClassName}`}
      style={mergedStyles}
    >
      {children}
    </div>
  );
};

export default TouchHandler;
