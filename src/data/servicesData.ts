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
}

export const servicesData: ServiceData[] = [
  {
    id: 'full-stack-web-development',
    slug: 'full-stack-web-development',
    icon: Code,
    title: 'Full-Stack Web Development',
    shortDescription: 'Custom web applications built with React, TypeScript, and modern frameworks. Responsive, scalable, and optimized for performance.',
    fullDescription: 'Build powerful, scalable web applications from scratch or modernize your existing platform. I specialize in creating responsive, high-performance applications using industry-leading technologies and best practices. From database design to frontend interfaces, I handle every aspect of your web application.',
    features: ['React & TypeScript', 'RESTful APIs', 'Database Design', 'Cloud Deployment'],
    benefits: [
      'Clean, maintainable code architecture',
      'Responsive design for all devices',
      'SEO-optimized pages',
      'Performance monitoring & optimization',
      'Comprehensive documentation',
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
    startingPrice: '$1,250',
    pricingPlans: [
      {
        name: 'Starter',
        price: '$1,250 - $2,500',
        description: 'Perfect for landing pages and simple web applications',
        features: [
          'Up to 5 pages/routes',
          'Basic responsive design',
          'Contact form integration',
          'Basic SEO setup',
          'Cloud deployment'
        ],
        revisions: '2 rounds',
        meetings: '3 check-in meetings',
        timeline: '2-3 weeks',
        support: '14 days post-launch'
      },
      {
        name: 'Professional',
        price: '$2,500 - $7,500',
        description: 'Full-featured applications with custom functionality',
        features: [
          'Up to 15 pages/routes',
          'Custom UI components',
          'User authentication',
          'Database integration',
          'Admin dashboard',
          'API development',
          'Advanced SEO',
          'Performance optimization'
        ],
        revisions: '4 rounds',
        meetings: '6 check-in meetings + planning session',
        timeline: '4-8 weeks',
        support: '30 days post-launch',
        recommended: true
      },
      {
        name: 'Enterprise',
        price: '$7,500+',
        description: 'Complex applications with advanced features and integrations',
        features: [
          'Unlimited pages/routes',
          'Advanced custom features',
          'Multi-user roles & permissions',
          'Third-party integrations',
          'Real-time functionality',
          'Advanced analytics',
          'Custom API development',
          'Load testing & optimization',
          'CI/CD pipeline setup'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly meetings + dedicated support',
        timeline: '8-16 weeks',
        support: '60 days post-launch + priority support'
      }
    ]
  },
  {
    id: 'responsive-ui-ux-design',
    slug: 'responsive-ui-ux-design',
    icon: Smartphone,
    title: 'Responsive UI/UX Design',
    shortDescription: 'Mobile-first, accessible interfaces with smooth animations and intuitive user flows. Focus on Core Web Vitals and user experience.',
    fullDescription: 'Create stunning, user-friendly interfaces that work flawlessly across all devices. I focus on accessibility, performance, and modern design patterns to ensure your users have the best possible experience.',
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
    startingPrice: '$750',
    pricingPlans: [
      {
        name: 'Starter',
        price: '$750 - $1,500',
        description: 'UI refresh for existing sites',
        features: [
          'Mobile responsive design',
          'Basic accessibility fixes',
          'Modern UI components',
          'Basic animations',
          'Performance audit'
        ],
        revisions: '2 rounds',
        meetings: '2 design reviews',
        timeline: '1-2 weeks',
        support: '14 days post-launch'
      },
      {
        name: 'Professional',
        price: '$1,500 - $4,000',
        description: 'Complete UI/UX redesign',
        features: [
          'Full mobile-first redesign',
          'WCAG 2.1 AA compliance',
          'Custom component library',
          'Advanced animations',
          'Performance optimization',
          'User testing insights',
          'Design system documentation'
        ],
        revisions: '3 rounds',
        meetings: '4 design reviews + planning session',
        timeline: '3-5 weeks',
        support: '30 days post-launch',
        recommended: true
      },
      {
        name: 'Enterprise',
        price: '$4,000+',
        description: 'Complete UX overhaul with research',
        features: [
          'User research & personas',
          'Information architecture',
          'Interactive prototypes',
          'A/B testing setup',
          'Advanced accessibility features',
          'Micro-interactions & animations',
          'Design tokens & theming',
          'Multi-brand support'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly reviews + user testing sessions',
        timeline: '6-10 weeks',
        support: '60 days + ongoing consultation'
      }
    ]
  },
  {
    id: 'data-pipeline-development',
    slug: 'data-pipeline-development',
    icon: Database,
    title: 'Data Pipeline Development',
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
    pricingPlans: [
      {
        name: 'Starter',
        price: '$1,000 - $2,000',
        description: 'Simple web scraping & data collection',
        features: [
          'Single source scraping',
          'Basic data cleaning',
          'CSV/JSON export',
          'Simple scheduling',
          'Error notifications'
        ],
        revisions: '2 rounds',
        meetings: '2 technical meetings',
        timeline: '1-2 weeks',
        support: '14 days post-delivery'
      },
      {
        name: 'Professional',
        price: '$2,000 - $5,000',
        description: 'Multi-source ETL pipeline',
        features: [
          'Multiple data sources',
          'Advanced data transformation',
          'Database integration',
          'Automated scheduling',
          'Data validation & QA',
          'Rate limiting & pagination',
          'Monitoring dashboard',
          'Deduplication logic'
        ],
        revisions: '3 rounds',
        meetings: '4 technical meetings + planning',
        timeline: '3-6 weeks',
        support: '30 days post-delivery',
        recommended: true
      },
      {
        name: 'Enterprise',
        price: '$5,000+',
        description: 'Complex data ecosystem with ML',
        features: [
          'Unlimited data sources',
          'Real-time processing',
          'ML-powered data enrichment',
          'Advanced analytics',
          'Custom APIs',
          'Data warehouse integration',
          'Anomaly detection',
          'Scalable cloud infrastructure'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly technical reviews',
        timeline: '6-12 weeks',
        support: '60 days + priority maintenance'
      }
    ]
  },
  {
    id: 'ai-integration-automation',
    slug: 'ai-integration-automation',
    icon: Cpu,
    title: 'AI Integration & Automation',
    shortDescription: 'LLM-powered automation, chatbot development, and intelligent workflow optimization using modern AI APIs.',
    fullDescription: 'Leverage the power of AI to automate workflows, generate content, and enhance your applications. I specialize in integrating OpenAI, Anthropic, and other LLM APIs into your existing systems.',
    features: ['LLM Integration', 'Workflow Automation', 'API Orchestration', 'Content Generation'],
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
    startingPrice: '$1,250',
    pricingPlans: [
      {
        name: 'Starter',
        price: '$1,250 - $2,500',
        description: 'Basic AI integration',
        features: [
          'Single AI workflow',
          'Prompt engineering',
          'Basic error handling',
          'API integration',
          'Usage monitoring'
        ],
        revisions: '2 rounds',
        meetings: '3 implementation meetings',
        timeline: '2-3 weeks',
        support: '14 days post-launch'
      },
      {
        name: 'Professional',
        price: '$2,500 - $6,000',
        description: 'Multi-step AI automation',
        features: [
          'Complex workflow orchestration',
          'Multiple AI model integration',
          'Custom chatbot development',
          'Context management',
          'Rate limiting & retries',
          'Cost optimization',
          'Analytics dashboard',
          'A/B testing for prompts'
        ],
        revisions: '4 rounds',
        meetings: '6 meetings + strategy session',
        timeline: '4-8 weeks',
        support: '30 days post-launch',
        recommended: true
      },
      {
        name: 'Enterprise',
        price: '$6,000+',
        description: 'Advanced AI ecosystem',
        features: [
          'Multi-agent systems',
          'Fine-tuned models',
          'Vector database integration',
          'RAG implementation',
          'Real-time AI features',
          'Custom API development',
          'Advanced security measures',
          'Scalable infrastructure'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly strategy & review calls',
        timeline: '8-16 weeks',
        support: '60 days + priority support'
      }
    ]
  },
  {
    id: 'performance-optimization',
    slug: 'performance-optimization',
    icon: Zap,
    title: 'Performance Optimization',
    shortDescription: 'Speed up your existing applications with code-splitting, lazy loading, CDN optimization, and performance profiling.',
    fullDescription: 'Dramatically improve your application performance with proven optimization techniques. I analyze, identify bottlenecks, and implement solutions to achieve better Core Web Vitals scores and user experience.',
    features: ['Lighthouse Audits', 'Code Splitting', 'Image Optimization', 'Caching Strategies'],
    benefits: [
      'Faster page load times',
      'Better SEO rankings',
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
    startingPrice: '$750',
    pricingPlans: [
      {
        name: 'Starter',
        price: '$750 - $1,500',
        description: 'Basic performance audit & fixes',
        features: [
          'Lighthouse audit',
          'Image optimization',
          'Basic code splitting',
          'Minification setup',
          'Performance report'
        ],
        revisions: '1 round',
        meetings: '2 review meetings',
        timeline: '1-2 weeks',
        support: '14 days post-delivery'
      },
      {
        name: 'Professional',
        price: '$1,500 - $3,500',
        description: 'Comprehensive optimization',
        features: [
          'Deep performance analysis',
          'Advanced code splitting',
          'Lazy loading implementation',
          'CDN setup & optimization',
          'HTTP caching strategy',
          'Critical CSS extraction',
          'Bundle size reduction',
          'Core Web Vitals optimization'
        ],
        revisions: '2 rounds',
        meetings: '4 technical reviews',
        timeline: '2-4 weeks',
        support: '30 days monitoring',
        recommended: true
      },
      {
        name: 'Enterprise',
        price: '$3,500+',
        description: 'Full-stack performance overhaul',
        features: [
          'Backend optimization',
          'Database query optimization',
          'Infrastructure scaling',
          'Load testing & benchmarking',
          'Advanced monitoring setup',
          'Progressive Web App features',
          'Edge computing implementation',
          'Continuous performance tracking'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly performance reviews',
        timeline: '4-8 weeks',
        support: '60 days + ongoing monitoring'
      }
    ]
  },
  {
    id: 'api-development-integration',
    slug: 'api-development-integration',
    icon: Globe,
    title: 'API Development & Integration',
    shortDescription: 'Build robust REST APIs, integrate third-party services, and create seamless data flows between systems.',
    fullDescription: 'Design and build secure, scalable APIs or integrate your application with third-party services. From authentication to rate limiting, I handle all aspects of API development and integration.',
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
    pricingPlans: [
      {
        name: 'Starter',
        price: '$1,000 - $2,000',
        description: 'Basic API development',
        features: [
          'Up to 10 endpoints',
          'Basic authentication',
          'JSON response format',
          'Error handling',
          'Basic documentation'
        ],
        revisions: '2 rounds',
        meetings: '3 technical meetings',
        timeline: '2-3 weeks',
        support: '14 days post-launch'
      },
      {
        name: 'Professional',
        price: '$2,000 - $5,000',
        description: 'Full API ecosystem',
        features: [
          'Unlimited endpoints',
          'OAuth 2.0 authentication',
          'Rate limiting & throttling',
          'Webhook implementation',
          'API versioning',
          'Comprehensive testing',
          'Interactive documentation',
          'Third-party integrations'
        ],
        revisions: '3 rounds',
        meetings: '5 technical meetings + planning',
        timeline: '4-7 weeks',
        support: '30 days post-launch',
        recommended: true
      },
      {
        name: 'Enterprise',
        price: '$5,000+',
        description: 'Advanced API infrastructure',
        features: [
          'GraphQL API',
          'Microservices architecture',
          'Advanced security (OWASP)',
          'API gateway setup',
          'Real-time WebSocket support',
          'Analytics & monitoring',
          'Load balancing',
          'Multi-region deployment',
          'SLA guarantees'
        ],
        revisions: 'Unlimited',
        meetings: 'Weekly technical reviews',
        timeline: '6-12 weeks',
        support: '60 days + priority maintenance'
      }
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find(service => service.slug === slug);
}
