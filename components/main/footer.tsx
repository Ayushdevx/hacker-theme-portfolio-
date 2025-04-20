"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaRegStar, FaStar } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiGithub, FiExternalLink } from "react-icons/fi";

import { FOOTER_DATA } from "@/constants";

export const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);
  const [starCount, setStarCount] = useState(0);
  const maxStars = 5;

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerPosition = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        setIsVisible(footerPosition.top < windowHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addStar = () => {
    if (starCount < maxStars) {
      setStarCount(prev => prev + 1);
      
      // Create a new star with random position
      const newStar = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 40,
        size: Math.random() * 0.5 + 0.5,
        opacity: 1
      };
      
      setStars(prev => [...prev, newStar]);
      
      // Remove the star after animation
      setTimeout(() => {
        setStars(prev => prev.filter(star => star.id !== newStar.id));
      }, 1000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div 
      id="footer"
      className="w-full relative overflow-hidden bg-gradient-to-b from-transparent to-[#0E1016]/60 text-gray-200 shadow-lg p-8 pt-16 mt-20"
    >
      {/* Animated stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute text-yellow-400 z-10"
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            opacity: [0, star.opacity, 0], 
            scale: [0, star.size, 0], 
            y: [0, -40, -60] 
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
        >
          <FaStar size={24} />
        </motion.div>
      ))}

      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Footer top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {FOOTER_DATA.map((column, colIndex) => (
            <motion.div
              key={column.title}
              variants={itemVariants}
              className="flex flex-col items-center md:items-start"
            >
              <h3 className="font-bold text-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
                {column.title}
              </h3>
              <div className="flex flex-col space-y-4">
                {column.data.map(({ icon: Icon, name, link }, itemIndex) => (
                  <motion.div
                    key={`${column.title}-${name}`}
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    className="transition-colors duration-300"
                  >
                    <Link
                      href={link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center group"
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500" />
                      ) : (
                        <HiOutlineMail className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500" />
                      )}
                      <span className="text-base">{name}</span>
                      <FiExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Additional contact section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="font-bold text-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Portfolio
            </h3>
            <p className="text-gray-400 mb-4 max-w-xs text-center md:text-left">
              Discover my projects, skills, and journey as a developer.
            </p>
            <div 
              className="flex items-center space-x-1 cursor-pointer mt-2 group"
              onClick={addStar}
            >
              <span className="text-gray-400 group-hover:text-gray-300">Enjoying this portfolio?</span>
              <div className="flex">
                {Array.from({ length: maxStars }).map((_, index) => (
                  index < starCount ? (
                    <FaStar key={index} className="text-yellow-400 w-4 h-4" />
                  ) : (
                    <FaRegStar key={index} className="text-gray-400 group-hover:text-yellow-400 w-4 h-4" />
                  )
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section with credits */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-[#2A0E61]/30 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center">
              <p className="text-gray-400 text-sm">
                Made with&nbsp;
              </p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FaHeartbeat className="text-purple-500 w-4 h-4" />
              </motion.div>
              <p className="text-gray-400 text-sm">
                &nbsp;by <Link href="https://github.com/Ayushdevx" target="_blank" rel="noreferrer noopener" className="text-purple-400 hover:text-purple-300 transition-colors">Ayush Upadhyay</Link> &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="https://github.com/IamAditiSingh08" className="text-gray-400 hover:text-purple-500 transition-colors">
              <FiGithub className="w-5 h-5" />
            </Link>
            <p className="text-gray-500 text-sm">
              All rights reserved
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
