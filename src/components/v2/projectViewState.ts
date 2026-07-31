import { projects } from '../../data/portfolioData';

export function parseProjectView(searchParams: URLSearchParams) {
  const requestedProject = searchParams.get('project');
  const project = projects.find((item) => item.id === requestedProject) ?? projects[0];
  return { project };
}
