"use client";
import React from "react";
import ProjectGrid from "./ProjectGrid";
import { GlassButton } from "../ui/glass-button";
import { CraftButton, CraftButtonIcon, CraftButtonLabel } from "../ui/craft-button";
import { ArrowUpRightIcon } from "lucide-react";

function ProjectSection() {
  return (
    <section className="w-[90vw] min-h-screen bg-black text-white flex flex-col justify-start items-center mt-20 mb-20">
      <h1 className="font-mono tracking-widest text-slate-300 text-md">
        PORTFOLIO
      </h1>
      <h1 className="font-mono text-slate-300 text-4xl mt-9 font-semibold">
        Discover what I've created
      </h1>
      <h1 className="font-sans max-w-xl text-slate-300 text-lg mt-6 text-center mx-auto">
        Each piece reflects my passion for innovation and commitment to
        delivering high-quality results. Feel free to explore and get inspired!
      </h1>
      <ProjectGrid />

      {/* <CraftButton>
        <CraftButtonLabel className="text-lg font-medium">View More Projects</CraftButtonLabel>
        <CraftButtonIcon>
          <ArrowUpRightIcon className="size-3 stroke-2 transition-transform duration-500 group-hover:rotate-45" />
        </CraftButtonIcon>
      </CraftButton> */}
      {/* <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div> */}
    </section>
  );
}

export default ProjectSection;
