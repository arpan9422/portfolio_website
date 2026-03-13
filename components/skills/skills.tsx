import React from 'react'

function Skills() {
  

  const skillGroups = [
    {
      category: "AI & Frameworks",
      skills: ["LangChain", "AnythingLLM", "VectorDB", "Prisma", "Flask", "Tailwind CSS","Next.js"],
      iconColor: "text-cyan-400"
    },
    {
      category: "Core Languages",
      skills: ["TypeScript", "JavaScript", "Python", "Java", "C++"],
      iconColor: "text-blue-500"
    },
    {
      category: "Databases & Subjects",
      skills: ["MongoDB", "MySQL", "PostgreSQL", "DSA", "OOP"],
      iconColor: "text-purple-500"
    },
    {
      category: "Cloud & Tools",
      skills: ["AWS", "Azure", "Google Cloud", "Docker", "Git", "Postman", "Swagger"],
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <section className="w-full bg-black text-white py-24 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <span className="font-mono tracking-[0.4em] text-slate-100 text-md  uppercase">
              Technical Stack
            </span>
            <h2 className="text-4xl md:text-6xl font-sans font-bold mt-4 tracking-tight">
              Tools I use to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">solve problems.</span>
            </h2>
          </div>
          <p className="text-slate-500 font-mono text-sm hidden md:block">
            // Full-stack & AI Expertise
          </p>
        </div>

        {/* Skills Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800/50 border border-slate-800 overflow-hidden rounded-3xl">
          {skillGroups.map((group, idx) => (
            <div 
              key={idx} 
              className="bg-black p-8 md:p-12 hover:bg-slate-900/40 transition-all duration-500 group"
            >
              <h3 className={`font-mono text-sm mb-8 tracking-widest uppercase ${group.iconColor}`}>
                {group.category}
              </h3>
              
              <div className="flex flex-wrap gap-x-6 gap-y-4 font-sans">
                {group.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="text-lg md:text-xl text-slate-300 font-medium group-hover:text-white transition-colors duration-300 px-4 py-2 hover:border-1 border-white rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Feature: Cloud Badges */}
        

      </div>
    </section>
  );
}


export default Skills
