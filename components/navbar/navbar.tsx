'use client'
import React, { useState } from "react";
import { GlassButton } from "../ui/glass-button";
import { Menu, X } from "lucide-react"; // Using lucide-react for icons

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black sticky top-0 z-50 text-white px-6 md:px-16 py-4 md:py-6 flex items-center justify-between font-sans border-b border-white/10">
      
      {/* Left Section: Logos */}
      <div className="flex items-center gap-3">
        <img 
          src="/logo.svg" 
          alt="profile" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
        />
        <img 
          src="/name.svg" 
          alt="name" 
          className="h-5 md:h-6 object-contain"
        />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-8 font-stretch-50%">
        <a href="#projects" className="hover:text-gray-300 transition">Projects</a>
        <a href="#about" className="hover:text-gray-300 transition">About me</a>
        <a href="#experience" className="hover:text-gray-300 transition">Experience</a>
        <a href="#Skills" className="hover:text-gray-300 transition">Skills</a>

        <GlassButton>
          Contact me
        </GlassButton>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`
        absolute top-full left-0 w-full bg-black border-b border-white/10 flex flex-col items-center gap-6 py-8 transition-all duration-300 lg:hidden
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
      `}>
        <a href="#projects" onClick={() => setIsOpen(false)} className="text-xl hover:text-gray-300 transition">Projects</a>
        <a href="#about" onClick={() => setIsOpen(false)} className="text-xl hover:text-gray-300 transition">About me</a>
        <a href="#experience" onClick={() => setIsOpen(false)} className="text-xl hover:text-gray-300 transition">Experience</a>
        <a href="#Skills" onClick={() => setIsOpen(false)} className="text-xl hover:text-gray-300 transition">Skills</a>
        
        <GlassButton>
          Contact me
        </GlassButton>
      </div>
    </nav>
  );
}

export default Navbar;