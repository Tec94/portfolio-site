import siteProfile from '../content/site/profile.json';

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

export const timeline: TimelineChapter[] = siteProfile.timeline;

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

export const experiences = siteProfile.experiences;

export const education = siteProfile.education;

export const toolbox = siteProfile.toolbox;

export const profile = siteProfile.profile;
