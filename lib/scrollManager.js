'use client';

// scrollManager.js
// This utility helps manage scroll position and prevent unwanted auto-scrolling
// Modified to be more mobile-friendly

// Maintain the last known scroll position
let lastScrollPosition = 0;

// Track if we're currently in a programmatic scroll operation
let isScrolling = false;

// Flag to temporarily disable scroll prevention
let scrollPreventionEnabled = true;

// Detect if we're on a mobile device
const isMobileDevice = typeof window !== 'undefined' && 
  (window.navigator.userAgent.match(/Android/i) ||
   window.navigator.userAgent.match(/webOS/i) ||
   window.navigator.userAgent.match(/iPhone/i) ||
   window.navigator.userAgent.match(/iPad/i) ||
   window.navigator.userAgent.match(/iPod/i) ||
   window.navigator.userAgent.match(/BlackBerry/i) ||
   window.navigator.userAgent.match(/Windows Phone/i));

// Save the current scroll position
export function saveScrollPosition() {
  if (typeof window !== 'undefined') {
    lastScrollPosition = window.scrollY;
  }
}

// Restore the saved scroll position
export function restoreScrollPosition() {
  // Don't interfere with scrolling on mobile devices
  if (isMobileDevice) return;
  
  if (typeof window !== 'undefined' && !isScrolling && scrollPreventionEnabled) {
    isScrolling = true;
    window.scrollTo({
      top: lastScrollPosition,
      behavior: 'auto' // Use 'auto' instead of 'smooth' to avoid animation
    });
    
    // Reset the flag after scroll is complete
    setTimeout(() => {
      isScrolling = false;
    }, 50);
  }
}

// Temporarily enable user scrolling
export function enableUserScrolling(timeInMs = 1000) {
  scrollPreventionEnabled = false;
  
  setTimeout(() => {
    scrollPreventionEnabled = true;
    saveScrollPosition(); // Update position when re-enabling
  }, timeInMs);
}

// Prevent scroll to hash
export function preventHashScroll() {
  if (typeof window !== 'undefined' && window.location.hash) {
    saveScrollPosition();
    
    // Very small timeout to let the browser try to scroll, then override it
    setTimeout(() => {
      restoreScrollPosition();
    }, 0);
  }
}

// Handle scroll events to prevent unwanted jumps
function handleScroll() {
  if (!isScrolling && scrollPreventionEnabled) {
    // If scroll position changes significantly from last saved position
    // and we're not in a programmatic scroll operation, save the new position
    if (Math.abs(window.scrollY - lastScrollPosition) > 50) {
      saveScrollPosition();
    }
  }
}

// Initialize scroll prevention
export function initScrollManager() {
  if (typeof window !== 'undefined') {
    // Save initial position
    saveScrollPosition();
    
    // Prevent auto-scrolling on hash changes
    window.addEventListener('hashchange', preventHashScroll, { passive: true });
    
    // Monitor scroll position
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run once to prevent initial auto scrolling
    preventHashScroll();
    
    return () => {
      window.removeEventListener('hashchange', preventHashScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }
  
  return () => {};
}
