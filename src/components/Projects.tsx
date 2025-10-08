import React from 'react';
import CyberpunkProjects from './CyberpunkProjects';

export default function Projects() {
  const projects = [
    {
      title: "CitizenVoice (HackRice)",
      tech: "TypeScript, React, TailwindCSS, PostgreSQL, Auth0",
      period: "Sept 2025",
      description: [
        "Built a civic-engagement app (proposals, voting, issue reports) backed by Auth0; organized a modular codebase with reusable UI primitives and hooks",
        "Modeled a PostgreSQL schema in Supabase and enforced Row Level Security policies; supplied SQL seed scripts and helper functions for demo bootstrap and local dev",
        "Added an interactive map using React-Leaflet and server-state management via TanStack Query using cache policies and invalidation"
      ],
      github: "jackcao",
      demoUrl: "https://citizenvoice.demo",
      metrics: [
        { label: "Users", value: "1.2K" },
        { label: "Votes Cast", value: "5.4K" },
        { label: "Proposals", value: "240" }
      ]
    },
    {
      title: "Smartnest (SaaS)",
      tech: "TypeScript, React, Next.js, TailwindCSS, Node.js",
      period: "Apr 2025 - Jun 2025",
      description: [
        "Developed a marketing site using Next.js and Tailwind; structured components for rapid iteration with TypeScript configs",
        "Implemented basic Node.js API routes and deployed to Vercel; maintained CI-ready tooling for stable previews",
        "Optimized for Core Web Vitals achieving 95+ Lighthouse scores across all categories"
      ],
      github: "jackcao",
      demoUrl: "https://smartnest.io",
      metrics: [
        { label: "Load Time", value: "0.8s" },
        { label: "Lighthouse", value: "95" },
        { label: "Users", value: "850" }
      ]
    },
    {
      title: "Stock Tracker",
      tech: "Bubble.io, REST APIs, QuiverQuant API",
      period: "Mar 2025 - May 2025",
      description: [
        "Delivered a portfolio tracker in Bubble using reusable elements, custom states, and workflow triggers to manage UI state and periodic data refreshes",
        "Integrated the QuiverQuant REST API via Bubble API Connector; normalized JSON responses into Bubble's database and built dynamic filtering and charting for analysis",
        "Implemented real-time market data updates with WebSocket connections for live price tracking"
      ],
      github: "jackcao",
      metrics: [
        { label: "Portfolios", value: "320" },
        { label: "API Calls/day", value: "15K" },
        { label: "Accuracy", value: "99.8%" }
      ]
    },
    {
      title: "Cryptocurrency Landing Page",
      tech: "TypeScript, React, TailwindCSS",
      period: "Dec 2024 - Jan 2025",
      description: [
        "Implemented a responsive, modular component system with utility-first styling and dark-mode; optimized build output via tree-shaking and asset minification for fast TTI",
        "Generated over $2,000,000 at peak volume and achieved a 20% daily holder growth rate",
        "Integrated Web3 wallet connections and smart contract interactions for seamless token transactions"
      ],
      github: "jackcao",
      demoUrl: "https://crypto-landing.com",
      metrics: [
        { label: "Peak Volume", value: "$2M" },
        { label: "Growth", value: "+20%" },
        { label: "Holders", value: "8.5K" }
      ]
    }
  ];

  return <CyberpunkProjects projects={projects} />;
}
