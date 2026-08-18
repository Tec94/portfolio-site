export type ProjectCategory =
  | 'Web Apps'
  | 'Dashboards'
  | 'Marketing Sites'
  | 'Experiments'
  | 'Client Work';

export type ProjectGlyph = 'card' | 'voice' | 'nest' | 'chart' | 'coin';

export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  category: ProjectCategory;
  role: string;
  scope: string;
  timeline: string;
  stage: 'Launched' | 'In Progress' | 'Case Study';
  period: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  liveUrl: string;
  sourceUrl?: string;
  images: string[];
  accent: string;
  glyph: ProjectGlyph;
}

export const projects: Project[] = [
  {
    id: 'credify',
    index: '01',
    title: 'Credify',
    tagline: 'Credit card rewards optimizer',
    description:
      'A rewards optimizer that analyzes spending across 15+ cards and 30+ categories, then turns that data into useful, real-time recommendations.',
    tech: ['TypeScript', 'React', 'Vite', 'Node.js', 'PostgreSQL', 'Auth0', 'Plaid API'],
    category: 'Web Apps',
    role: 'Full-Stack Developer',
    scope: 'Product design, frontend and backend MVP',
    timeline: 'Oct 2024 · Hackathon',
    stage: 'Launched',
    period: 'October 2024',
    highlights: [
      'Reduced API latency by 40% through response caching',
      'Built contextual Gemini recommendations for card selection',
      'Integrated Plaid and Auth0 across 1,000+ test transactions',
    ],
    metrics: [
      { label: 'Cards', value: '15+' },
      { label: 'Categories', value: '30+' },
      { label: 'Latency', value: '−40%' },
    ],
    liveUrl: 'https://hack-uta.vercel.app/',
    sourceUrl: 'https://github.com/Tec94/hack-uta',
    images: ['/screenshots/credify.svg'],
    accent: '#a6ff4d',
    glyph: 'card',
  },
  {
    id: 'citizenvoice',
    index: '02',
    title: 'CitizenVoice',
    tagline: 'Civic participation made legible',
    description:
      'A civic platform where residents can propose, vote on, and map local issues, protected by Auth0 and granular Supabase row-level policies.',
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'PostgreSQL', 'Auth0', 'React Leaflet'],
    category: 'Web Apps',
    role: 'Full-Stack Developer',
    scope: 'Platform architecture and realtime map',
    timeline: 'Sep 2024 · Hackathon',
    stage: 'Launched',
    period: 'September 2024',
    highlights: [
      'Implemented 12+ policies for strict record isolation',
      'Reduced repeated server requests by 60% through caching',
      'Created a map-first issue reporting and voting workflow',
    ],
    metrics: [
      { label: 'Tables', value: '8+' },
      { label: 'RLS rules', value: '12+' },
      { label: 'Requests', value: '−60%' },
    ],
    liveUrl: 'https://hack-rice-nine.vercel.app/',
    sourceUrl: 'https://github.com/Tec94/Hack-Rice',
    images: ['/screenshots/citizen-voice.svg'],
    accent: '#4cc9ff',
    glyph: 'voice',
  },
  {
    id: 'smartnest',
    index: '03',
    title: 'Smartnest',
    tagline: 'A fast, credible health-tech front door',
    description:
      'A production marketing site shaped around clarity and speed, with strong Core Web Vitals and a measured, accessible content hierarchy.',
    tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    category: 'Marketing Sites',
    role: 'Frontend Developer',
    scope: 'Website design system and performance',
    timeline: 'Apr–Jun 2024',
    stage: 'Launched',
    period: 'April–June 2024',
    highlights: [
      'Reached 95+ Lighthouse scores across core categories',
      'Improved perceived speed through image and route loading strategy',
      'Built a repeatable component system for future pages',
    ],
    metrics: [
      { label: 'Load time', value: '0.8s' },
      { label: 'Lighthouse', value: '95+' },
      { label: 'Deploy', value: '<2m' },
    ],
    liveUrl: 'https://smartnest.health/',
    sourceUrl: 'https://github.com/Tec94/smartnest',
    images: ['/screenshots/smartnest.svg'],
    accent: '#8a82ff',
    glyph: 'nest',
  },
  {
    id: 'stock-tracker',
    index: '04',
    title: 'Stock Tracker',
    tagline: 'No-code portfolio analytics',
    description:
      'A market dashboard that processes 50K+ data points with sub-two-second update latency across multiple asset classes.',
    tech: ['Bubble', 'REST APIs', 'QuiverQuant', 'WebSockets'],
    category: 'Dashboards',
    role: 'Product Engineer',
    scope: 'Analytics dashboard and automation',
    timeline: 'Mar–May 2024',
    stage: 'Launched',
    period: 'March–May 2024',
    highlights: [
      'Sustained 99.9% uptime with retries and defensive states',
      'Automated 15+ portfolio workflows',
      'Reduced manual portfolio tracking by roughly 90%',
    ],
    metrics: [
      { label: 'Data points', value: '50K+' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Workflows', value: '15+' },
    ],
    liveUrl: 'https://stock-tracker-41285.bubbleapps.io/version-test',
    sourceUrl: 'https://github.com/Tec94/stock-tracker',
    images: ['/screenshots/stock-tracker.svg'],
    accent: '#4b88ff',
    glyph: 'chart',
  },
  {
    id: 'munky',
    index: '05',
    title: '$Munky',
    tagline: 'A Web3 launch with real traffic',
    description:
      'A playful token launch experience built to stay responsive under peak traffic and make wallet interactions understandable.',
    tech: ['TypeScript', 'React', 'Tailwind CSS', 'Web3', 'MetaMask'],
    category: 'Experiments',
    role: 'Frontend Developer',
    scope: 'Launch experience and wallet flows',
    timeline: 'Dec 2024–Jan 2025',
    stage: 'Launched',
    period: 'December 2024–January 2025',
    highlights: [
      'Cut time to interactive by 50%',
      'Handled 1,000+ concurrent users at peak',
      'Supported 10K+ on-chain interactions without a failed handoff',
    ],
    metrics: [
      { label: 'Peak volume', value: '$2M' },
      { label: 'Holders', value: '8.5K' },
      { label: 'Interactions', value: '10K+' },
    ],
    liveUrl: 'https://munky-sol.vercel.app/',
    sourceUrl: 'https://github.com/Tec94/munky-sol',
    images: ['/screenshots/munky.svg'],
    accent: '#ffd84b',
    glyph: 'coin',
  },
];

