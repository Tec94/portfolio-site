import type { PreviewProjectRecord } from '../content/manifest';

export type WorkFilter = 'all' | 'hackathons' | 'sites' | 'data';

export const workFilters: Array<{ id: WorkFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'sites', label: 'Sites' },
  { id: 'data', label: 'Data' },
];

export function formatProjectDate(completedAt: string) {
  const [year, month] = completedAt.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function projectTransitionName(slug: string, part: 'media' | 'title') {
  return `portfolio-${part}-${slug.replace(/[^a-z0-9-]/gi, '-')}`;
}

export function prepareProjectTransition(root: HTMLElement, slug: string) {
  document.querySelectorAll<HTMLElement>('[data-project-transition]').forEach((element) => {
    element.style.removeProperty('view-transition-name');
  });
  const transitionElements = [
    ...(root.matches('[data-project-transition]') ? [root] : []),
    ...root.querySelectorAll<HTMLElement>('[data-project-transition]'),
  ];
  transitionElements.forEach((element) => {
    const part = element.dataset.projectTransition;
    if (part === 'media' || part === 'title') {
      element.style.setProperty('view-transition-name', projectTransitionName(slug, part));
    }
  });
}

export function filterPreviewProjects(
  projects: PreviewProjectRecord[],
  filter: WorkFilter,
) {
  if (filter === 'all') return projects;
  const category = {
    hackathons: 'Hackathon',
    sites: 'Product site',
    data: 'Financial data',
  }[filter];
  return projects.filter((project) => project.categories.includes(category));
}
