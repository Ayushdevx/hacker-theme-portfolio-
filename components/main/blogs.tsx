"use client";

import { BLOGS } from "@/constants";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { FaBook } from "react-icons/fa";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const Blogs = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="blogs"
    >
      <motion.div
        variants={slideInFromTop(0.2)}
        initial="hidden" 
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
          My Blogs
        </h1>
        <p className="text-gray-300 text-center max-w-[900px] mb-10 px-6">
          Explore my thoughts and insights on development, technology, and my journey as a programmer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-10 px-10 max-w-4xl w-full">
        {BLOGS.map((blog, index) => (
          <motion.div
            key={blog.title}
            variants={slideInFromLeft(0.5)}
            initial="hidden"
            animate="visible"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative transform transition-all duration-300 hover:-translate-y-2"
          >
            <Link
              href={blog.link}
              target="_blank"
              rel="noreferrer noopener"
              className="block"
            >
              <div className={`rounded-lg overflow-hidden border border-[#2A0E61] bg-gradient-to-br from-[#0E1016]/80 to-[#111827]/80 shadow-lg transition-all duration-300 ${
                hoveredIndex === index ? 'border-purple-500 shadow-purple-500/20' : ''
              }`}>
                <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <FaBook className="text-white text-4xl" />
                  </div>
                  
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-3 text-center md:text-left">{blog.title}</h2>
                    <p className="text-gray-300 mb-4 text-center md:text-left">{blog.description}</p>
                    
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="text-sm bg-gradient-to-r from-purple-500 to-cyan-500 py-1 px-3 rounded-full text-white">
                        Read PDF
                      </span>
                      <span className="ml-4 text-gray-400 text-sm">June 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 