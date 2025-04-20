"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/constants";
import { ProjectCard } from "../sub/project-card";
import { useState } from "react";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="projects"
    >
      <motion.div
        variants={slideInFromTop(0.2)}
        initial="hidden" 
        animate="visible"
        className="w-full flex flex-col items-center"
      >
        <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
          My Projects
        </h1>
        <p className="text-gray-300 text-center max-w-[900px] mb-10 px-6">
          Take a look at the projects I've worked on. Each project represents a unique challenge and solution in my journey as a developer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.title}
            variants={
              index % 3 === 0
                ? slideInFromLeft(0.4 * (index + 1))
                : index % 3 === 1
                ? slideInFromTop(0.4 * (index + 1))
                : slideInFromRight(0.4 * (index + 1))
            }
            initial="hidden"
            animate="visible"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative transform transition-all duration-300 hover:-translate-y-2"
          >
            <div 
              className={`absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 -z-10 ${
                hoveredIndex === index ? 'opacity-20' : ''
              }`}
            ></div>
            <ProjectCard
              title={project.title}
              description={project.description}
              src={project.image}
              link={project.link}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
