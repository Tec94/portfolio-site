import React from 'react';
import TechTerminal from './TechTerminal';

export default function Skills() {
  const skillCategories = [
    {
      title: "Languages",
      skills: ["Python", "TypeScript", "JavaScript", "C++", "SQL"]
    },
    {
      title: "Frontend",
      skills: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS", "Framer Motion"]
    },
    {
      title: "Backend",
      skills: ["Node.js", "REST APIs", "PostgreSQL", "MongoDB", "Firebase"]
    },
    {
      title: "Tools",
      skills: ["Git", "Docker", "Vite", "ESLint", "Vercel", "Lighthouse"]
    }
  ];

  return <TechTerminal skills={skillCategories} />;
}
