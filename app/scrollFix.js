'use client';

// scrollFix.js - Main scroll handler for mobile compatibility
// This script will detect mobile devices and add necessary events to ensure smooth scrolling

export function initMobileScrollFix() {
  if (typeof window === 'undefined') return () => {};
  
  // Detect if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (!isMobile) return () => {};
  
  // Add mobile class to body for CSS targeting
  document.body.classList.add('mobile-device');
  
  // Helper to enable touch actions on all elements
  const enableTouchActions = () => {
    const scrollableElements = document.querySelectorAll(
      '[id^="component-"], [class*="component"], .neo-panel, .overflow-y-auto, .log-container, ' +
      '#network-scanner, #password-cracker, #terminal-section, #system-info-section, .main-content'
    );
    
    scrollableElements.forEach(el => {
      const element = el;
      if (element instanceof HTMLElement) {
        element.style.touchAction = 'auto';
        element.style.webkitOverflowScrolling = 'touch';
        element.style.overscrollBehavior = 'auto';
        element.style.position = 'relative';
      }
    });
  };
  
  // Remove any event listeners that might be interfering with touch scrolling
  const fixTouchEvents = () => {
    const originalPreventDefault = TouchEvent.prototype.preventDefault;
    
    // Only override preventDefault if it's actively stopping passive events
    TouchEvent.prototype.preventDefault = function() {
      if (this.cancelable) {
        originalPreventDefault.apply(this);
      }
    };
    
    // Release all touch captures to prevent scroll blocking
    document.addEventListener('touchstart', (e) => {
      if (e.target && e.target instanceof HTMLElement) {
        // Don't block touch events on scrollable containers
        if (
          e.target.closest('.overflow-y-auto') || 
          e.target.closest('.overflow-auto') ||
          e.target.closest('.log-container') ||
          e.target.closest('.mobile-scroll-container')
        ) {
          return;
        }
      }
    }, { passive: true });
  };
  
  // Run our fixes
  enableTouchActions();
  fixTouchEvents();
  
  // Run again after a small delay to catch dynamically added elements
  const timeoutId = setTimeout(() => {
    enableTouchActions();
  }, 500);
  
  // And again when page is fully loaded
  window.addEventListener('load', enableTouchActions);
  
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('load', enableTouchActions);
  };
}
