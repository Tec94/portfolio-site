import React from 'react';
import CyberpunkProjects from './CyberpunkProjects';

export default function Projects() {
  const projects = [
    {
      title: "Credify",
      tech: "TypeScript, React, Vite, TailwindCSS, Node.js, PostgreSQL, Auth0, Plaid API",
      period: "Oct 2024",
      description: [
        "Built an AI-powered credit card optimization platform using React + TypeScript + Vite; integrated Auth0 for secure authentication and Plaid API for bank account connections with proper error handling and retry logic",
        "Architected a PostgreSQL schema for user preferences and transaction data; deployed Google Gemini AI to analyze spending patterns and deliver personalized card recommendations based on merchant categories and reward structures",
        "Implemented location-based smart notifications using Mapbox GL JS for merchant mapping and Zustand for global state management; optimized API response caching to reduce latency by 40%"
      ],
      github: "Tec94/hack-uta",
      demoUrl: "https://hack-uta.vercel.app/",
      metrics: [
        { label: "Credit Cards", value: "15" },
        { label: "Categories", value: "30+" },
        { label: "APIs", value: "3" }
      ]
    },
    {
      title: "CitizenVoice",
      tech: "TypeScript, React, TailwindCSS, PostgreSQL, Auth0",
      period: "Sept 2025",
      description: [
        "Built a civic-engagement app (proposals, voting, issue reports) backed by Auth0; organized a modular codebase with reusable UI primitives and hooks",
        "Modeled a PostgreSQL schema in Supabase and enforced Row Level Security policies; supplied SQL seed scripts and helper functions for demo bootstrap and local dev",
        "Added an interactive map using React-Leaflet and server-state management via TanStack Query using cache policies and invalidation"
      ],
      github: "Tec94/Hack-Rice",
      demoUrl: "https://hack-rice-nine.vercel.app/",
      metrics: [
        { label: "Features", value: "3" },
        { label: "DB Tables", value: "8+" },
        { label: "Auth Policies", value: "12+" }
      ]
    },
    {
      title: "Smartnest",
      tech: "TypeScript, React, Next.js, TailwindCSS, Node.js",
      period: "Apr 2025 - Jun 2025",
      description: [
        "Developed a marketing site using Next.js and Tailwind; structured components for rapid iteration with TypeScript configs",
        "Implemented basic Node.js API routes and deployed to Vercel; maintained CI-ready tooling for stable previews",
        "Optimized for Core Web Vitals achieving 95+ Lighthouse scores across all categories"
      ],
      github: "Tec94/smartnest",
      demoUrl: "https://smartnest.health/",
      metrics: [
        { label: "Load Time", value: "0.8s" },
        { label: "Lighthouse", value: "95" },
        { label: "Components", value: "24" }
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
      github: "Tec94/stock-tracker",
      demoUrl: "https://stock-tracker-41285.bubbleapps.io/version-test",
      bubbleDesignUrl: "https://bubble.io/page?id=stock-tracker-41285&tab=Design&name=index",
      metrics: [
        { label: "Data Points", value: "50K+" },
        { label: "Update Rate", value: "<2s" },
        { label: "Workflows", value: "15+" }
      ]
    },
    {
      title: "$Munky",
      tech: "TypeScript, React, TailwindCSS",
      period: "Dec 2024 - Jan 2025",
      description: [
        "Implemented a responsive, modular component system with utility-first styling and dark-mode; optimized build output via tree-shaking and asset minification for fast TTI",
        "Generated over $2,000,000 at peak volume and achieved a 20% daily holder growth rate",
        "Integrated Web3 wallet connections and smart contract interactions for seamless token transactions"
      ],
      github: "Tec94/munky-sol",
      demoUrl: "https://munky-sol.vercel.app/",
      metrics: [
        { label: "Peak Volume", value: "$2M" },
        { label: "Growth", value: "+20%" },
        { label: "Holders", value: "8.5K" }
      ]
    }
  ];

  return <CyberpunkProjects projects={projects} />;
}
