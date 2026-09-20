import pageCopy from '../../content/site/WritingPage.json';
import { useState } from 'react';
import { usePortfolioSound } from '../providers/SoundProvider';
import { Link } from 'react-router-dom';
import { portfolioManifest } from '../content/manifest';
import { WritingEmptyState, WritingList } from '../components/WritingIndex';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'Note', label: 'Notes' },
  { value: 'Write-up', label: 'Write-ups' },
] as const;

export function WritingPage() {
  const sound = usePortfolioSound();
  const [filter, setFilter] = useState<string>('all');
  const articles = portfolioManifest.articles;
  const visible = articles.filter((article) => filter === 'all' || article.format === filter);
  return (
    <main id="portfolio-main" className="portfolio-writing-page portfolio-writing-layout">
      <header className="portfolio-writing-index">
        <h1>{pageCopy.writing}</h1>
        <div className="portfolio-writing-filters" role="group" aria-label="Filter writing">
          {filters.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={filter === value} aria-controls="portfolio-writing-results" onClick={() => {
              if (filter !== value) { setFilter(value); sound.play('press'); }
            }}>
              {label}<span aria-hidden="true">{String(articles.filter((article) => value === 'all' || article.format === value).length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <Link className="portfolio-writing-rule-link" to="/#writing">Back to home</Link>
      </header>
      <div id="portfolio-writing-results" className="portfolio-writing-results" aria-live="polite">
        {visible.length ? <WritingList articles={visible} /> : <WritingEmptyState filtered={articles.length > 0} />}
      </div>
    </main>
  );
}
