'use client';

import { useMobile } from '../providers/MobileProvider';

// Re-export the hook from our provider
export const useMobileDetection = () => {
  // Get the mobile status from our context provider
  const { isMobile } = useMobile();
  return isMobile;
};

// Export a variable for static/non-hook usage
export const isMobileDevice = typeof window !== 'undefined' ? 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
  false;
