import Aboutme from "@/components/aboutme/Aboutme";
import ContactSection from "@/components/ContactSection/ContactSection";
import Experience from "@/components/experience/Experience";
import HeroSection from "@/components/HeroSection/HeroSection";
import ProjectSection from "@/components/projectSection/projectSection";
import Skills from "@/components/skills/skills";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
      <HeroSection />
      <div className="w-full h-[1px] bg-slate-800"></div>
      <section id="experience">
        <Experience />
      </section>
      <div className="w-full h-[1px] bg-slate-800"></div>
      <section id="projects">
        <ProjectSection />
      </section>
      <div className="w-full h-[1px] bg-slate-800"></div>
      <section id="Skills">
        <Skills />
      </section>
      <div className="w-full h-[1px] bg-slate-800"></div>
      <section id="about">
        <Aboutme />
      </section>
      <div className="w-full h-[1px] bg-slate-800"></div>
      <section id="contact">
        <ContactSection />
      </section>
    </div>
  );
}
