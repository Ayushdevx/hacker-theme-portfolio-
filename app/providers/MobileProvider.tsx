'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the context type
interface MobileContextType {
  isMobile: boolean;
}

// Create the context with a default value
export const MobileContext = createContext<MobileContextType>({ isMobile: false });

// Custom hook to use the mobile context
export const useMobile = () => useContext(MobileContext);

// Provider component
export const MobileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
      
      // Add a class to the body for CSS targeting
      if (isMobileDevice) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };
    
    // Initial check
    checkMobile();
    
    // Re-check on resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};

// Export the isMobile property directly for simpler use
export const useMobileDetection = () => {
  const { isMobile } = useMobile();
  return isMobile;
};
