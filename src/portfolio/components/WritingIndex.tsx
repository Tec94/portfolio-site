import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import pageCopy from '../../content/site/WritingPage.json';
import { portfolioManifest, type ArticleRecord } from '../content/manifest';

// `detailed` is the /writing index row: full date and tags instead of reading time.
export function WritingList({ articles, detailed = false }: { articles: ArticleRecord[]; detailed?: boolean }) {
  return (
    <div className="portfolio-writing-rows">
      {articles.map((article) => (
        <Link key={article.slug} className="portfolio-writing-row" data-format={article.format} to={article.href}>
          <time dateTime={article.publicationDate}>
            {new Intl.DateTimeFormat('en-US', detailed ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', year: '2-digit' }).format(new Date(`${article.publicationDate}T12:00:00`))}
          </time>
          <div className="portfolio-writing-row__copy">
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            {detailed && article.tags.length ? <WritingTags tags={article.tags} /> : null}
          </div>
          {!detailed && article.readingMinutes ? <span className="portfolio-writing-row__read">{article.readingMinutes} min</span> : null}
        </Link>
      ))}
    </div>
  );
}

export function WritingTags({ tags }: { tags: string[] }) {
  return <ul className="portfolio-writing-tags" aria-label="Tags">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
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
        {portfolioManifest.articles.length > 3 && <Link className="portfolio-writing-more" to="/writing">All writing <ArrowRight aria-hidden="true" /></Link>}
      </header>
      <div className="portfolio-writing-results">
        {articles.length ? <WritingList articles={articles} /> : <WritingEmptyState />}
      </div>
    </section>
  );
}
