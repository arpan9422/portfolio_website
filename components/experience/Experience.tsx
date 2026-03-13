import React from 'react'
import { Globe } from '../ui/globe';

function Experience() {
  const experiences = [
    {
      company: "Script Lanes",
      role: "Full Stack Developer Intern",
      duration: "June 2025 – Present",
      location: "Hybrid, Pune, India",
      description: "Contributed to the backend development of OrthoAI and FlourishAI, specialized AI-powered healthcare assistants.",
      highlights: [
        "Built 20+ REST APIs using a robust stack of Node.js, TypeScript, and Prisma.",
        "Designed a RAG pipeline using LangChain, significantly improving contextual accuracy and response times."
      ],
      tech: ['Node.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Vector DB', 'LangChain']
    },
    {
      company: "PICT TechFiesta",
      role: "Technical Head (Official College Hackathon)",
      duration: "2024 - 2025",
      location: "Pune, India",
      description: "Led the technical team to build and deploy a comprehensive hackathon management ecosystem.",
      highlights: [
        "Architected a fully functional website with a custom Admin Portal for real-time tracking.",
        "Eliminated third-party forms by implementing a native team registration system for all participants.",
        "Directed a cross-functional team to ensure high availability during peak registration traffic."
      ],
      tech: ['React', 'Node.js', 'Team Leadership', 'System Design', 'Database Management']
    }
  ];

  return (
    <section className="relative w-full bg-black text-white py-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono tracking-widest text-slate-500 text-sm uppercase italic">Professional Journey</span>
          <h2 className="text-4xl md:text-5xl font-sans font-semibold mt-2">Work & Leadership</h2>
        </div>

        <div className="space-y-20">
          {experiences.map((exp, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 border-t border-slate-800 font-sans pt-10 group">

              {/* Left Side: Company & Date */}
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{exp.company}</h3>
                <p className="text-cyan-400 font-mono text-sm">{exp.duration}</p>
                <p className="text-slate-100 text-md uppercase tracking-widest">{exp.role}</p>
                <p className="text-slate-400 text-xs">{exp.location}</p>
              </div>

              {/* Right Side: Achievements */}
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <p className="text-xl text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-4 text-slate-400 italic font-light border-l-2 border-slate-800 pl-6">
                    {exp.highlights.map((point, i) => (
                      <li key={i}>
                        "{point}"
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {exp.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 -left-4/5 w-full h-full hidden md:block">
          <Globe className="top-0 rotate-12 scale-125 md:scale-150" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.4),rgba(0,0,0,0))]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  )
}

export default Experience