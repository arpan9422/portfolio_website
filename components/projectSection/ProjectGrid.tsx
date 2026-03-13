import { ProjectCard } from "./ProjectCard";
import { Github, Globe } from "lucide-react";

const projects = [
  {
    title: "StackWise",
    description:
      "AI-powered summaries of the latest engineering blogs from top tech companies. Stay informed without the information overload.",
    dates: "2024",
    tags: ["Ongoing", "Next.js", "AI", "TypeScript"],
    image: "/stackwise2.jpg",
    links: [
      {
        type: "Website",
        href: "#",
        icon: <Globe className="size-3" />,
      },
    ],
  },
  {
    title: "Udemy-RAG",
    description: "Built an AI-powered personal course assistant that transforms enrolled Udemy courses into a private knowledge base (RAG) by automatically scraping learning resources.",
    dates: "2023 - 2024",
    tags: ["Python", "LangChain", "Vector DB"],
    image: "/udemy-rag.jpg",
    links: [
      {
        type: "Source",
        href: "#",
        icon: <Github className="size-3" />,
      },
    ],
  },
  {
    title: "PasteRoom",
    description: "A real-time file and text sharing platform that enables users to create secure virtual rooms using unique IDs for seamless collaboration.",
    dates: "2023",
    tags: ["WebSockets", "Node.js", "React"],
    image: "/pasteroom.jpg",
    links: [
      {
        type: "Source",
        href: "#",
        icon: <Github className="size-3" />,
      },
    ],
  },
  {
    title: "CampusResult",
    description: "A platform that reveals college student results ahead of the official college website by utilizing open APIs and a bit of common sense.",
    dates: "2024",
    tags: ["Open API", "Next.js", "Analytics"],
    image: "/campusresult.png",
    links: [
      {
        type: "Website",
        href: "https://campusresults.app",
        icon: <Globe className="size-3" />,
      },
    ],
  },
  {
    title: "Wisdomly",
    description: "Coming Soon - A specialized freelancing platform designed exclusively for retired professionals to continue offering their invaluable expertise on their own terms.",
    dates: "2024",
    tags: ["Ongoing", "React", "Freelancing", "Marketplace"],
    image: "/wisdomly.png", // Optional fallback image
    links: [
      {
        type: "Website",
        href: "#",
        icon: <Globe className="size-3" />,
      },
    ],
  },
  {
    title: "TechFiesta",
    description: "PICT's flagship hackathon website. Facilitated 800+ seamless registrations and slot booking. Served as the Technical Head for the platform.",
    dates: "2024 - 2025",
    tags: ["React", "Node.js", "Hackathon"],
    image: "/techfiesta.png",
    links: [
      {
        type: "Website",
        href: "https://techfiesta.pict.edu",
        icon: <Globe className="size-3" />,
      },
    ],
  },
];

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 max-w-7xl mx-auto">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          description={project.description}
          dates={project.dates}
          tags={project.tags}
          image={project.image}
          links={project.links}
        />
      ))}
    </div>
  );
}