export interface TimelineChapter {
  year: string;
  title: string;
  badge: string;
  summary: string;
  notes: { title: string; date: string; tag: string }[];
}

export const timeline: TimelineChapter[] = [
  {
    year: '2022',
    title: 'Back-End Intern',
    badge: 'Started',
    summary:
      'At Hotel Link Solutions, I learned that performance is product work: responsive images, code splitting, and CDN tuning contributed to a 10% lift in checkout rate.',
    notes: [{ title: 'Learning performance the hard way', date: 'Nov 2022', tag: 'Engineering' }],
  },
  {
    year: '2023',
    title: 'Engineering Intern',
    badge: 'Growth',
    summary:
      'At Portlogics JSC, I rebuilt dashboard workflows in React and focused on reusable, accessible components that reduced user error and sped up review.',
    notes: [{ title: 'Lessons from my first real client', date: 'Aug 2023', tag: 'Process' }],
  },
  {
    year: '2024',
    title: 'Hackathon Season',
    badge: 'Turning point',
    summary:
      'I shipped Credify, CitizenVoice, Smartnest, and other full-stack MVPs under pressure—with real data, auth, caching, and users instead of presentation-only prototypes.',
    notes: [
      { title: 'Ship small, learn fast', date: 'Oct 2024', tag: 'Mindset' },
      { title: 'Caching is a feature', date: 'Oct 2024', tag: 'Engineering' },
    ],
  },
  {
    year: '2025',
    title: 'Data & Automation Intern',
    badge: 'Current focus',
    summary:
      'At QT-Data Group, I engineered Python automation and LLM-assisted production pipelines that cut end-to-end content production time by 70%.',
    notes: [{ title: 'The future is built with AI', date: 'Jul 2025', tag: 'AI' }],
  },
];

export interface Note {
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  status: 'draft';
}

export const notes: Note[] = [
  {
    title: 'Ship small, learn fast',
    date: 'Draft · May 25, 2026',
    tag: 'Mindset',
    excerpt: 'Speed comes from clarity, not shortcuts. Define the smallest valuable outcome.',
    status: 'draft',
  },
  {
    title: 'The future is built with AI',
    date: 'Draft · May 18, 2026',
    tag: 'AI',
    excerpt: 'AI is not merely another tool. The leverage comes from how a team frames the work.',
    status: 'draft',
  },
  {
    title: 'Writing maintainable CSS',
    date: 'Draft · May 09, 2026',
    tag: 'Engineering',
    excerpt: 'Good CSS is predictable, scalable, and kind to the next person who opens the file.',
    status: 'draft',
  },
  {
    title: 'On client communication',
    date: 'Draft · Apr 28, 2026',
    tag: 'Business',
    excerpt: 'Clear updates build trust. Early context prevents late surprises.',
    status: 'draft',
  },
];

export const experiences = [
  {
    company: 'Congero Technology Group',
    role: 'Software Engineering Intern',
    location: 'Remote',
    period: 'June–August 2026',
  },
  {
    company: 'QT-Data Group',
    role: 'Web Development Intern',
    location: 'Ho Chi Minh City, Vietnam',
    period: 'June–August 2025',
  },
  {
    company: 'Portlogics JSC',
    role: 'Intern',
    location: 'Ho Chi Minh City, Vietnam',
    period: 'June–August 2023',
  },
];

export const education = {
  school: 'University of Texas at Dallas',
  degree: 'B.S. in Computer Science',
  location: 'Dallas, Texas',
  period: 'August 2024–May 2028',
} as const;

export const toolbox = [
  'TypeScript',
  'React',
  'Python',
  'C',
  'SQL',
  'Node.js',
  'PostgreSQL',
  'Vite',
] as const;

export const profile = {
  name: 'Jack Cao',
  initials: 'JC',
  title: 'Web Developer & Product Freelancer',
  location: 'Texas, United States',
  timeZone: 'America/Chicago',
  email: 'hello@jackcao.dev',
  resumeUrl: 'https://assets.jackcao.dev/resume/jack-cao-resume.pdf',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/Tec94' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jackcao' },
    { label: 'Email', href: 'mailto:hello@jackcao.dev' },
  ],
} as const;
