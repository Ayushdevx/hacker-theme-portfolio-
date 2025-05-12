'use client';

import { useContext } from 'react';
import { MobileContext, useMobile } from '../providers/MobileProvider';

// Use our mobile detection hook
export const useMobileDetection = () => {
  // Try to use the context provider first
  try {
    const context = useContext(MobileContext);
    return context.isMobile;
  } catch (e) {
    // Fallback to direct detection if context not available
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    }
    return false;
  }
};

// Export a variable for static/non-hook usage
export const isMobileDevice = typeof window !== 'undefined' ? 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
  false;
