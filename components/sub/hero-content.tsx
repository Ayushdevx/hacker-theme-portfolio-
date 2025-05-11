"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CONTACT_INFO } from "@/constants";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fullText = "YASHIKA KAINTH";
  const typingSpeed = 150;
  const eraseSpeed = 100;
  const pauseDuration = 2000;
  const profileRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Mark image as loaded
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Enhanced interactive profile effect
  useEffect(() => {
    const profileElement = profileRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!profileElement) return;
      
      // Only process mouse movements when the profile is hovered
      if (!isHovered) return;
      
      const { left, top, width, height } = profileElement.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      setMousePosition({ x, y });
      
      // Calculate distance from center (normalized)
      const centerX = width / 2;
      const centerY = height / 2;
      const distanceX = (x - centerX) / (width / 2);
      const distanceY = (y - centerY) / (height / 2);
      
      // Apply smooth 3D rotation with dynamic strength based on distance
      const rotationStrength = Math.min(Math.sqrt(distanceX ** 2 + distanceY ** 2) * 7, 10);
      
      // Prevent default behavior to avoid scroll interference
      e.preventDefault();
      
      profileElement.style.transform = `
        perspective(1000px) 
        rotateX(${distanceY * rotationStrength}deg) 
        rotateY(${-distanceX * rotationStrength}deg)
        scale(${isHovered ? 1.03 : 1})
      `;
    };
    
    const resetTransform = () => {
      if (!profileElement) return;
      profileElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      setIsHovered(false);
    };
    
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
      resetTransform();
    };
    
    // Add event listeners - only to the profile element, not the entire document
    profileElement?.addEventListener('mousemove', handleMouseMove);
    profileElement?.addEventListener('mouseenter', handleMouseEnter);
    profileElement?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      profileElement?.removeEventListener('mousemove', handleMouseMove);
      profileElement?.removeEventListener('mouseenter', handleMouseEnter);
      profileElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    let isErasing = false;
    let pauseTimer: NodeJS.Timeout | null = null;

    const typeText = () => {
      if (isErasing) {
        if (currentIndex > 0) {
          currentIndex--;
          setText(fullText.substring(0, currentIndex));
          timeout = setTimeout(typeText, eraseSpeed);
        } else {
          isErasing = false;
          pauseTimer = setTimeout(() => {
            timeout = setTimeout(typeText, typingSpeed);
          }, pauseDuration);
        }
      } else {
        if (currentIndex < fullText.length) {
          currentIndex++;
          setText(fullText.substring(0, currentIndex));
          timeout = setTimeout(typeText, typingSpeed);
        } else {
          isErasing = true;
          pauseTimer = setTimeout(() => {
            timeout = setTimeout(typeText, eraseSpeed);
          }, pauseDuration);
        }
      }
    };

    timeout = setTimeout(typeText, typingSpeed);

    return () => {
      clearTimeout(timeout);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-center justify-center px-10 md:px-20 mt-40 w-full z-[20]"
    >
      <div className="h-full w-full md:w-1/2 flex flex-col gap-5 justify-center m-auto text-start">
        <motion.div
          variants={slideInFromTop(0.3)}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]]"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">
            Full Stack Web Developer
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 typewriter">
            {text}<span className="cursor">|</span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          I&apos;m a Full Stack Web Developer and Computer Science student at Harcourt Butler Technical University, Kanpur. Passionate about creating engaging web experiences.
        </motion.p>

        <motion.div className="flex flex-row gap-5">
          <motion.a
            variants={slideInFromLeft(1)}
            href={CONTACT_INFO.resume}
            download
            className="py-2 px-4 button-primary text-center text-white cursor-pointer rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px 5px rgba(186, 156, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Resume</span>
          </motion.a>
          
          <motion.a
            variants={slideInFromLeft(1.2)}
            href="#contact"
            className="py-2 px-4 button-primary text-center text-white cursor-pointer rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px 5px rgba(186, 156, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Contact Me</span>
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full md:w-1/2 h-full flex justify-center items-center mt-10 md:mt-0"
        style={{ perspective: "1000px" }}
      >
        <div 
          className="relative w-[300px] h-[300px] profile-container transform-gpu"
          ref={profileRef}
        >
          {/* Animated background glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isLoaded ? [0.5, 0.8, 0.5] : 0,
              scale: isLoaded ? [0.9, 1.05, 0.9] : 0.8,
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut",
            }}
            className="absolute inset-[-15px] rounded-full bg-gradient-to-br from-purple-500 via-cyan-500 to-violet-500 blur-lg"
          />
          
          {/* Secondary reactive glow */}
          <motion.div 
            animate={{ 
              background: isHovered 
                ? "radial-gradient(circle at center, rgba(186, 156, 255, 0.6) 0%, rgba(156, 178, 255, 0.4) 50%, transparent 80%)" 
                : "radial-gradient(circle at center, rgba(186, 156, 255, 0.4) 0%, rgba(156, 178, 255, 0.2) 50%, transparent 80%)"
            }}
            className="absolute inset-[-8px] rounded-full opacity-90 transition-all duration-300 blur-sm"
          />
          
          {/* Multiple orbit lines */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-25px] rounded-full border border-purple-500/30"
          />
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-15px] rounded-full border border-cyan-500/20"
          />
          
          {/* Floating orbs */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0], 
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 5px 2px rgba(186, 156, 255, 0.3)",
                "0 0 15px 5px rgba(186, 156, 255, 0.5)",
                "0 0 5px 2px rgba(186, 156, 255, 0.3)",
              ]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-10 h-10 bg-purple-500 rounded-full opacity-80"
          />
          
          <motion.div
            animate={{ 
              y: [0, 15, 0], 
              x: [0, -8, 0],
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 5px 2px rgba(156, 178, 255, 0.3)",
                "0 0 12px 4px rgba(156, 178, 255, 0.5)",
                "0 0 5px 2px rgba(156, 178, 255, 0.3)",
              ]
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500 rounded-full opacity-80"
          />
          
          <motion.div
            animate={{ 
              y: [0, -15, 0], 
              x: [0, -10, 0],
              scale: [1, 1.15, 1],
              boxShadow: [
                "0 0 5px 2px rgba(233, 156, 255, 0.3)",
                "0 0 15px 5px rgba(233, 156, 255, 0.5)",
                "0 0 5px 2px rgba(233, 156, 255, 0.3)",
              ]
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 -right-8 w-8 h-8 bg-violet-500 rounded-full opacity-80"
          />
          
          {/* Interactive spotlight effect */}
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full z-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.15) 0%, transparent 70%)`,
              }}
            />
          )}
          
          {/* Profile image with subtle animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full overflow-hidden z-5 transform-gpu"
            style={{ willChange: "transform" }}
          >
            <Image
              src="/profile pic.jpg"
              alt="YASHIKA KAINTH"
              width={300}
              height={300}
              className="rounded-full object-cover w-full h-full"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJcMohCnQAAAABJRU5ErkJggg=="
              ref={imageRef}
            />
          </motion.div>
          
          {/* Subtle sparkle effects */}
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0 }}
            className="absolute w-3 h-3 top-5 right-10 rounded-full bg-white blur-[1px]"
          />
          
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
            className="absolute w-2 h-2 bottom-10 left-5 rounded-full bg-white blur-[1px]"
          />
          
          <motion.div
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 2 }}
            className="absolute w-2 h-2 top-1/3 left-10 rounded-full bg-white blur-[1px]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
