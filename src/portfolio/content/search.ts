import { portfolioManifest, type ArticleRecord, type ProjectRecord } from './manifest';

export type SearchEntryKind = 'route' | 'project' | 'article' | 'action';
export type SearchAction = 'theme' | 'sound';

export interface SearchEntry {
  id: string;
  kind: SearchEntryKind;
  title: string;
  summary: string;
  href?: string;
  action?: SearchAction;
  tags: string[];
  headings: string[];
  body: string;
}

export interface RankedSearchResult extends SearchEntry {
  score: number;
}

const routeEntries: SearchEntry[] = [
  {
    id: 'route-work',
    kind: 'route',
    title: 'Work',
    summary: 'Selected work and project archive',
    href: '/#work',
    tags: ['projects', 'case studies', 'archive'],
    headings: [],
    body: '',
  },
  {
    id: 'route-services',
    kind: 'route',
    title: 'Services',
    summary: 'Product engineering and interface services',
    href: '/#services',
    tags: ['capabilities', 'process', 'inquiry'],
    headings: [],
    body: '',
  },
  {
    id: 'route-about',
    kind: 'route',
    title: 'About',
    summary: 'Biography, experience, and toolbox',
    href: '/#about',
    tags: ['experience', 'resume', 'toolbox'],
    headings: [],
    body: '',
  },
  {
    id: 'route-writing',
    kind: 'route',
    title: 'Writing',
    summary: 'Published articles',
    href: '/#writing',
    tags: ['articles', 'notes'],
    headings: [],
    body: '',
  },
  {
    id: 'route-contact',
    kind: 'route',
    title: 'Contact',
    summary: 'Email, calendar, and project inquiry',
    href: '/contact',
    tags: ['email', 'cal', 'inquiry'],
    headings: [],
    body: '',
  },
  {
    id: 'action-theme',
    kind: 'action',
    title: 'Change theme',
    summary: 'Cycle system, light, and dark appearance',
    action: 'theme',
    tags: ['appearance', 'system', 'light', 'dark'],
    headings: [],
    body: '',
  },
  {
    id: 'action-sound',
    kind: 'action',
    title: 'Toggle sound',
    summary: 'Enable or mute interface sound',
    action: 'sound',
    tags: ['audio', 'mute', 'cuelume'],
    headings: [],
    body: '',
  },
];

function projectEntry(project: ProjectRecord): SearchEntry {
  return {
    id: `project-${project.slug}`,
    kind: 'project',
    title: project.title,
    summary: project.summary,
    href: project.href,
    tags: [...project.categories, ...project.technologies, ...(project.role ? [project.role] : [])],
    headings: project.headings.map((heading) => heading.text),
    body: project.bodyText,
  };
}

function articleEntry(article: ArticleRecord): SearchEntry {
  return {
    id: `article-${article.slug}`,
    kind: 'article',
    title: article.title,
    summary: article.summary,
    href: article.href,
    tags: article.tags,
    headings: article.headings.map((heading) => heading.text),
    body: article.bodyText,
  };
}

export const portfolioSearchIndex: SearchEntry[] = [
  ...routeEntries,
  ...portfolioManifest.projects.map(projectEntry),
  ...portfolioManifest.articles.map(articleEntry),
];

function fieldScore(value: string, query: string, weight: number) {
  const normalized = value.toLocaleLowerCase();
  if (normalized === query) return weight * 2;
  if (normalized.startsWith(query)) return weight * 1.5;
  return normalized.includes(query) ? weight : 0;
}

export function searchPortfolio(query: string): RankedSearchResult[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return portfolioSearchIndex.map((entry) => ({ ...entry, score: 0 }));

  return portfolioSearchIndex
    .map((entry) => {
      const score =
        fieldScore(entry.title, normalizedQuery, 120) +
        fieldScore(entry.summary, normalizedQuery, 40) +
        fieldScore(entry.tags.join(' '), normalizedQuery, 25) +
        fieldScore(entry.headings.join(' '), normalizedQuery, 18) +
        fieldScore(entry.body, normalizedQuery, 4);
      return { ...entry, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
