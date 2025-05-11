'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface TypewriterEffectProps {
  text: string | string[];
  speed?: number;           // Typing speed in milliseconds per character
  startDelay?: number;      // Delay before typing starts
  loop?: boolean;           // Whether to loop through texts array
  deleteSpeed?: number;     // Speed for deleting text (backspacing)
  delayAfterComplete?: number; // Delay after text is complete before deleting/next text
  onComplete?: () => void;  // Callback when typing is complete
  className?: string;
  cursorStyle?: ReactNode;  // Custom cursor element
  hideCursorOnComplete?: boolean; // Hide the cursor after typing is complete
}

const TypewriterEffect = ({
  text,
  speed = 50,
  startDelay = 0,
  loop = false,
  deleteSpeed = 30,
  delayAfterComplete = 1500,
  onComplete,
  className = '',
  cursorStyle = <span className="terminal-cursor">▌</span>,
  hideCursorOnComplete = false
}: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const isMounted = useRef(true);
  
  // Convert single string to array for consistent handling
  const textArray = Array.isArray(text) ? text : [text];
  
  // Get current text from array
  const currentText = textArray[textIndex % textArray.length];

  useEffect(() => {
    // Clean up on unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset state when text prop changes
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(false);
    setIsDeleting(false);
  }, [text]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Handle initial delay before typing starts
    if (!isTyping && !isDeleting && currentIndex === 0 && displayText === '') {
      timeout = setTimeout(() => {
        if (!isMounted.current) return;
        setIsTyping(true);
      }, startDelay);
      return () => clearTimeout(timeout);
    }
    
    // Handle typing
    if (isTyping && !isDeleting) {
      if (currentIndex < currentText.length) {
        // Type next character
        timeout = setTimeout(() => {
          if (!isMounted.current) return;
          setDisplayText(prev => prev + currentText.charAt(currentIndex));
          setCurrentIndex(prev => prev + 1);
        }, speed);
      } else {
        // Typing finished
        setIsTyping(false);
        
        // If loop is true or there are more texts to type, set timeout for deletion
        if ((loop || textIndex < textArray.length - 1)) {
          timeout = setTimeout(() => {
            if (!isMounted.current) return;
            setIsDeleting(true);
          }, delayAfterComplete);
        } else {
          // Final completion
          if (onComplete) onComplete();
          if (hideCursorOnComplete) {
            setTimeout(() => {
              if (!isMounted.current) return;
              setShowCursor(false);
            }, 1000);
          }
        }
      }
      return () => clearTimeout(timeout);
    }
    
    // Handle deleting
    if (isDeleting) {
      if (currentIndex > 0) {
        // Delete one character
        timeout = setTimeout(() => {
          if (!isMounted.current) return;
          setDisplayText(prev => prev.slice(0, -1));
          setCurrentIndex(prev => prev - 1);
        }, deleteSpeed);
      } else {
        // Deleting finished
        setIsDeleting(false);
        setIsTyping(true);
        
        // Move to next text
        setTextIndex(prev => prev + 1);
      }
      return () => clearTimeout(timeout);
    }
    
    // Start typing if not typing or deleting
    if (!isTyping && !isDeleting && (loop || textIndex < textArray.length - 1)) {
      setIsTyping(true);
    }
    
  }, [
    currentIndex, 
    displayText, 
    isTyping, 
    isDeleting, 
    currentText, 
    speed, 
    deleteSpeed, 
    startDelay, 
    delayAfterComplete, 
    textIndex, 
    textArray.length, 
    loop,
    onComplete,
    hideCursorOnComplete
  ]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && cursorStyle}
    </span>
  );
};

export default TypewriterEffect;
