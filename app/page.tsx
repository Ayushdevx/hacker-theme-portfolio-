'use client';

import MatrixRain from './components/MatrixRain';
import HackerTerminal from './components/HackerTerminal';
import SystemInfo from './components/SystemInfo';
import NetworkScanner from './components/NetworkScanner';
import FileExplorer from './components/FileExplorer';
import PasswordCracker from './components/PasswordCracker';
import EncryptionTool from './components/EncryptionTool';
import HackerProfile from './components/HackerProfile';
import ThemeSwitcher from './components/ThemeSwitcher';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

// Import SafeScrollAnchor with no SSR to prevent hydration issues
const SafeScrollAnchor = dynamic(() => import('@/lib/SafeScrollAnchor.js'), { ssr: false });

export default function Home() {
  // Prevent scrolling to specific elements after initial load
  useEffect(() => {
    const preventAutoScroll = () => {
      // Force maintain scroll position
      const currentPosition = window.scrollY;
      // Small timeout to let any scroll attempt happen, then override it
      setTimeout(() => {
        window.scrollTo(0, currentPosition);
      }, 0);
    };
    
    // Set interval to keep monitoring for unwanted scrolls
    const intervalId = setInterval(preventAutoScroll, 100);
    
    // Clear after 3 seconds (when page is likely fully loaded/stable)
    setTimeout(() => {
      clearInterval(intervalId);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Add a more aggressive scroll prevention specifically for NetworkScanner
  useEffect(() => {
    // Store the user's last intentional scroll position
    let lastIntentionalScrollY = 0;
    let isManualScrolling = false;
    
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Skip scroll prevention on mobile devices
    if (isMobile) return;
    
    // Update the last intentional position when user is actively scrolling
    const handleUserScroll = () => {
      if (!isManualScrolling) {
        lastIntentionalScrollY = window.scrollY;
      }
    };
    
    // This function will be called when the page tries to scroll to NetworkScanner
    const preventNetworkScannerScroll = () => {
      // Check if we're at the NetworkScanner section (approximate position)
      const networkScannerElement = document.getElementById('network-scanner-section');
      if (!networkScannerElement) return;
      
      const networkScannerPosition = networkScannerElement.getBoundingClientRect().top;
      
      // If we're close to the NetworkScanner, it might be an auto-scroll attempt
      if (networkScannerPosition < window.innerHeight && networkScannerPosition > -100) {
        // Force scroll to the last known good position
        isManualScrolling = true;
        window.scrollTo({
          top: lastIntentionalScrollY,
          behavior: 'auto'
        });
        
        // Reset flag after scroll is complete
        setTimeout(() => {
          isManualScrolling = false;
        }, 50);
      }
    };
    
    // Set initial position
    lastIntentionalScrollY = window.scrollY;
    
    // Add event listeners
    window.addEventListener('scroll', handleUserScroll, { passive: true });
    window.addEventListener('scroll', preventNetworkScannerScroll, { passive: true });
    
    // Set up an interval to continuously check and prevent unwanted scrolling
    // This is more aggressive than the previous approach
    const intervalId = setInterval(preventNetworkScannerScroll, 100);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleUserScroll);
      window.removeEventListener('scroll', preventNetworkScannerScroll);
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <main className="min-h-screen bg-black text-green-500 p-2 xs:p-4 sm:p-8 relative">
      <MatrixRain />
      <ThemeSwitcher />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <HackerProfile />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <div id="terminal-section" className="relative no-scroll-capture"
            style={{ 
              touchAction: 'auto', 
              pointerEvents: 'auto',
              overscrollBehavior: 'auto',
              isolation: 'isolate'
            }}
          >
            <SafeScrollAnchor id="terminal">
              <HackerTerminal />
            </SafeScrollAnchor>
          </div>
          <div id="system-info-section" className="relative no-scroll-capture"
            style={{ 
              touchAction: 'auto', 
              pointerEvents: 'auto',
              overscrollBehavior: 'auto',
              isolation: 'isolate'
            }}
          >
            <SafeScrollAnchor id="system-info">
              <SystemInfo />
            </SafeScrollAnchor>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
          <div id="network-scanner-section" className="relative no-scroll-capture"
            style={{ 
              touchAction: 'auto', 
              pointerEvents: 'auto',
              overscrollBehavior: 'auto',
              isolation: 'isolate'
            }}
          >
            <SafeScrollAnchor id="network-scanner">
              <NetworkScanner />
            </SafeScrollAnchor>
          </div>
          <div className="w-full h-full">
            <FileExplorer />
          </div>
          <div 
            className="relative no-scroll-capture"
            style={{ 
              touchAction: 'auto', 
              pointerEvents: 'auto',
              overscrollBehavior: 'auto',
              isolation: 'isolate'
            }}
            onTouchStart={(e) => {
              // For mobile devices, use a more permissive touch approach
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              );
              
              if (isMobile) {
                // Allow touch events on mobile
                return;
              }
              
              // Desktop touch handling - only allow touch interaction on the component itself
              const target = e.target as HTMLElement;
              if (!target.closest('.prevent-scroll-jump')) {
                e.stopPropagation();
              }
            }}
            onTouchMove={(e) => {
              // For mobile devices, use a more permissive touch approach
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              );
              
              if (isMobile) {
                // Allow touch events on mobile
                return;
              }
              
              // Desktop touch handling - block touch movement outside the component
              const target = e.target as HTMLElement;
              if (!target.closest('.overflow-y-auto') && !target.closest('.overflow-auto')) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <SafeScrollAnchor id="password-cracker">
              <PasswordCracker />
            </SafeScrollAnchor>
          </div>
        </div>
        
        <EncryptionTool />
      </div>
    </main>
  );
}
