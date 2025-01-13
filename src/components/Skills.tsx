import React from 'react';

export default function Skills() {
  const skillCategories = [
    {
      title: "Front-end",
      skills: ["HTML", "CSS", "Javascript", "Typescript", "ReactJS", "TailwindCSS"]
    },
    {
      title: "Back-end",
      skills: ["Python", "SQL", "Django", "MongoDB", "Supabase"]
    },
    {
      title: "Production and Productivity",
      skills: ["Visual Studio Code", "Git", "Node.js", "NPM/NPX", "Vite"]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Skills</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-bold mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}