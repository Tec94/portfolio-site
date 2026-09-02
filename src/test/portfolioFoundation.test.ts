import { createElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { projectFrontmatterSchema } from '../portfolio/content/contracts';
import { portfolioManifest, previewProjectManifest } from '../portfolio/content/manifest';
import { searchPortfolio } from '../portfolio/content/search';
import { inferCursorIntent } from '../portfolio/providers/CursorProvider';
import { readSoundPreference } from '../portfolio/providers/SoundProvider';
import { isThemeMode } from '../portfolio/providers/ThemeProvider';
import {
  filterPreviewProjects,
  formatProjectDate,
  projectTransitionStyle,
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
      'Artist Platform',
      'Nexora Landing Page',
      'Slack Agent',
    ]);
    expect(formatProjectDate(previewProjectManifest[0].completedAt!)).toBe('Oct 2025');
  });

  it('filters approved project metadata and publishes evidence-safe case studies', () => {
    expect(filterPreviewProjects(previewProjectManifest, 'hackathons').map(({ title }) => title))
      .toEqual(['Credify', 'CitizenVoice', 'Slack Agent']);
    expect(filterPreviewProjects(previewProjectManifest, 'sites').map(({ title }) => title))
      .toEqual(['Nexora Landing Page']);
    expect(searchPortfolio('CitizenVoice')[0]).toMatchObject({
      title: 'CitizenVoice',
      href: '/work/citizenvoice',
    });
  });

  it.each(['Smartnest', 'Stock Tracker', '$Munky'])('removes %s from search', (title) => {
    expect(searchPortfolio(title)).toEqual([]);
  });

  it.each([
    ['artist-platform', 'journey_hover.mp4'],
    ['nexora-landing-page', 'landing_demo.mp4'],
    ['slack-agent', 'slack_demo.mp4'],
  ])('maps %s to its own video and poster without invented metadata', (slug, filename) => {
    const project = portfolioManifest.projects.find((entry) => entry.slug === slug)!;
    expect(project.media[0]).toMatchObject({
      type: 'video',
      source: expect.stringContaining(`https://assets.jackcao.dev/projects/${slug}/${filename}?v=`),
      poster: expect.stringContaining(`https://assets.jackcao.dev/projects/${slug}/poster.jpg?v=`),
    });
    expect(project.completedAt).toBeUndefined();
    expect(project.role).toBeUndefined();
    expect(project.links).toEqual({});
    const view = render(createElement(ProjectImage, { project }));
    expect(screen.getByRole('img')).toHaveAttribute('src', project.media[0].poster);
    view.unmount();
  });

  it('keeps project navigation understandable when preview media fails', () => {
    render(createElement(ProjectImage, { project: previewProjectManifest[0] }));
    fireEvent.error(screen.getByRole('img', { name: /Credify product interface/i }));
    expect(screen.getByText('Credify')).toBeInTheDocument();
  });

  it('allows the first featured image to bypass lazy loading', () => {
    render(createElement(ProjectImage, {
      project: previewProjectManifest[0],
      priority: true,
    }));
    const image = screen.getByRole('img', { name: /Credify product interface/i });
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchpriority', 'high');
  });

  it('ranks exact route titles ahead of supporting copy', () => {
    const [result] = searchPortfolio('Work');
    expect(result.title).toBe('Work');
    expect(result.kind).toBe('route');
    expect(result.href).toBe('/#work');
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
    if (parsed.success) {
      expect(projectFrontmatterSchema.safeParse({ ...parsed.data, completedAt: undefined }).success).toBe(false);
      expect(projectFrontmatterSchema.safeParse({ ...parsed.data, links: {} }).success).toBe(false);
      expect(projectFrontmatterSchema.safeParse({ ...parsed.data, technologies: undefined }).success).toBe(false);
    }
  });

  it('only accepts explicit light and dark theme modes', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
    expect(isThemeMode('sepia')).toBe(false);
  });

  it('gives project media and titles matched view-transition identities', () => {
    expect(projectTransitionStyle('credify', 'media')).toEqual({
      viewTransitionName: 'portfolio-media-credify',
      viewTransitionClass: 'portfolio-project-media-transition',
    });
    expect(projectTransitionStyle('credify', 'title')).toEqual({
      viewTransitionName: 'portfolio-title-credify',
      viewTransitionClass: 'portfolio-project-title-transition',
    });
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
