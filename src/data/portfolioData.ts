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
    images: [
      'https://assets.jackcao.dev/projects/credify/credify_4.png',
      'https://assets.jackcao.dev/projects/credify/credify_1.png',
      'https://assets.jackcao.dev/projects/credify/credify_2.png',
      'https://assets.jackcao.dev/projects/credify/credify_3.png',
      'https://assets.jackcao.dev/projects/credify/credify_5.png',
      'https://assets.jackcao.dev/projects/credify/credify_6.png',
      'https://assets.jackcao.dev/projects/credify/credify_7.png',
      'https://assets.jackcao.dev/projects/credify/credify_8.png',
      'https://assets.jackcao.dev/projects/credify/credify_9.png',
      'https://assets.jackcao.dev/projects/credify/credify_10.png',
      'https://assets.jackcao.dev/projects/credify/credify_11.png',
      'https://assets.jackcao.dev/projects/credify/credify_12.png',
      'https://assets.jackcao.dev/projects/credify/credify_13.png',
      'https://assets.jackcao.dev/projects/credify/credify_14.png',
      'https://assets.jackcao.dev/projects/credify/credify_15.png',
      'https://assets.jackcao.dev/projects/credify/credify_16.png',
    ],
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
    images: [
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_1.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_2.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_3.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_4.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_5.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_6.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_7.png',
      'https://assets.jackcao.dev/projects/citizenvoice/citizenvoice_8.png',
    ],
    accent: '#4cc9ff',
    glyph: 'voice',
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
      'I shipped Credify, CitizenVoice, and other full-stack MVPs under pressure—with real data, auth, caching, and users instead of presentation-only prototypes.',
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
  calUrl: 'https://cal.com/jack-cao/15min',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/Tec94' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jackcao' },
    { label: 'Email', href: 'mailto:hello@jackcao.dev' },
  ],
} as const;
