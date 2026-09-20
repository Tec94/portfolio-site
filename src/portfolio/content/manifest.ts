import type { ComponentType } from 'react';
import {
  articleFrontmatterSchema,
  projectFrontmatterSchema,
  type ArticleFrontmatter,
  type ProjectFrontmatter,
} from './contracts';

interface MdxModule {
  default: ComponentType<Record<string, unknown>>;
  frontmatter: unknown;
  portfolioSource: string;
}

export interface ContentHeading {
  id: string;
  level: number;
  text: string;
}

export interface ProjectRecord extends ProjectFrontmatter {
  kind: 'project';
  href: string;
  headings: ContentHeading[];
  bodyText: string;
  Content: ComponentType<Record<string, unknown>>;
}

export interface ArticleRecord extends ArticleFrontmatter {
  kind: 'article';
  href: string;
  headings: ContentHeading[];
  bodyText: string;
  Content: ComponentType<Record<string, unknown>>;
}

export type PreviewProjectRecord = Pick<
  ProjectRecord,
  | 'slug'
  | 'summary'
  | 'title'
  | 'year'
  | 'completedAt'
  | 'role'
  | 'duration'
  | 'categories'
  | 'technologies'
  | 'selectedWorkOrder'
  | 'links'
  | 'media'
  | 'href'
>;

const projectModules = import.meta.glob('/src/content/projects/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;
const articleModules = import.meta.glob('/src/content/writing/*.mdx', {
  eager: true,
}) as Record<string, MdxModule>;

function withoutFrontmatter(source: string) {
  return source.replace(/^---\s*[\s\S]*?\s---\s*/, '');
}

function plainText(source: string) {
  return withoutFrontmatter(source)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(source: string): ContentHeading[] {
  const occurrences = new Map<string, number>();
  return [...withoutFrontmatter(source).matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match) => {
    const text = match[2].replace(/[*_`]/g, '').replace(/\[|\]/g, '').trim();
    const baseId = slugify(text);
    const occurrence = occurrences.get(baseId) ?? 0;
    occurrences.set(baseId, occurrence + 1);
    return {
      id: occurrence === 0 ? baseId : `${baseId}-${occurrence}`,
      level: match[1].length,
      text,
    };
  });
}

const allProjectRecords = Object.entries(projectModules)
  .map(([, module]) => {
    const frontmatter = projectFrontmatterSchema.parse(module.frontmatter);
    const source = module.portfolioSource;
    return {
      ...frontmatter,
      kind: 'project' as const,
      href: `/work/${frontmatter.slug}`,
      headings: extractHeadings(source),
      bodyText: plainText(source),
      Content: module.default,
    } satisfies ProjectRecord;
  })
  .sort((a, b) => a.selectedWorkOrder - b.selectedWorkOrder);

const studioPreview = import.meta.env.DEV && import.meta.env.VITE_STUDIO_PREVIEW === 'true';
const publishedProjects = allProjectRecords.filter(
  (project) => studioPreview || project.publicationState === 'published',
);

export const previewProjectManifest: PreviewProjectRecord[] = allProjectRecords.map((project) => ({
  slug: project.slug,
  summary: project.summary,
  title: project.title,
  year: project.year,
  completedAt: project.completedAt,
  role: project.role,
  duration: project.duration,
  categories: project.categories,
  technologies: project.technologies,
  selectedWorkOrder: project.selectedWorkOrder,
  links: project.links,
  media: project.media,
  href: project.href,
}));

const publishedArticles = Object.entries(articleModules)
  .map(([, module]) => {
    const frontmatter = articleFrontmatterSchema.parse(module.frontmatter);
    const source = module.portfolioSource;
    return {
      ...frontmatter,
      kind: 'article' as const,
      href: `/writing/${frontmatter.slug}`,
      headings: extractHeadings(source),
      bodyText: plainText(source),
      Content: module.default,
    } satisfies ArticleRecord;
  })
  .filter((article) => studioPreview || article.status === 'published')
  .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));

export const portfolioManifest = {
  projects: publishedProjects,
  articles: publishedArticles,
};

export function getPublishedProject(slug: string) {
  return portfolioManifest.projects.find((project) => project.slug === slug);
}

export function getPublishedArticle(slug: string) {
  return portfolioManifest.articles.find((article) => article.slug === slug);
}

export function getPreviewProject(slug: string) {
  return previewProjectManifest.find((project) => project.slug === slug);
}
