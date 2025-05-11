'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
  density?: number; // Density of rain drops (1-100)
  speed?: number;   // Speed of animation (1-10)
  opacity?: number; // Opacity of rain (0.1-1)
  includeKanji?: boolean; // Include Japanese characters
}

const MatrixRain = ({ 
  className = "",
  density = 25,
  speed = 5,
  opacity = 0.3,
  includeKanji = true
}: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    // Include Latin, numbers, symbols and Japanese characters for authentic matrix effect
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>~`|\\';
    
    // Add Japanese katakana for authentic Matrix look if enabled
    if (includeKanji) {
      chars += 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    }
    
    // Calculate font size and columns based on density
    const fontSize = Math.max(10, Math.min(20, 20 - (density / 10)));
    const columns = Math.ceil(canvas.width / fontSize) * (density / 25);
    const drops: number[] = [];
    const charBrightness: number[] = []; // For varying brightness
    const charColor: string[] = []; // For occasional color variations

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100); // Start above canvas at random heights
      charBrightness[i] = 0.8 + Math.random() * 0.2; // Random brightness
      
      // Occasionally use a different color for variety
      const colorRoll = Math.random();
      if (colorRoll > 0.97) {
        charColor[i] = '#00c8ff'; // Occasional blue
      } else if (colorRoll > 0.94) {
        charColor[i] = '#ff3300'; // Occasional red
      } else {
        charColor[i] = '#39ff14'; // Default green
      }
    }

    // Animation
    const draw = () => {
      // Adjust the fade speed based on the user's speed parameter
      const fadeSpeed = 0.05 * (speed / 5);
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        // Skip some iterations based on density for performance
        if (i % (100 / density) !== 0) continue;
        
        if (drops[i] > 0) { // Only draw when drop is in view
          const text = chars[Math.floor(Math.random() * chars.length)];
          
          // Calculate gradient for head of stream
          const headGlow = Math.max(0, 1 - (drops[i] * 0.02));
          const brightness = Math.min(1, charBrightness[i] + headGlow);
          
          // Set color with varied brightness
          const color = charColor[i];
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness * opacity})`;
          ctx.font = `${fontSize}px "Source Code Pro", monospace`;
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          // Add glow effect to the lead character
          if (headGlow > 0.5) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            ctx.shadowBlur = 0;
          }
        }

        // Reset drop to top of screen when it reaches bottom + some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
          charBrightness[i] = 0.8 + Math.random() * 0.2;
        }
        
        // Advance the drop at varying speeds
        drops[i] += (0.5 + (Math.random() * 0.5)) * (speed / 5);
      }
    };

    // Calculate interval based on speed (lower interval = faster)
    const intervalTime = Math.max(10, 50 - (speed * 4));
    const interval = setInterval(draw, intervalTime);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [density, speed, opacity, includeKanji]);

  return (
    <canvas
      ref={canvasRef}
      className={`matrix-bg ${className}`}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0, 
        opacity
      }}
    />
  );
};

export default MatrixRain;