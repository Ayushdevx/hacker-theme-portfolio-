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
  const fullText = "Aditi Singh";
  const typingSpeed = 150;
  const eraseSpeed = 100;
  const pauseDuration = 2000;
  const profileRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move effect for interactive cosmic elements
  useEffect(() => {
    const profileElement = profileRef.current;
    const containerElement = containerRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!profileElement || !containerElement) return;
      
      const { left, top, width, height } = containerElement.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      setMousePosition({ x, y });
      
      // Calculate distance from center (normalized)
      const centerX = width / 2;
      const centerY = height / 2;
      const distanceX = (x - centerX) / (width / 2);
      const distanceY = (y - centerY) / (height / 2);
      
      // Apply enhanced 3D rotation effect
      profileElement.style.transform = `
        perspective(1000px) 
        rotateX(${distanceY * 8}deg) 
        rotateY(${-distanceX * 8}deg)
        scale(${isHovered ? 1.05 : 1})
      `;
      
      // Create dynamic stars on mouse move with varied sizes
      if (Math.random() > 0.85) {
        createStar(x, y);
      }
      
      // Create cosmic dust particles
      if (Math.random() > 0.92) {
        createDustParticle(x, y);
      }
    };
    
    const createStar = (x: number, y: number) => {
      if (!containerElement) return;
      
      const size = Math.random() * 6 + 2;
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      
      containerElement.appendChild(star);
      
      // Remove the star after animation completes
      setTimeout(() => {
        star.remove();
      }, 3000);
    };
    
    const createDustParticle = (x: number, y: number) => {
      if (!containerElement) return;
      
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 3 + 2;
      const angle = Math.random() * 360;
      const distance = Math.random() * 100 + 50;
      
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `hsl(${Math.random() * 60 + 260}, 70%, 70%)`;
      particle.style.boxShadow = `0 0 ${size * 2}px ${size}px hsla(${Math.random() * 60 + 260}, 70%, 70%, 0.3)`;
      particle.style.opacity = '0';
      
      containerElement.appendChild(particle);
      
      // Animate the particle
      setTimeout(() => {
        particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
      }, 10);
      
      // Remove the particle after animation completes
      setTimeout(() => {
        particle.remove();
      }, duration * 1000 + 10);
    };
    
    const resetTransform = () => {
      if (!profileElement) return;
      profileElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      setIsHovered(false);
    };
    
    // Enhance the profile with hover state
    const handleMouseEnter = () => {
      setIsHovered(true);
      if (profileElement) {
        profileElement.style.transition = 'transform 0.3s ease';
      }
    };
    
    const handleMouseLeave = () => {
      resetTransform();
      if (profileElement) {
        profileElement.style.transition = 'transform 0.5s ease';
      }
    };
    
    // Meteor shower effect with dynamic properties
    const createMeteor = () => {
      if (!containerElement) return;
      
      const startX = Math.random() * 100;
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 3 + 1;
      const duration = Math.random() * 3 + 2;
      
      const meteor = document.createElement('div');
      meteor.className = 'meteor';
      meteor.style.top = `${Math.random() * 50}%`;
      meteor.style.left = `${startX}%`;
      meteor.style.width = `${width}px`;
      meteor.style.height = `${height}px`;
      meteor.style.animationDuration = `${duration}s`;
      
      containerElement.appendChild(meteor);
      
      setTimeout(() => {
        meteor.remove();
      }, duration * 1000);
    };
    
    const pulsateOrbits = () => {
      if (!containerElement) return;
      
      const orbits = containerElement.querySelectorAll('.orbiting');
      orbits.forEach((orbit) => {
        const elem = orbit as HTMLElement;
        const currentSize = parseFloat(getComputedStyle(elem).width);
        const newSize = currentSize + (Math.random() * 2 - 1);
        elem.style.width = `${newSize}px`;
        elem.style.height = `${newSize}px`;
      });
    };
    
    const meteorInterval = setInterval(createMeteor, 2000);
    const orbitInterval = setInterval(pulsateOrbits, 500);
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    profileElement?.addEventListener('mouseenter', handleMouseEnter);
    profileElement?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      profileElement?.removeEventListener('mouseenter', handleMouseEnter);
      profileElement?.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(meteorInterval);
      clearInterval(orbitInterval);
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
      className="flex flex-col md:flex-row items-center justify-center px-10 md:px-20 mt-40 w-full z-[20] starfield"
      ref={containerRef}
    >
      <div className="h-full w-full md:w-1/2 flex flex-col gap-5 justify-center m-auto text-start">
        <motion.div
          variants={slideInFromTop(0.3)}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]] cosmic-glow"
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
            className="py-2 px-4 cosmic-button text-center text-white cursor-pointer rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Resume</span>
          </motion.a>
          
          <motion.a
            variants={slideInFromLeft(1.2)}
            href="#contact"
            className="py-2 px-4 cosmic-button text-center text-white cursor-pointer rounded-lg flex items-center space-x-2 hover:scale-105 transition-transform"
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
        className="w-full md:w-1/2 h-full flex justify-center items-center mt-10 md:mt-0 perspective-container"
        ref={profileRef}
      >
        <div className="relative w-[300px] h-[300px] profile-container group">
          {/* Cosmic glow effect with nebula-like background */}
          <div className="absolute inset-[-20px] rounded-full nebula-bg opacity-75 blur-sm group-hover:blur-md transition-all duration-500"></div>
          
          {/* Dynamic cosmic rays based on mouse position */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden z-[5] cosmic-rays"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
                           rgba(186, 156, 255, 0.4) 0%, 
                           rgba(156, 178, 255, 0.3) 30%, 
                           transparent 70%)`,
              opacity: isHovered ? 0.8 : 0.4,
              transition: 'opacity 0.3s ease'
            }}
          ></div>
          
          {/* Enhanced orbiting particles with varying speeds and paths */}
          <div className="absolute w-6 h-6 rounded-full bg-purple-500 opacity-70 orbiting-elliptical" 
               style={{ transformOrigin: 'center center', left: 'calc(50% - 3px)', top: 'calc(50% - 3px)' }}></div>
          <div className="absolute w-4 h-4 rounded-full bg-cyan-500 opacity-70 orbiting" 
               style={{ transformOrigin: 'center center', left: 'calc(50% - 2px)', top: 'calc(50% - 2px)', animationDelay: '-2s', animationDuration: '6s' }}></div>
          <div className="absolute w-5 h-5 rounded-full bg-pink-400 opacity-70 orbiting-reverse" 
               style={{ transformOrigin: 'center center', left: 'calc(50% - 2.5px)', top: 'calc(50% - 2.5px)', animationDelay: '-4s', animationDuration: '9s' }}></div>
          <div className="absolute w-3 h-3 rounded-full bg-blue-400 opacity-70 orbiting-elliptical" 
               style={{ transformOrigin: 'center center', left: 'calc(50% - 1.5px)', top: 'calc(50% - 1.5px)', animationDelay: '-1s', animationDuration: '7s' }}></div>
          
          {/* Main profile picture with enhanced hover effects */}
          <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#030014] z-10 hover-float profile-image-container">
            <Image
              src="/profile pic.jpg"
              alt="Aditi Singh"
              layout="fill"
              objectFit="cover"
              className="rounded-full profile-image"
              priority
            />
            
            {/* Interactive highlight overlay on profile image */}
            <div 
              className="absolute inset-0 z-20 profile-highlight"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
                             rgba(255, 255, 255, 0.2) 0%, 
                             transparent 70%)`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            ></div>
          </div>
          
          {/* Enhanced pulsating border with dynamic properties */}
          <div className="absolute inset-[-5px] rounded-full pulsating-border z-[9]"></div>
          <div className="absolute inset-[-10px] rounded-full border border-purple-400/30 animate-spin-slow z-[8]"></div>
          <div className="absolute inset-[-15px] rounded-full border border-cyan-400/20 animate-spin-reverse-slow z-[7]"></div>
          
          {/* Cosmic sparkles */}
          <div className="absolute w-5 h-5 top-0 right-[20%] star" style={{ animationDelay: '0s' }}></div>
          <div className="absolute w-4 h-4 bottom-[10%] left-[15%] star" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute w-3 h-3 top-[30%] right-0 star" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-6 h-6 bottom-0 right-[30%] star" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Galaxy background effect */}
          <div className="absolute inset-[-40px] -z-10 galaxy-swirl opacity-40"></div>
          
          {/* Floating cosmic elements with enhanced animations */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-purple-500 rounded-full opacity-80 hover-float cosmic-orb" 
               style={{ animationDuration: '4s' }}></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500 rounded-full opacity-80 hover-float cosmic-orb" 
               style={{ animationDelay: '-1s', animationDuration: '5s' }}></div>
          <div className="absolute top-1/2 -right-8 w-8 h-8 bg-violet-500 rounded-full opacity-80 hover-float cosmic-glow cosmic-orb" 
               style={{ animationDelay: '-2s', animationDuration: '6s' }}></div>
          <div className="absolute -top-8 left-1/4 w-5 h-5 bg-pink-400 rounded-full opacity-70 hover-float cosmic-orb" 
               style={{ animationDelay: '-1.5s', animationDuration: '7s' }}></div>
          <div className="absolute -bottom-6 right-1/4 w-7 h-7 bg-blue-400 rounded-full opacity-70 hover-float cosmic-orb" 
               style={{ animationDelay: '-0.5s', animationDuration: '4.5s' }}></div>
          
          {/* Black hole effect in the background */}
          <div className="absolute -z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 black-hole opacity-30"></div>
          
          {/* Energy waves that emanate on hover */}
          <div className={`absolute inset-[-30px] rounded-full energy-wave wave-1 ${isHovered ? 'active' : ''}`}></div>
          <div className={`absolute inset-[-30px] rounded-full energy-wave wave-2 ${isHovered ? 'active' : ''}`}></div>
          <div className={`absolute inset-[-30px] rounded-full energy-wave wave-3 ${isHovered ? 'active' : ''}`}></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
