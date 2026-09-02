import { describe, expect, it } from 'vitest';
import { parseProjectView } from '../components/v2/projectViewState';
import { projects } from '../data/portfolioData';

describe('project view URL state', () => {
  it('defaults an invalid project to the first project', () => {
    const result = parseProjectView(new URLSearchParams('view=unknown&project=missing'));
    expect(result.project.id).toBe(projects[0].id);
  });

  it('restores the shared project id', () => {
    const result = parseProjectView(new URLSearchParams('project=citizenvoice'));
    expect(result.project.id).toBe('citizenvoice');
  });

  it.each(['smartnest', 'stock-tracker', 'munky'])('does not restore the removed project %s', (slug) => {
    expect(projects.some((project) => project.id === slug)).toBe(false);
    expect(parseProjectView(new URLSearchParams(`project=${slug}`)).project.id).toBe(projects[0].id);
  });
});
