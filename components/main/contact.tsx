"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CONTACT_INFO } from "@/constants";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset submitted state after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="contact"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
        Get In Touch
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 w-full max-w-6xl">
        {/* Contact Info */}
        <motion.div
          variants={slideInFromLeft(0.5)}
          initial="hidden"
          animate="visible"
          className="bg-[rgba(3,0,20,0.5)] p-8 rounded-xl border border-[#2A0E61] shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-purple-400 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="ml-4">
                <h3 className="text-white text-sm font-medium">Email</h3>
                <p className="text-gray-300 text-sm mt-1">{CONTACT_INFO.email}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-purple-400 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div className="ml-4">
                <h3 className="text-white text-sm font-medium">Phone</h3>
                <p className="text-gray-300 text-sm mt-1">{CONTACT_INFO.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-purple-400 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="ml-4">
                <h3 className="text-white text-sm font-medium">Resume</h3>
                <p className="text-gray-300 text-sm mt-1">
                  <a 
                    href={CONTACT_INFO.resume} 
                    download
                    className="hover:text-purple-400 transition-colors duration-300 flex items-center"
                  >
                    Download Resume
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.div
          variants={slideInFromRight(0.5)}
          initial="hidden"
          animate="visible"
          className="bg-[rgba(3,0,20,0.5)] p-8 rounded-xl border border-[#2A0E61] shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Send Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full bg-[rgba(11,5,38,0.5)] text-white px-4 py-2 rounded-md border border-[#2A0E61] focus:border-purple-500 focus:outline-none transition-all duration-300"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full bg-[rgba(11,5,38,0.5)] text-white px-4 py-2 rounded-md border border-[#2A0E61] focus:border-purple-500 focus:outline-none transition-all duration-300"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gray-300 text-sm mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Your message..."
                className="w-full bg-[rgba(11,5,38,0.5)] text-white px-4 py-2 rounded-md border border-[#2A0E61] focus:border-purple-500 focus:outline-none transition-all duration-300"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-5 text-center rounded-md mt-2 transition-all duration-300 ${
                isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Send Message"}
            </button>
            
            {/* Success message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-900/50 border border-green-500 text-green-200 rounded-md p-3 text-center"
              >
                Thank you! Your message has been sent successfully.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};