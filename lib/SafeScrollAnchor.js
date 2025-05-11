'use client';

import React, { useEffect, useRef, useState } from 'react';
import { saveScrollPosition, restoreScrollPosition } from './scrollManager';

/**
 * SafeScrollAnchor component - Completely rewritten
 * 
 * This component creates an anchor point that can be linked to without 
 * triggering automatic scrolling. It aggressively preserves the user's scroll position.
 * 
 * @param {Object} props
 * @param {string} props.id - The ID to use for the anchor
 * @param {React.ReactNode} props.children - Child elements to render
 */
export default function SafeScrollAnchor({ id, children }) {
  const anchorRef = useRef(null);
  const lastKnownScrollPosition = useRef(0);
  const [isRendered, setIsRendered] = useState(false);
  
  // Phase 1: Initial mount - prevent any scroll effects
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Save initial position before anything else happens
    lastKnownScrollPosition.current = window.scrollY;
    
    // Set a flag to allow controlled rendering
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 100);
    
    // Clean up
    return () => clearTimeout(timer);
  }, []);
  
  // Phase 2: After render, actively monitor and prevent unwanted scroll behavior
  useEffect(() => {
    if (!isRendered || typeof window === 'undefined') return;
    
    // Immediately position back to where we were
    window.scrollTo({
      top: lastKnownScrollPosition.current,
      behavior: 'auto'
    });
    
    // Handle clicks on links to this anchor
    const handleAnchorClick = (e) => {
      if (e.target.getAttribute('href') === `#${id}`) {
        e.preventDefault();
        
        // Save current position
        saveScrollPosition();
        
        // Update URL without scrolling
        window.history.pushState(null, '', `#${id}`);
        
        // Restore position to prevent scroll jump
        setTimeout(() => {
          restoreScrollPosition();
        }, 0);
      }
    };
    
    // Block attempts to scroll to this ID
    const preventScrollToThis = () => {
      if (window.location.hash === `#${id}`) {
        // If hash matches this component, restore last good position
        window.scrollTo({
          top: lastKnownScrollPosition.current,
          behavior: 'auto'
        });
      } else {
        // Otherwise, update our last known good position
        lastKnownScrollPosition.current = window.scrollY;
      }
      
      // Special handling for network-scanner to prevent any scrolling to it
      if (id === 'network-scanner') {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element is in view or close to being in view
          if (rect.top < window.innerHeight * 1.5) {
            // Force scroll to last known good position
            window.scrollTo({
              top: lastKnownScrollPosition.current,
              behavior: 'auto'
            });
          }
        }
      }
    };
    
    // Actively monitor scroll attempts - more frequently for network-scanner
    const scrollMonitor = setInterval(
      preventScrollToThis, 
      id === 'network-scanner' ? 50 : 100
    );
    
    // Add listener to document for all link clicks
    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('scroll', preventScrollToThis, { passive: true });
    window.addEventListener('hashchange', preventScrollToThis);
    
    // Run once to prevent initial auto scrolling
    preventScrollToThis();
    
    // For network-scanner, override scrollIntoView method
    if (id === 'network-scanner' && anchorRef.current) {
      const originalScrollIntoView = Element.prototype.scrollIntoView;
      
      // Override scrollIntoView for this element
      anchorRef.current.scrollIntoView = function() {
        // Do nothing, preventing scroll
        return;
      };
      
      return () => {
        // Restore original behavior on cleanup
        if (anchorRef.current) {
          anchorRef.current.scrollIntoView = originalScrollIntoView;
        }
        clearInterval(scrollMonitor);
        document.removeEventListener('click', handleAnchorClick);
        window.removeEventListener('scroll', preventScrollToThis);
        window.removeEventListener('hashchange', preventScrollToThis);
      };
    }
    
    return () => {
      clearInterval(scrollMonitor);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', preventScrollToThis);
      window.removeEventListener('hashchange', preventScrollToThis);
    };
  }, [id, isRendered]);
  
  return (
    <div 
      id={id} 
      ref={anchorRef}
      // Add specific attributes to prevent scroll anchoring
      style={{
        scrollMarginTop: '100vh', // Push scroll margin way out
        scrollSnapAlign: 'none',
        touchAction: 'none',
        scrollBehavior: 'auto',
        overscrollBehavior: 'none'
      }}
    >
      {children}
    </div>
  );
}
