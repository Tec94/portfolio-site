import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import pageCopy from '../../content/site/WritingPage.json';
import { portfolioManifest, type ArticleRecord } from '../content/manifest';

export function WritingList({ articles }: { articles: ArticleRecord[] }) {
  return (
    <div className="portfolio-writing-rows">
      {articles.map((article) => (
        <Link key={article.slug} className="portfolio-writing-row" data-format={article.format} to={article.href}>
          <time dateTime={article.publicationDate}>
            {new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(new Date(`${article.publicationDate}T12:00:00`))}
          </time>
          <div className="portfolio-writing-row__copy">
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
          </div>
          {article.readingMinutes ? <span className="portfolio-writing-row__read">{article.readingMinutes} min</span> : null}
        </Link>
      ))}
    </div>
  );
}

export function WritingEmptyState({ filtered = false }: { filtered?: boolean }) {
  return (
    <div className="portfolio-writing-empty" role="status">
      <p>{filtered ? 'No posts in this category yet.' : pageCopy.no_published_notes_yet}</p>
      {!filtered && <Link className="portfolio-writing-rule-link" to="/#work">{pageCopy.view_work}<ArrowRight aria-hidden="true" /></Link>}
    </div>
  );
}

export function RecentWriting() {
  // The homepage shows the three most recent posts; the manifest is newest first.
  const articles = portfolioManifest.articles.slice(0, 3);
  return (
    <section id="writing" className="portfolio-content-shell portfolio-split-layout portfolio-overview-section portfolio-writing-teaser" data-empty={articles.length === 0 || undefined} data-portfolio-section="writing" aria-labelledby="portfolio-writing-heading">
      <header className="portfolio-writing-index">
        <h2 id="portfolio-writing-heading">{pageCopy.writing}</h2>
      </header>
      <div className="portfolio-writing-results">
        {articles.length ? <WritingList articles={articles} /> : <WritingEmptyState />}
        {portfolioManifest.articles.length > 3 && <Link className="portfolio-writing-more" to="/writing">All writing <ArrowRight aria-hidden="true" /></Link>}
      </div>
    </section>
  );
}
