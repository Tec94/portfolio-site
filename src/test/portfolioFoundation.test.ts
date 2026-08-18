import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projectFrontmatterSchema } from '../portfolio/content/contracts';
import { portfolioManifest, previewProjectManifest } from '../portfolio/content/manifest';
import { searchPortfolio } from '../portfolio/content/search';
import { inferCursorIntent } from '../portfolio/providers/CursorProvider';
import { readSoundPreference } from '../portfolio/providers/SoundProvider';
import { isThemeMode, resolveTheme } from '../portfolio/providers/ThemeProvider';
import {
  filterPreviewProjects,
  formatProjectDate,
} from '../portfolio/work/projectPresentation';
import { ProjectImage } from '../portfolio/work/ProjectMedia';

describe('portfolio foundation', () => {
  it('keeps draft MDX out of the published manifest and search', () => {
    expect(portfolioManifest.projects).toHaveLength(5);
    expect(portfolioManifest.articles).toHaveLength(0);
    expect(searchPortfolio('Ship small, learn fast')).toEqual([]);
    expect(searchPortfolio('Credify')[0]).toMatchObject({
      title: 'Credify',
      href: '/work/credify',
      kind: 'project',
    });
  });

  it('keeps the approved preview order and canonical project names', () => {
    expect(previewProjectManifest.map(({ title }) => title)).toEqual([
      'Credify',
      'CitizenVoice',
      'Smartnest',
      'Stock Tracker',
      '$Munky',
    ]);
    expect(formatProjectDate(previewProjectManifest[0].completedAt)).toBe('Oct 2025');
  });

  it('filters approved project metadata and publishes evidence-safe case studies', () => {
    expect(filterPreviewProjects(previewProjectManifest, 'hackathons').map(({ title }) => title))
      .toEqual(['Credify', 'CitizenVoice']);
    expect(filterPreviewProjects(previewProjectManifest, 'sites').map(({ title }) => title))
      .toEqual(['Smartnest', '$Munky']);
    expect(searchPortfolio('CitizenVoice')[0]).toMatchObject({
      title: 'CitizenVoice',
      href: '/work/citizenvoice',
    });
  });

  it('keeps project navigation understandable when preview media fails', () => {
    render(createElement(ProjectImage, { project: previewProjectManifest[0] }));
    fireEvent.error(screen.getByRole('img', { name: /Credify product interface/i }));
    expect(screen.getByText('Credify')).toBeInTheDocument();
  });

  it('ranks exact route titles ahead of supporting copy', () => {
    const [result] = searchPortfolio('Work');
    expect(result.title).toBe('Work');
    expect(result.kind).toBe('route');
  });

  it('validates the complete project media contract', () => {
    const parsed = projectFrontmatterSchema.safeParse({
      slug: 'verified-project',
      title: 'Verified Project',
      summary: 'Verified summary.',
      year: 2025,
      completedAt: '2025-10',
      role: 'Product engineer',
      duration: 'October 2025',
      categories: ['Product engineering'],
      technologies: ['React'],
      selectedWorkOrder: 1,
      links: { live: 'https://example.com' },
      publicationState: 'draft',
      media: [
        {
          type: 'image',
          source: '/screenshots/credify.svg',
          alt: 'Product interface',
          aspectRatio: { width: 16, height: 10 },
          narrativeRole: 'hero',
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it('uses system theme until a valid explicit mode is chosen', () => {
    expect(isThemeMode('system')).toBe(true);
    expect(isThemeMode('sepia')).toBe(false);
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('enables sound by default and respects an explicit mute', () => {
    expect(readSoundPreference({ getItem: () => null })).toBe(true);
    expect(readSoundPreference({ getItem: () => 'off' })).toBe(false);
  });

  it('resolves cursor intent from explicit regions and semantic controls', () => {
    const media = document.createElement('div');
    media.dataset.cursorIntent = 'media';
    expect(inferCursorIntent(media)).toBe('media');

    const button = document.createElement('button');
    expect(inferCursorIntent(button)).toBe('link');

    const input = document.createElement('input');
    expect(inferCursorIntent(input)).toBe('text');
  });
});
