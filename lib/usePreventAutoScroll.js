'use client';

// usePreventAutoScroll.js
// This hook prevents automatic scrolling to an element when the URL hash changes

import { useEffect, useRef } from 'react';
import { enableUserScrolling } from './scrollManager';

export function usePreventAutoScroll() {
  // Keep track of initial mount position
  const initialPositionRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Don't interfere with scrolling on mobile devices
    if (isMobile) return;
    
    // Store the current scroll position
    const savedPosition = window.scrollY;
    initialPositionRef.current = savedPosition;
    
    // Function to restore scroll position
    const preventAutoScroll = () => {
      // Very small timeout to let the browser try to scroll, then override it
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 0);
    };
    
    // Handle when the user is actually trying to scroll
    const handleUserScroll = () => {
      const currentPosition = window.scrollY;
      const diff = Math.abs(currentPosition - initialPositionRef.current);
      
      // If user has scrolled significantly, allow natural scrolling for a bit
      if (diff > 100) {
        enableUserScrolling(2000);
      }
    };
    
    // Listen for the hashchange event
    window.addEventListener('hashchange', preventAutoScroll, { passive: true });
    
    // Monitor when user is actually trying to scroll
    window.addEventListener('scroll', handleUserScroll, { passive: true });
    
    // Also run once to prevent initial auto scrolling if the page loads with a hash
    if (window.location.hash) {
      preventAutoScroll();
    }
    
    // Clean up the event listeners
    return () => {
      window.removeEventListener('hashchange', preventAutoScroll);
      window.removeEventListener('scroll', handleUserScroll);
    };
  }, []);
}
