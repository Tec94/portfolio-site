import Code from 'lucide-react/dist/esm/icons/code';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Database from 'lucide-react/dist/esm/icons/database';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Globe from 'lucide-react/dist/esm/icons/globe';

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  revisions: string;
  meetings: string;
  timeline: string;
  support: string;
  recommended?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'timeline' | 'support' | 'features' | 'content' | 'training';
  icon?: string;
}

export interface ServiceData {
  id: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  benefits: string[];
  deliverables: string[];
  technologies: string[];
  pricingPlans: PricingPlan[];
  startingPrice: string;
  typicalRange?: string;
}

export const servicesData: ServiceData[] = [
  {
    id: 'full-stack-web-development',
    slug: 'full-stack-web-development',
    icon: Code,
    title: 'Website & Application Development',
    shortDescription: 'Custom web applications built with React, TypeScript, and modern frameworks. Includes basic design, APIs, and performance optimization.',
    fullDescription: 'Build powerful, scalable web applications from scratch or modernize your existing platform. Includes basic UI/UX design, API integration, and performance optimization as part of the package. For advanced design systems, comprehensive API architecture, or deep performance optimization, those services are available separately for more specialized needs.',
    features: ['React & TypeScript', 'Basic API Integration', 'Database Design', 'Cloud Deployment'],
    benefits: [
      'Clean, maintainable code architecture',
      'Basic responsive design (for full design service, see Modern Website Design)',
      'Basic SEO optimization',
      'Basic performance optimization (for comprehensive optimization, see Website Optimization)',
      'Comprehensive technical documentation',
      'Testing & QA included'
    ],
    deliverables: [
      'Fully functional web application',
      'Source code repository',
      'Deployment on your preferred platform',
      'Technical documentation',
      'Admin dashboard (if applicable)',
      'Post-launch support period'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Vercel'],
    startingPrice: '$1,200',
    typicalRange: '$5,000-$6,000',
    pricingPlans: [
      {
        name: 'Basic',
        price: 'Starting at $600',
        description: 'Perfect for landing pages and simple web applications',
        features: [
          'Up to 5 pages/routes (e.g., Home, About, Services, Contact, Blog)',
          'Basic responsive design & deployment',
          'Contact form & basic SEO',
          'SSL certificate & analytics setup',
          'Domain connection assistance',
          'Project kickoff & weekly updates',
          'Source code ownership & training'
        ],
        revisions: '2 rounds',
        meetings: '3 check-in meetings',
        timeline: '2-3 weeks',
        support: '30 days post-launch'
      },
      {
        name: 'Business',
        price: 'Starting at $1,150',
        description: 'Full-featured applications with custom functionality',
        features: [
          'Up to 15 pages/routes',
          'Custom UI components & basic design (for advanced design, combine with Design service)',
          'User authentication & role management',
          'Database integration & admin dashboard',
          'Basic API development (for comprehensive APIs, combine with API service)',
          'Basic SEO & performance optimization',
          'Email notifications & automated backups',
          'Security audit & testing reports',
          'Dedicated Slack/Discord support',
          'Bi-weekly status reports & planning',
          'Training session (1-2 hours)',
          'Source code ownership & IP transfer',
          'One free update within 90 days'
        ],
        revisions: '4 rounds',
        meetings: '6 check-in meetings + planning session',
        timeline: '4-8 weeks',
        support: '60 days post-launch + priority email support',
        recommended: true
      },
      {
        name: 'Premium',
        price: 'Starting at $3,200',
        description: 'Complex applications with advanced features and integrations',
        features: [
          'Unlimited pages/routes & custom features',
          'Multi-user roles & advanced permissions',
          'Real-time functionality & WebSockets',
          'Custom API integration (for dedicated API platform, combine with API service)',
          'Advanced analytics & monitoring',
          'Basic performance optimization (for deep optimization, combine with Optimization service)',
          'CI/CD pipeline & deployment automation',
          'Load balancing & scaling infrastructure',
          'Disaster recovery & backup systems',
          'Dedicated project manager',
          'Weekly progress reports & strategy calls',
          'Comprehensive security audit',
          'Team training (2-4 hours) & documentation',
          'NDA & IP transfer agreement',
          '24-hour emergency support',
          'Quarterly strategy calls (Year 1)'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly meetings + dedicated support',
        timeline: '8-16 weeks',
        support: '90 days post-launch + 24/7 priority support'
      }
    ]
  },
  {
    id: 'responsive-ui-ux-design',
    slug: 'responsive-ui-ux-design',
    icon: Smartphone,
    title: 'Modern Website Design',
    shortDescription: 'Mobile-first, accessible interfaces with smooth animations and intuitive user flows. Focus on Core Web Vitals and user experience.',
    fullDescription: 'Create stunning, user-friendly interfaces that work flawlessly across all devices. This is the comprehensive design service - web development projects include basic responsive design. Choose this service when you need advanced design systems, user research, accessibility compliance, or complete UI/UX overhauls.',
    features: ['Mobile-First Design', 'Accessibility (WCAG)', 'Performance Optimization', 'Modern UI Libraries'],
    benefits: [
      'Improved user engagement',
      'Reduced bounce rates',
      'Better accessibility compliance',
      'Faster page load times',
      'Modern, professional appearance',
      'Cross-browser compatibility'
    ],
    deliverables: [
      'Responsive UI implementation',
      'Design system/component library',
      'Accessibility audit report',
      'Performance optimization report',
      'Browser compatibility testing',
      'User flow documentation'
    ],
    technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Figma', 'Lighthouse', 'WCAG 2.1'],
    startingPrice: '$800',
    typicalRange: '$3,000-$4,000',
    pricingPlans: [
      {
        name: 'Basic',
        price: 'Starting at $400',
        description: 'UI refresh for existing sites',
        features: [
          'Mobile responsive design',
          'Modern UI components & animations',
          'Basic accessibility fixes',
          '2-3 initial design concepts',
          'Color palette & typography guide',
          'Stock image sourcing & mobile mockups',
          'Design files handoff & training'
        ],
        revisions: '2 rounds',
        meetings: '2 design reviews',
        timeline: '1-2 weeks',
        support: '30 days post-launch'
      },
      {
        name: 'Business',
        price: 'Starting at $750',
        description: 'Complete UI/UX redesign',
        features: [
          'Full mobile-first redesign',
          'WCAG 2.1 AA compliance',
          'Custom component library & design system',
          'Advanced animations & micro-interactions',
          'Performance optimization & testing',
          'User journey mapping & wireframes',
          'Interactive prototype & user testing',
          'Complete design handoff (Figma source)',
          'Icon set & brand guidelines',
          'Dedicated Slack/Discord support',
          'Bi-weekly status reports',
          'Training session (1 hour)',
          'One free design update within 90 days'
        ],
        revisions: '3 rounds',
        meetings: '4 design reviews + planning session',
        timeline: '3-5 weeks',
        support: '60 days post-launch + priority email support',
        recommended: true
      },
      {
        name: 'Premium',
        price: 'Starting at $1,800',
        description: 'Complete UX overhaul with research',
        features: [
          'User research & persona development',
          'Competitor analysis & market research',
          'Information architecture & site mapping',
          'Interactive prototypes & design sprints',
          'Usability testing (5-10 users) & A/B testing',
          'Advanced accessibility (WCAG AAA)',
          'Complete design system & design tokens',
          'Multi-brand support & theming',
          'Micro-interactions & advanced animations',
          'Design workshop & training (2-3 hours)',
          'Weekly progress reports',
          'NDA & IP transfer agreement',
          'Quarterly design refresh option',
          '24-hour priority support'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly reviews + user testing sessions',
        timeline: '6-10 weeks',
        support: '90 days + ongoing consultation'
      }
    ]
  },
  {
    id: 'data-pipeline-development',
    slug: 'data-pipeline-development',
    icon: Database,
    title: 'Business Data Automation',
    shortDescription: 'Automated data collection, processing, and analysis pipelines. Web scraping, API integration, and data validation workflows.',
    fullDescription: 'Build robust, automated data pipelines that collect, process, and analyze data from multiple sources. Perfect for market research, competitive analysis, and data-driven decision making.',
    features: ['Python Automation', 'Web Scraping', 'Data Validation', 'ETL Pipelines'],
    benefits: [
      'Automated data collection',
      'Reduced manual work',
      'Clean, structured data',
      'Scheduled data updates',
      'Error handling & monitoring',
      'Scalable architecture'
    ],
    deliverables: [
      'Automated data pipeline',
      'Data validation scripts',
      'Scheduling & monitoring setup',
      'Clean, structured datasets',
      'Pipeline documentation',
      'Maintenance guide'
    ],
    technologies: ['Python', 'BeautifulSoup', 'Selenium', 'Pandas', 'PostgreSQL', 'AWS Lambda', 'Airflow'],
    startingPrice: '$1,000',
    typicalRange: '$4,000-$5,000',
    pricingPlans: [
      {
        name: 'Basic',
        price: 'Starting at $500',
        description: 'Simple web scraping & data collection',
        features: [
          'Single source data scraping',
          'Basic data cleaning & validation',
          'CSV/JSON export formats',
          'Simple scheduling & automation',
          'Error notifications & logging',
          'Data dictionary & sample preview',
          'Training & source code ownership'
        ],
        revisions: '2 rounds',
        meetings: '2 technical meetings',
        timeline: '1-2 weeks',
        support: '30 days post-delivery'
      },
      {
        name: 'Business',
        price: 'Starting at $950',
        description: 'Multi-source ETL pipeline',
        features: [
          'Multiple data sources integration',
          'Advanced data transformation & cleaning',
          'Database integration & storage',
          'Automated scheduling & incremental updates',
          'Data validation, QA & deduplication',
          'Rate limiting & pagination handling',
          'Monitoring dashboard & quality metrics',
          'Data lineage documentation',
          'Alerting setup (Slack/email)',
          'Dedicated Slack/Discord support',
          'Monthly data health reports',
          'Training session (1-2 hours)',
          'One free update within 90 days'
        ],
        revisions: '3 rounds',
        meetings: '4 technical meetings + planning',
        timeline: '3-6 weeks',
        support: '60 days post-delivery + priority email support',
        recommended: true
      },
      {
        name: 'Premium',
        price: 'Starting at $2,200',
        description: 'Complex data ecosystem with ML',
        features: [
          'Unlimited data sources integration',
          'Real-time processing & streaming',
          'ML-powered data enrichment & analytics',
          'Custom APIs & data warehouse integration',
          'Anomaly detection & alerting',
          'Scalable cloud infrastructure',
          'Custom ML model training',
          'Data governance & compliance (GDPR/CCPA)',
          'Scalability testing & optimization',
          'Knowledge transfer & team training (2-4 hours)',
          'Weekly progress reports',
          'Quarterly optimization reviews',
          'NDA & IP transfer agreement',
          '24-hour emergency support'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly technical reviews',
        timeline: '6-12 weeks',
        support: '90 days + 24/7 priority maintenance'
      }
    ]
  },
  {
    id: 'ai-integration-automation',
    slug: 'ai-integration-automation',
    icon: Cpu,
    title: 'AI-Powered Automation',
    shortDescription: 'LLM-powered automation, chatbot development, and intelligent workflow optimization using modern AI APIs.',
    fullDescription: 'Leverage the power of AI to automate workflows, generate content, and enhance your applications. Includes basic API integration for AI services. For building comprehensive custom API platforms with AI capabilities, combine this with the App Integrations & Connections service.',
    features: ['LLM Integration', 'Workflow Automation', 'Basic API Integration', 'Content Generation'],
    benefits: [
      'Reduced manual workload',
      'Intelligent automation',
      'Improved content quality',
      'Faster turnaround times',
      'Cost savings on repetitive tasks',
      'Scalable AI workflows'
    ],
    deliverables: [
      'AI-powered automation system',
      'Custom prompts & workflows',
      'API integration',
      'Usage monitoring dashboard',
      'Cost optimization report',
      'Maintenance documentation'
    ],
    technologies: ['Python', 'OpenAI API', 'Anthropic Claude', 'LangChain', 'Node.js', 'REST APIs'],
    startingPrice: '$1,200',
    typicalRange: '$5,000-$6,000',
    pricingPlans: [
      {
        name: 'Basic',
        price: 'Starting at $600',
        description: 'Basic AI integration',
        features: [
          'Single AI workflow integration',
          'Custom prompt engineering & optimization',
          'API integration & error handling',
          'Usage monitoring & cost tracking',
          'Prompt library & documentation',
          'Fallback strategies & testing results',
          'Training & source code ownership'
        ],
        revisions: '2 rounds',
        meetings: '3 implementation meetings',
        timeline: '2-3 weeks',
        support: '30 days post-launch'
      },
      {
        name: 'Business',
        price: 'Starting at $1,150',
        description: 'Multi-step AI automation',
        features: [
          'Complex workflow orchestration',
          'Multiple AI model integration',
          'Custom chatbot development',
          'Context management & conversation flows',
          'Rate limiting, retries & cost optimization',
          'Analytics dashboard & quality metrics',
          'A/B testing & prompt versioning',
          'Training data preparation',
          'User feedback collection system',
          'Monthly performance reports',
          'Dedicated Slack/Discord support',
          'Training session (1-2 hours)',
          'One free update within 90 days'
        ],
        revisions: '4 rounds',
        meetings: '6 meetings + strategy session',
        timeline: '4-8 weeks',
        support: '60 days post-launch + priority email support',
        recommended: true
      },
      {
        name: 'Premium',
        price: 'Starting at $2,600',
        description: 'Advanced AI ecosystem',
        features: [
          'Multi-agent systems & orchestration',
          'Fine-tuned models & cost analysis',
          'Vector database integration & optimization',
          'RAG implementation & pipeline documentation',
          'Real-time AI features & custom APIs',
          'Advanced security & content moderation',
          'Scalable infrastructure & embedding strategy',
          'Dedicated AI strategy consultation',
          'Quarterly model performance reviews',
          'Weekly progress reports',
          'Team training (2-4 hours)',
          'NDA & IP transfer agreement',
          '24-hour priority support'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly strategy & review calls',
        timeline: '8-16 weeks',
        support: '90 days + 24/7 priority support'
      }
    ]
  },
  {
    id: 'performance-optimization',
    slug: 'performance-optimization',
    icon: Zap,
    title: 'Website Optimization',
    shortDescription: 'Speed up your existing applications with code-splitting, lazy loading, CDN optimization, and performance profiling.',
    fullDescription: 'Dramatically improve your application performance with proven optimization techniques. This is the comprehensive performance service - web development includes basic optimization. Choose this service when you need deep performance audits, Core Web Vitals improvements, backend optimization, or to fix existing slow applications.',
    features: ['Lighthouse Audits', 'Code Splitting', 'Image Optimization', 'Caching Strategies'],
    benefits: [
      'Faster page load times (focus on performance, not redesign)',
      'Better SEO rankings through speed improvements',
      'Improved user retention',
      'Reduced bounce rates',
      'Lower infrastructure costs',
      'Better Core Web Vitals scores'
    ],
    deliverables: [
      'Performance audit report',
      'Optimized codebase',
      'CDN configuration',
      'Caching implementation',
      'Image optimization',
      'Performance monitoring setup'
    ],
    technologies: ['Lighthouse', 'WebPageTest', 'Chrome DevTools', 'Cloudflare', 'Vercel', 'Webpack'],
    startingPrice: '$800',
    typicalRange: '$2,500-$3,500',
    pricingPlans: [
      {
        name: 'Basic',
        price: 'Starting at $400',
        description: 'Basic performance audit & fixes',
        features: [
          'Lighthouse audit & performance report',
          'Image optimization & compression tools',
          'Basic code splitting & minification',
          'Core Web Vitals tracking setup',
          'Before/after metrics report',
          'Specific recommendations list',
          'Training & source code ownership'
        ],
        revisions: '2 rounds',
        meetings: '2 review meetings',
        timeline: '1-2 weeks',
        support: '30 days post-delivery'
      },
      {
        name: 'Business',
        price: 'Starting at $750',
        description: 'Comprehensive optimization',
        features: [
          'Deep performance analysis',
          'Advanced code splitting & lazy loading',
          'CDN setup, optimization & cost analysis',
          'HTTP caching & critical CSS extraction',
          'Bundle size reduction & optimization',
          'Core Web Vitals optimization (90+ score)',
          'Server response & font loading optimization',
          'Third-party script audit',
          'Monthly performance reports',
          'Dedicated Slack/Discord support',
          'Training session (1 hour)',
          'One free optimization update within 90 days'
        ],
        revisions: '2 rounds',
        meetings: '4 technical reviews',
        timeline: '2-4 weeks',
        support: '60 days monitoring + priority email support',
        recommended: true
      },
      {
        name: 'Premium',
        price: 'Starting at $1,600',
        description: 'Full-stack performance overhaul',
        features: [
          'Backend & database optimization',
          'Database index & query optimization',
          'Infrastructure scaling & configuration audit',
          'Load testing, benchmarking & SLA agreement',
          'Advanced monitoring & uptime tracking',
          'Progressive Web App features',
          'Edge computing implementation',
          'Continuous performance tracking',
          'Quarterly performance reviews',
          'Weekly progress reports',
          'Team training (2-3 hours)',
          'NDA & IP transfer agreement',
          '24-hour priority support'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly performance reviews',
        timeline: '4-8 weeks',
        support: '90 days + 24/7 ongoing monitoring'
      }
    ]
  },
  {
    id: 'api-development-integration',
    slug: 'api-development-integration',
    icon: Globe,
    title: 'App Integrations & Connections',
    shortDescription: 'Build robust REST APIs, integrate third-party services, and create seamless data flows between systems.',
    fullDescription: 'Design and build secure, scalable APIs or integrate your application with third-party services. This is the comprehensive API development service - for basic API needs as part of web or AI applications, those services include basic integration. Choose this service when you need a dedicated API platform, complex integrations, or microservices architecture.',
    features: ['REST API Design', 'Third-party Integration', 'Authentication', 'Rate Limiting'],
    benefits: [
      'Secure data exchange',
      'Scalable architecture',
      'Standardized endpoints',
      'Comprehensive documentation',
      'Error handling & monitoring',
      'Version control'
    ],
    deliverables: [
      'Functional API endpoints',
      'Authentication system',
      'API documentation',
      'Integration testing',
      'Rate limiting setup',
      'Monitoring dashboard'
    ],
    technologies: ['Node.js', 'Express', 'REST', 'GraphQL', 'JWT', 'OAuth', 'Postman', 'Swagger'],
    startingPrice: '$1,000',
    typicalRange: '$4,000-$5,000',
    pricingPlans: [
      {
        name: 'Basic',
        price: 'Starting at $500',
        description: 'Basic API development',
        features: [
          'Up to 10 API endpoints',
          'Basic authentication & error handling',
          'JSON response format',
          'Interactive API documentation',
          'Postman collection & example payloads',
          'Error code reference guide',
          'Training & source code ownership'
        ],
        revisions: '2 rounds',
        meetings: '3 technical meetings',
        timeline: '2-3 weeks',
        support: '30 days post-launch'
      },
      {
        name: 'Business',
        price: 'Starting at $950',
        description: 'Full API ecosystem',
        features: [
          'Unlimited API endpoints',
          'OAuth 2.0 authentication',
          'Rate limiting, throttling & retry logic',
          'Webhook implementation & versioning',
          'Third-party integrations & testing',
          'Interactive documentation & analytics',
          'SDK/client library (optional)',
          'Developer onboarding guide',
          'API usage analytics dashboard',
          'Dedicated Slack/Discord support',
          'Bi-weekly status reports',
          'Training session (1-2 hours)',
          'One free update within 90 days'
        ],
        revisions: '3 rounds',
        meetings: '5 technical meetings + planning',
        timeline: '4-7 weeks',
        support: '60 days post-launch + priority email support',
        recommended: true
      },
      {
        name: 'Premium',
        price: 'Starting at $2,200',
        description: 'Advanced API infrastructure',
        features: [
          'GraphQL API & microservices architecture',
          'Advanced security (OWASP) & API gateway',
          'Real-time WebSocket support',
          'Load balancing & multi-region deployment',
          'Service mesh & gateway configuration',
          'Analytics, monitoring & observability',
          'Architecture documentation & diagrams',
          'GraphQL schema documentation',
          'Uptime SLA & guarantees',
          'Quarterly architecture reviews',
          'Weekly progress reports',
          'Team training (2-4 hours)',
          'NDA & IP transfer agreement',
          '24/7 priority support'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly technical reviews',
        timeline: '6-12 weeks',
        support: '90 days + 24/7 priority maintenance'
      }
    ]
  }
];

// Add-ons available for all services
export const serviceAddOns: AddOn[] = [
  // Timeline Add-ons
  {
    id: 'rush-delivery-50',
    name: 'Rush Delivery (+50%)',
    description: 'Expedited timeline - reduce project duration by 30-40%',
    price: '+50% of project cost',
    category: 'timeline'
  },
  {
    id: 'rush-delivery-100',
    name: 'Rush Delivery (+100%)',
    description: 'Priority rush - reduce project duration by 50%+',
    price: '+100% of project cost',
    category: 'timeline'
  },

  // Support Add-ons
  {
    id: 'extended-support-3mo',
    name: 'Extended Support (3 Months)',
    description: 'Priority email support for 3 additional months after launch',
    price: '$300/month',
    category: 'support'
  },
  {
    id: 'extended-support-6mo',
    name: 'Extended Support (6 Months)',
    description: 'Priority email support for 6 additional months after launch',
    price: '$250/month',
    category: 'support'
  },
  {
    id: 'maintenance-package-basic',
    name: 'Monthly Maintenance Package (Basic)',
    description: 'Up to 5 hours of updates, bug fixes, and minor changes per month',
    price: '$400/month',
    category: 'support'
  },
  {
    id: 'maintenance-package-standard',
    name: 'Monthly Maintenance Package (Standard)',
    description: 'Up to 10 hours of updates, bug fixes, and feature enhancements per month',
    price: '$700/month',
    category: 'support'
  },
  {
    id: 'maintenance-package-premium',
    name: 'Monthly Maintenance Package (Premium)',
    description: 'Up to 20 hours of updates, priority support, and ongoing improvements',
    price: '$1,200/month',
    category: 'support'
  },
  {
    id: '24-7-support',
    name: '24/7 Emergency Support',
    description: 'Round-the-clock emergency support with 2-hour response time',
    price: '$500/month',
    category: 'support'
  },

  // Features Add-ons
  {
    id: 'additional-revisions',
    name: 'Additional Revision Round',
    description: 'One extra round of revisions beyond your plan limit',
    price: '$200 per round',
    category: 'features'
  },
  {
    id: 'extra-meetings',
    name: 'Additional Meetings',
    description: 'Extra check-in or review meetings beyond your plan',
    price: '$150 per meeting',
    category: 'features'
  },
  {
    id: 'dedicated-pm',
    name: 'Dedicated Project Manager',
    description: 'Assigned PM for daily updates and coordinated communication',
    price: '+$800 one-time',
    category: 'features'
  },
  {
    id: 'migration-service',
    name: 'Data Migration Service',
    description: 'Professional migration of existing data to new system',
    price: 'Starting at $500',
    category: 'features'
  },
  {
    id: 'seo-package',
    name: 'Advanced SEO Package',
    description: 'Comprehensive SEO optimization with keyword research and schema markup',
    price: '$600',
    category: 'features'
  },
  {
    id: 'accessibility-audit',
    name: 'WCAG AAA Accessibility Audit',
    description: 'Enhanced accessibility compliance audit and implementation',
    price: '$400',
    category: 'features'
  },

  // Content Add-ons
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Professional copywriting for up to 5 pages',
    price: '$350',
    category: 'content'
  },
  {
    id: 'content-upload',
    name: 'Content Upload & Organization',
    description: 'Upload and organize your existing content into the new system',
    price: '$250',
    category: 'content'
  },
  {
    id: 'stock-assets',
    name: 'Premium Stock Assets Bundle',
    description: '10 premium stock photos and custom icon set',
    price: '$200',
    category: 'content'
  },

  // Training Add-ons
  {
    id: 'training-basic',
    name: 'Team Training Session (2 hours)',
    description: 'Comprehensive training for your team on using the new system',
    price: '$300',
    category: 'training'
  },
  {
    id: 'training-advanced',
    name: 'Advanced Team Training (4 hours)',
    description: 'In-depth training with Q&A and best practices for your team',
    price: '$500',
    category: 'training'
  },
  {
    id: 'training-video',
    name: 'Custom Video Tutorials',
    description: 'Recorded screen-capture tutorials customized for your system',
    price: '$400',
    category: 'training'
  },
  {
    id: 'documentation-package',
    name: 'Enhanced Documentation Package',
    description: 'Detailed user manual, admin guide, and troubleshooting documentation',
    price: '$350',
    category: 'training'
  }
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find(service => service.slug === slug);
}

export function getAddOnsByCategory(category: AddOn['category']): AddOn[] {
  return serviceAddOns.filter(addon => addon.category === category);
}
