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
        "/screenshots/credify-landing-page.png",
        "/screenshots/credify-budget-manager.png",
        "/screenshots/credify-cards.png",
        "/screenshots/credify-transfer.png",
        "/screenshots/credify-settings.png",
        "/screenshots/credify-wallet.png"
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
      screenshot: "/screenshots/citizen-voice-gif.gif",
      metrics: [
        { label: "Features", value: "3" },
        { label: "DB Tables", value: "8+" },
        { label: "Auth Policies", value: "12+" }
      ]
    },
    {
      title: "Smartnest",
      tech: "TypeScript, React, Next.js, TailwindCSS, Node.js",
      period: "Apr 2024 - Jun 2024",
      description: [
        "Achieved 95+ Lighthouse scores across all categories (Performance, Accessibility, Best Practices, SEO) with 0.8s average load time",
        "Increased page speed by 65% through Next.js optimization techniques including image lazy-loading, route prefetching, and code splitting across 24 components",
        "Deployed production-ready CI/CD pipeline on Vercel with automated previews, reducing deployment time from 15 minutes to under 2 minutes"
      ],
      github: "Tec94/smartnest",
      demoUrl: "https://smartnest.health/",
      screenshot: "/screenshots/smartnest-gif.gif",
      metrics: [
        { label: "Load Time", value: "0.8s" },
        { label: "Lighthouse", value: "95" },
        { label: "Components", value: "24" }
      ]
    },
    {
      title: "Stock Tracker",
      tech: "Bubble.io, REST APIs, QuiverQuant API",
      period: "Mar 2024 - May 2024",
      description: [
        "Built no-code stock portfolio tracker processing 50K+ data points with <2s update latency, enabling real-time market analysis across multiple asset classes",
        "Achieved 99.9% uptime through robust error handling and API retry logic, successfully tracking $100K+ in portfolio value during testing phase",
        "Implemented WebSocket connections for live price updates with 15+ automated workflows, reducing manual tracking time by 90% for users"
      ],
      github: "Tec94/stock-tracker",
      demoUrl: "https://stock-tracker-41285.bubbleapps.io/version-test",
      bubbleDesignUrl: "https://bubble.io/page?id=stock-tracker-41285&tab=Design&name=index",
      screenshot: "/screenshots/stock-tracker.png",
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
        "Generated $2M+ in peak trading volume with 8,500 holders, achieving 20% daily growth rate in first week of launch",
        "Reduced time-to-interactive (TTI) by 50% through aggressive tree-shaking and asset optimization, handling 1000+ concurrent users during peak traffic",
        "Integrated Web3 wallet connections (MetaMask, WalletConnect) with zero failed transactions across 10,000+ on-chain interactions"
      ],
      github: "Tec94/munky-sol",
      demoUrl: "https://munky-sol.vercel.app/",
      screenshot: "/screenshots/munky.png",
      metrics: [
        { label: "Peak Volume", value: "$2M" },
        { label: "Growth", value: "+20%" },
        { label: "Holders", value: "8.5K" }
      ]
    }
  ];

  return <CyberpunkProjects projects={projects} />;
}
