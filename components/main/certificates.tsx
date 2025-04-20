"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const Certificates = () => {
  const certificates = [
    {
      id: 1,
      src: "/certificate 1.jpg",
      alt: "Government of India Certificate for Quiz on Bharatiya Nagarik Suraksha Sanhita",
    },
    {
      id: 2,
      src: "/certificate 2.jpg",
      alt: "Certificate of Excellence for A Quest 2019 Event",
    },
    {
      id: 3,
      src: "/certificate 3.jpg",
      alt: "Certificate of Participation in AI Workshop",
    },
    {
      id: 4,
      src: "/certificate 4.jpg",
      alt: "Certificate of Participation in TECHATHON Coding Contest",
    },
    {
      id: 5,
      src: "/certificate 5.jpg",
      alt: "Certificate of Participation in Flipkart Runway Season 5",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? certificates.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === certificates.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="certificates"
    >
      <motion.div
        variants={slideInFromTop(0.2)}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
          My Certificates
        </h1>
        <p className="text-gray-300 text-center max-w-[900px] mb-10 px-6">
          A showcase of my academic achievements, workshop participations, and technical contest certifications.
        </p>
      </motion.div>

      <motion.div
        variants={slideInFromRight(0.5)}
        initial="hidden"
        animate="visible" 
        className="max-w-[1200px] w-full h-[600px] px-4 relative group"
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0E1016]/80 to-[#111827]/80 border border-[#2A0E61] shadow-xl overflow-hidden flex items-center justify-center p-4">
          <div className="relative w-full h-full max-h-[550px] flex items-center justify-center">
            <Image
              src={certificates[currentIndex].src}
              alt={certificates[currentIndex].alt}
              className="object-contain rounded-xl shadow-lg"
              fill
              priority
            />
          </div>
        </div>

        {/* Left Arrow */}
        <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-8 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer">
          <FiChevronLeft size={30} onClick={prevSlide} />
        </div>
        {/* Right Arrow */}
        <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-8 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer">
          <FiChevronRight size={30} onClick={nextSlide} />
        </div>

        <div className="flex top-4 justify-center py-6">
          {certificates.map((certificate, slideIndex) => (
            <div
              key={certificate.id}
              onClick={() => goToSlide(slideIndex)}
              className={`text-2xl cursor-pointer mx-2 ${
                currentIndex === slideIndex
                  ? "text-purple-500 scale-125"
                  : "text-gray-400"
              } transition-all duration-200`}
            >
              •
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={slideInFromLeft(0.5)}
        initial="hidden"
        animate="visible"
        className="text-gray-400 mt-6 text-center max-w-[800px]"
      >
        <p>{certificates[currentIndex].alt}</p>
      </motion.div>
    </div>
  );
}; 