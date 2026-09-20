import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecentWriting } from '../portfolio/components/WritingIndex';
import { WritingPage } from '../portfolio/pages/WritingPage';
import { ArticleBoundaryPage } from '../portfolio/pages';
import { portfolioManifest } from '../portfolio/content/manifest';
import { articleFrontmatterSchema } from '../portfolio/content/contracts';
import { writingFixtures } from './fixtures/writing';
import { PortfolioSoundProvider } from '../portfolio/providers/SoundProvider';

const savedArticles = [...portfolioManifest.articles];
beforeEach(() => { portfolioManifest.articles.splice(0, portfolioManifest.articles.length, ...writingFixtures); });
afterEach(() => {
  cleanup();
  portfolioManifest.articles.splice(0, portfolioManifest.articles.length, ...savedArticles);
});

function renderWriting(path = '/') {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/" element={<RecentWriting />} />
    <Route path="/writing" element={<WritingPage />} />
    <Route path="/writing/:slug" element={<ArticleBoundaryPage />} />
  </Routes></MemoryRouter>, { wrapper: PortfolioSoundProvider });
}

describe('writing screens', () => {
  it('shows only the latest three on home and opens the full index directly', async () => {
    const user = userEvent.setup();
    renderWriting();
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(['Writing', ...writingFixtures.slice(0, 3).map((article) => article.title)]);
    expect(screen.queryByText(writingFixtures[3].title)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All writing' })).toHaveAttribute('href', '/writing');
    await user.click(screen.getByRole('link', { name: 'All writing' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Writing' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(writingFixtures.length);
  });

  it('filters notes and write-ups and restores the complete index', () => {
    renderWriting('/writing');
    for (const [label, format] of [['Notes', 'Note'], ['Write-ups', 'Write-up']]) {
      const button = screen.getByRole('button', { name: label });
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(writingFixtures.filter((article) => article.format === format).map((article) => article.title));
    }
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(writingFixtures.length);
  });

  it('renders post metadata, body, series and working adjacent navigation', () => {
    renderWriting('/writing/postgis');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(writingFixtures[2].title);
    const facts = within(screen.getByRole('complementary', { name: 'Article details' }));
    expect(facts.getByText('Nov 3, 2025')).toBeInTheDocument();
    expect(facts.getByText('Note · 3 min')).toBeInTheDocument();
    expect(facts.getByText('SQL · PostGIS')).toBeInTheDocument();
    expect(screen.getByLabelText('Part 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Sample margin note for checking the article layout.')).toBeInTheDocument();
    expect(screen.getByText(/select id, title/)).toBeInTheDocument();
    const nav = within(screen.getByRole('navigation', { name: 'More writing' }));
    expect(nav.getByRole('link', { name: /Previous/ })).toHaveAttribute('href', '/writing/credify');
    fireEvent.click(nav.getByRole('link', { name: /Next/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(writingFixtures[1].title);
    fireEvent.click(screen.getByRole('link', { name: 'Writing' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Writing' })).toBeInTheDocument();
  });

  it('handles an empty index and unpublished URLs without exposing drafts', () => {
    portfolioManifest.articles.splice(0);
    const view = renderWriting('/writing');
    expect(screen.getByRole('status')).toHaveTextContent('No published notes yet.');
    view.unmount();
    renderWriting('/writing/ship-small-learn-fast');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('This article is unavailable.');
  });

  it('renders a single post without fake series, reading time, or adjacent links', () => {
    const article = { ...writingFixtures[0], readingMinutes: undefined, series: undefined };
    portfolioManifest.articles.splice(0, portfolioManifest.articles.length, article);
    renderWriting(article.href);
    expect(screen.queryByRole('navigation', { name: 'More writing' })).not.toBeInTheDocument();
    expect(screen.queryByText(/min$/)).not.toBeInTheDocument();
    expect(screen.queryByText('Things that bit me')).not.toBeInTheDocument();
  });

  it('accepts legacy article metadata and authored format, reading time, and series', () => {
    const metadata = { slug: 'example', title: 'Example', summary: 'Summary', publicationDate: '2026-01-01', tags: ['Process'], status: 'draft' };
    expect(articleFrontmatterSchema.parse(metadata).format).toBe('Note');
    expect(articleFrontmatterSchema.parse({ ...metadata, format: 'Write-up', readingMinutes: 7, series: 'Build notes' })).toMatchObject({ format: 'Write-up', readingMinutes: 7, series: 'Build notes' });
  });
});
