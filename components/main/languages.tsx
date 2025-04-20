"use client";

import { motion } from "framer-motion";
import { LANGUAGES } from "@/constants";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const Languages = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="languages"
    >
      <motion.div
        variants={slideInFromTop(0.2)}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
          Languages
        </h1>
        <p className="text-gray-300 text-center max-w-[900px] mb-10 px-6">
          I'm fluent in multiple languages which helps me connect with clients and colleagues globally.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 w-full max-w-4xl">
        {LANGUAGES.map((language, index) => (
          <motion.div
            key={language.name}
            variants={index % 2 === 0 ? slideInFromLeft(0.5 + index * 0.1) : slideInFromRight(0.5 + index * 0.1)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-br from-[#0E1016] to-[#111827] border border-[#2A0E61] shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{language.name}</h2>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2.5 rounded-full" 
                style={{ 
                  width: language.level === "Native" ? "100%" : 
                         language.level === "Fluent" ? "85%" : 
                         language.level === "Intermediate" ? "65%" : "45%" 
                }}
              ></div>
            </div>
            <p className="text-gray-300 mt-2">{language.level}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
 