'use client';

import { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  intensity?: number; // 1-10, controls glitch intensity
  color?: string;
  className?: string;
  glitchOnHover?: boolean;
  animated?: boolean;
}

const GlitchText = ({
  text,
  intensity = 5,
  color = '#39ff14',
  className = '',
  glitchOnHover = false,
  animated = true
}: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  // Random glitch effect for animation
  useEffect(() => {
    if (!animated) return;

    // Random glitch timing
    const glitchInterval = setInterval(() => {
      const shouldGlitch = Math.random() < 0.03 * (intensity / 5); // Adjust probability based on intensity
      
      if (shouldGlitch) {
        setIsGlitching(true);
        
        // Apply text distortion
        const distortedText = applyTextDistortion(text, intensity);
        setDisplayText(distortedText);
        
        // Reset after a short duration
        setTimeout(() => {
          setIsGlitching(false);
          setDisplayText(text);
        }, 150);
      }
    }, 1000);
    
    return () => clearInterval(glitchInterval);
  }, [text, intensity, animated]);

  // Apply text distortion based on intensity
  const applyTextDistortion = (originalText: string, intensityLevel: number) => {
    const distortionChars = "!@#$%^&*()_-+=<>?/|\\[]{}~`";
    const random = Math.random() * intensityLevel;
    
    // For very light distortion, just return the original
    if (random < 2) return originalText;
    
    // Medium distortion, replace 1-2 characters
    if (random < 5) {
      const chars = originalText.split('');
      const randomPos = Math.floor(Math.random() * chars.length);
      chars[randomPos] = distortionChars[Math.floor(Math.random() * distortionChars.length)];
      return chars.join('');
    }
    
    // Heavy distortion, replace multiple characters and add glitchy chars
    const chars = originalText.split('');
    const numDistortions = Math.ceil(random / 2);
    
    for (let i = 0; i < numDistortions; i++) {
      const randomPos = Math.floor(Math.random() * chars.length);
      chars[randomPos] = distortionChars[Math.floor(Math.random() * distortionChars.length)];
    }
    
    // Sometimes add an extra character for extreme glitching
    if (random > 8) {
      const randomPos = Math.floor(Math.random() * chars.length);
      chars.splice(randomPos, 0, distortionChars[Math.floor(Math.random() * distortionChars.length)]);
    }
    
    return chars.join('');
  };

  const handleMouseEnter = () => {
    if (glitchOnHover) {
      setIsGlitching(true);
    }
  };

  const handleMouseLeave = () => {
    if (glitchOnHover) {
      setIsGlitching(false);
      setDisplayText(text);
    }
  };

  return (
    <span
      className={`${className} ${isGlitching ? 'glitch' : ''}`}
      data-text={text}
      style={{ 
        color,
        position: 'relative',
        display: 'inline-block'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
};

export default GlitchText;
