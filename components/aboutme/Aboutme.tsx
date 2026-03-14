import React from "react";
import { GlassButton } from "../ui/glass-button";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";
import SpaceshipCanvas from "../ui/spaceship";

function Aboutme() {
  return (
    // Added py-20 for vertical breathing room on mobile
    // Changed w-full to overflow-hidden to prevent horizontal scroll issues with gradients
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col lg:flex-row justify-center items-center px-6 md:px-10 lg:px-20 gap-10 lg:gap-16 py-20 overflow-hidden">
      <div className="hidden md:block">
        <SpaceshipCanvas />
      </div>
      {/* Image Container */}
      {/* Added w-full and max-w-sm on mobile to prevent the image from being too huge */}
      <div className="relative w-full flex-1 flex justify-center items-center order-1 lg:order-1">
        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-xl">
          <img
            src="/downpage.png"
            alt="Arpan Agrawal"
            className="w-full h-auto object-contain rounded-2xl"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Text Content */}
      {/* Center items on mobile (items-center text-center) and left-align on desktop (lg:items-start lg:text-left) */}
      <div className="flex-1 flex flex-col gap-6 items-center text-center lg:items-start lg:text-left order-2 lg:order-2 font-semibold">
        <div className="space-y-2">
          <span className="font-mono tracking-[0.3em] text-slate-400 text-xs md:text-sm font-bold uppercase">
            About Me
          </span>
          <h1 className="font-mono text-slate-100 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            Developer who <span className="text-blue-500">loves</span> to build stuff.
          </h1>
        </div>

        <p className="text-slate-400 text-base md:text-lg max-w-md font-light leading-relaxed font-semi">
          I am <span className="text-white font-medium">Arpan Agrawal</span>, a third-year engineering student with a deep interest in <span className="text-white font-semibold italic">Generative AI</span>.
          I thrive on building innovative solutions to complex problems, focusing on precision and user-centric design.
        </p>

        {/* Action Buttons */}
        {/* Changed to flex-col on very small screens, row on everything else */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
          <GlassButton className="w-full sm:w-auto">Contact me</GlassButton>
          <a
            href="/Arpan_Agrawal_resume.pdf"
            download="Arpan_Agrawal_resume.pdf"
            className="w-full sm:w-auto"
          >
            <Button
              variant='outline'
              className='w-full sm:w-auto border-primary border-dashed shadow-none text-black hover:text-white hover:bg-black bg-white flex items-center justify-center gap-2'
            >
              <DownloadIcon size={18} />
              Resume
            </Button>
          </a>
        </div>
      </div>

    </section>
  );
}

export default Aboutme;