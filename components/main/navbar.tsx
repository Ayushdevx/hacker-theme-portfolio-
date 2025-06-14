'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { NAV_LINKS, SOCIALS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNavClick = (e, sectionId) => {
    e.preventDefault(); // Prevent default anchor behavior
    
    // Get the element to scroll to
    const element = document.getElementById(sectionId);
    
    // If element exists, scroll smoothly to it
    if (element) {
      // Optional: close mobile menu if open
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md z-50 px-10">
      {/* Navbar Container */}
      <div className="w-full h-full flex items-center justify-between m-auto px-[10px]">
        {/* Logo + Name */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, 'about-me')}
          className="flex items-center"
        >
          <div className="hidden md:flex font-bold ml-[10px] text-gray-300">Yashika Kainth</div>
        </a>

        {/* Web Navbar */}
        <div className="hidden md:flex h-full flex-row items-center justify-center">
          <div className="flex items-center justify-center w-auto h-auto border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] mr-[15px] px-[28px] py-[10px] rounded-full text-gray-200">
            {NAV_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.link}
                onClick={(e) => handleNavClick(e, link.link.replace('#', ''))}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition px-4 whitespace-nowrap"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>

        {/* Social Icons (Web) */}
        <div className="hidden md:flex flex-row gap-5">
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              key={name}
            >
              <Icon className="h-6 w-6 text-white hover:text-[rgb(112,66,248)] transition-colors" />
            </Link>
          ))}
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white focus:outline-none text-4xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-[#030014] p-5 flex flex-col items-center text-gray-300 md:hidden">
          {/* Links */}
          <div className="flex flex-col items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition text-center py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mt-6">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                key={name}
              >
                <Icon className="h-8 w-8 text-white hover:text-[rgb(112,66,248)] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};