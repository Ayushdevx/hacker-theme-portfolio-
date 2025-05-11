'use client';

import React, { useEffect } from 'react';

// Global scroll manager component
export const ScrollBlocker = () => {
  useEffect(() => {
    // Handle scroll events globally
    const blockUnwantedScrolls = (e: Event) => {
      // Check if we're trying to scroll to a component with a specific class
      const hash = window.location.hash;
      if (hash && hash === '#password-cracker') {
        // Block scrolling to this component
        e.preventDefault();
        // Get current position
        const position = window.scrollY;
        // Restore it immediately
        setTimeout(() => {
          window.scrollTo(0, position);
        }, 0);
      }
    };

    // Add passive event listeners for better performance
    window.addEventListener('scroll', blockUnwantedScrolls, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', blockUnwantedScrolls);
    };
  }, []);

  return null; // This component doesn't render anything
};
