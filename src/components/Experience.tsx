import React from 'react';

export default function Experience() {
  const experiences = [
    {
      company: "Portlogics JSC",
      role: "Intern",
      location: "Ho Chi Minh, Vietnam",
      period: "June 2023 - August 2023",
      description: [
        "Employed PDDL to analyze and solve complex problem scenarios, optimizing logical planning models by 20%",
        "Developed Python-based computer vision techniques, improving object and people detection accuracy by 35%"
      ]
    },
    {
      company: "Hotel Link Solutions",
      role: "Back-end Engineering Intern",
      location: "Remote",
      period: "September 2022 - December 2022",
      description: [
        "Designed and optimized web development tools using XAMPP, MySQL servers, and SQL",
        "Created scalable SQL database schemas for improved web application performance"
      ]
    },
    {
      company: "Vinacapital Foundation",
      role: "Data and Research Analyst Intern",
      location: "Ho Chi Minh, Vietnam",
      period: "June 2022 - August 2022",
      description: [
        "Managed data collection for 500+ families receiving financial assistance",
        "Led analysis team quantifying post-surgery improvements in health metrics"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Experience</h2>
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{exp.company}</h3>
                  <p className="text-gray-600">{exp.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">{exp.location}</p>
                  <p className="text-sm text-gray-500">{exp.period}</p>
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {exp.description.map((desc, i) => (
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