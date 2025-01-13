import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: "Cryptocurrency Landing Page",
      tech: "TypeScript, ReactJS, TailwindCSS",
      description: [
        "Designed and developed a cryptocurrency landing page with live market cap display",
        "Attracted over 2,000 unique buyers within three months",
        "Generated over $180,000 in volume with 20% daily growth rate"
      ],
      github: "Github"
    },
    {
      title: "EMR Landing Page",
      tech: "TypeScript, ReactJS, MongoDB",
      description: [
        "Developed an intuitive landing page for MedCareEMR",
        "Drove 25% increase in user inquiries through professional design"
      ],
      github: "Github"
    },
    {
      title: "Support Ticket System",
      tech: "TypeScript, ReactJS, Supabase",
      description: [
        "Engineered a robust bug tracking and ticketing system",
        "Reduced issue resolution times by 40%"
      ],
      github: "Github"
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Projects</h2>
        <div className="grid gap-8">
          {projects.map((project, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Github className="h-5 w-5" />
                </a>
              </div>
              <p className="text-sm text-gray-500 mb-4">{project.tech}</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {project.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}