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
  const fullText = "Aditi Singh";
  const typingSpeed = 150;
  const eraseSpeed = 100;
  const pauseDuration = 2000;
  const profileRef = useRef<HTMLDivElement>(null);

  // Simple mouse move effect for profile tilt
  useEffect(() => {
    const profileElement = profileRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!profileElement) return;
      
      const { left, top, width, height } = profileElement.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      // Calculate distance from center (normalized)
      const centerX = width / 2;
      const centerY = height / 2;
      const distanceX = (x - centerX) / (width / 2);
      const distanceY = (y - centerY) / (height / 2);
      
      // Apply gentle 3D rotation effect
      profileElement.style.transform = `
        perspective(1000px) 
        rotateX(${distanceY * 5}deg) 
        rotateY(${-distanceX * 5}deg)
      `;
    };
    
    const resetTransform = () => {
      if (!profileElement) return;
      profileElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    profileElement?.addEventListener('mouseleave', resetTransform);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      profileElement?.removeEventListener('mouseleave', resetTransform);
    };
  }, []);

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
        ref={profileRef}
      >
        <div className="relative w-[300px] h-[300px] profile-container group">
          {/* Glow effect with gradient */}
          <div className="profile-glow absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-cyan-500 to-violet-500 animate-rotate-glow opacity-75 blur-sm group-hover:blur-md transition-all duration-500"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-60 animate-pulse-slow blur-[2px] group-hover:opacity-80 transition-all duration-500"></div>
          
          {/* Main profile picture */}
          <div className="absolute inset-3 rounded-full overflow-hidden z-10 group-hover:scale-[1.02] transition-all duration-300">
            <Image
              src="/profile pic.jpg"
              alt="Aditi Singh"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              priority
            />
          </div>
          
          {/* Rotating border outline */}
          <div className="profile-outline absolute inset-0 rounded-full animate-rotate-border opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-[-3px] rounded-full border-2 border-dashed border-purple-400 opacity-30 group-hover:opacity-50 animate-rotate-border-reverse"></div>
          
          {/* Sparkle effects */}
          <div className="sparkle-1 absolute w-4 h-4 bg-white rounded-full opacity-0 top-5 right-5"></div>
          <div className="sparkle-2 absolute w-3 h-3 bg-white rounded-full opacity-0 bottom-10 left-0"></div>
          <div className="sparkle-3 absolute w-2 h-2 bg-white rounded-full opacity-0 top-1/2 right-0"></div>
          <div className="sparkle-4 absolute w-5 h-5 bg-white rounded-full opacity-0 bottom-5 right-10"></div>
          
          {/* Floating shapes */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-purple-500 rounded-full opacity-80 animate-float-slow"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-500 rounded-full opacity-80 animate-float-medium"></div>
          <div className="absolute top-1/2 -right-8 w-8 h-8 bg-violet-500 rounded-full opacity-80 animate-float-fast animate-pulse-slow"></div>
          <div className="absolute -top-8 left-1/4 w-5 h-5 bg-pink-400 rounded-full opacity-70 animate-float-medium"></div>
          <div className="absolute -bottom-6 right-1/4 w-7 h-7 bg-blue-400 rounded-full opacity-70 animate-float-slow"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
