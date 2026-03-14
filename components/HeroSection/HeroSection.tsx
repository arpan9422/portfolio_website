'use client'
import React, { useEffect, useState } from "react";
import { GlassButton } from "../ui/glass-button";
import {
  CraftButton,
  CraftButtonIcon,
  CraftButtonLabel,
} from "../ui/craft-button";
import { ArrowUpRightIcon } from "lucide-react";
import DockText from "../ui/dock-text";
import { Particles } from "../ui/particles";
import { Meteors } from "../ui/meteors";
import SpaceshipCanvas from "../ui/spaceship";


function HeroSection() {
  const titles = ["Full-Stack", "GenAI", "Cloud"];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Start Fade Out
      setFade(false);

      // 2. Wait for fade out to finish, then swap text and fade back in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % titles.length);
        setFade(true);
      }, 500); // This matches the transition duration below
    }, 2000); // Change words every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative w-[90vw]  bg-black text-white flex flex-col justify-between items-start mt-20 mb-20">


      <div className=" mx-auto px-6 lg:px-16 w-full">
        <div className="relative h-[5vw] w-full overflow-hidden rounded-lg">
          <Particles size={0.2} quantity={400} />
          <Meteors />
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left">
            {/* Name Image */}
            <img
              src="/name.svg"
              alt="Alicia Smith"
              className="h-8 mb-6 mx-auto lg:mx-0"
            />
            {/* Heading */}

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-semibold leading-tight mb-6 font-mono">
              Your go-to engineer for <br />
              <span
                className={`inline-block text-white transition-all duration-500 ease-in-out ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
              >
                {titles[index]} projects
              </span>
            </h1>
            {/* Description */}
            <p className="text-gray-300 max-w-[90%] mx-auto lg:mx-0 mb-8 font-sans text-xl">

              Bringing your ideas to life with clean, efficient, and scalable
              code. Whether it's building web apps, optimizing performance, or
              solving complex technical challenges.
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <GlassButton asChild className="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700 transition">
                <a href="#contact">Contact me</a>
              </GlassButton>

              <CraftButton asChild className="bg-black">
                <a href="#projects">
                  <CraftButtonLabel className="font-sans text-md">
                    View Projects
                  </CraftButtonLabel>
                  <CraftButtonIcon>
                    <ArrowUpRightIcon className="size-3 stroke-2 transition-transform duration-500 group-hover:rotate-45" />
                  </CraftButtonIcon>
                </a>
              </CraftButton>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex-1 flex justify-center">
            <img
              src="/hero_section.png"
              alt="Hero Illustration"
              className="w-full  object-contain opacity-90"
            />
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
