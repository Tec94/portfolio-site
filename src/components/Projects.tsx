import React from 'react';
import CyberpunkProjects from './CyberpunkProjects';

export default function Projects() {
  const projects = [
    {
      title: "Credify",
      tech: "TypeScript, React, Vite, TailwindCSS, Node.js, PostgreSQL, Auth0, Plaid API",
      period: "Oct 2024",
      description: [
        "Built credit card optimizer that helped users maximize rewards by analyzing spending patterns across 15+ cards and 30+ categories",
        "Reduced API latency by 40% through strategic response caching, enabling real-time recommendations powered by Google Gemini AI with 95% accuracy rate",
        "Integrated Plaid API for secure bank connections and Auth0 authentication, handling 1000+ test transactions with zero security incidents during demo"
      ],
      github: "Tec94/hack-uta",
      demoUrl: "https://hack-uta.vercel.app/",
      screenshots: [
        "https://assets.jackcao.dev/projects/credify/credify_4.png",
        "https://assets.jackcao.dev/projects/credify/credify_1.png",
        "https://assets.jackcao.dev/projects/credify/credify_2.png",
        "https://assets.jackcao.dev/projects/credify/credify_3.png",
        "https://assets.jackcao.dev/projects/credify/credify_5.png",
        "https://assets.jackcao.dev/projects/credify/credify_6.png",
        "https://assets.jackcao.dev/projects/credify/credify_7.png",
        "https://assets.jackcao.dev/projects/credify/credify_8.png",
        "https://assets.jackcao.dev/projects/credify/credify_9.png",
        "https://assets.jackcao.dev/projects/credify/credify_10.png",
        "https://assets.jackcao.dev/projects/credify/credify_11.png",
        "https://assets.jackcao.dev/projects/credify/credify_12.png",
        "https://assets.jackcao.dev/projects/credify/credify_13.png",
        "https://assets.jackcao.dev/projects/credify/credify_14.png",
        "https://assets.jackcao.dev/projects/credify/credify_15.png",
        "https://assets.jackcao.dev/projects/credify/credify_16.png"
      ],
      metrics: [
        { label: "Credit Cards", value: "15" },
        { label: "Categories", value: "30+" },
        { label: "APIs", value: "3" }
      ]
    },
    {
      title: "CitizenVoice",
      tech: "TypeScript, React, TailwindCSS, PostgreSQL, Auth0",
      period: "Sept 2024",
      description: [
        "Built civic engagement platform enabling citizens to propose, vote, and report issues - deployed with enterprise-grade security through Auth0 and Supabase RLS",
        "Achieved 100% data isolation between users through 12+ granular Row Level Security policies, protecting sensitive civic data across 8 database tables",
        "Implemented real-time interactive mapping with React-Leaflet and TanStack Query, reducing server requests by 60% through intelligent cache invalidation"
      ],
      github: "Tec94/Hack-Rice",
      demoUrl: "https://hack-rice-nine.vercel.app/",
      screenshots: [
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_1.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_2.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_3.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_4.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_5.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_6.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_7.png",
        "https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_8.png"
      ],
      metrics: [
        { label: "Features", value: "3" },
        { label: "DB Tables", value: "8+" },
        { label: "Auth Policies", value: "12+" }
      ]
    }
  ];

  return <CyberpunkProjects projects={projects} />;
}
