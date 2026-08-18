import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioManifest } from '../content/manifest';

export function WritingPage() {
  return (
    <main id="portfolio-main" className="portfolio-route-page portfolio-writing-page">
      <header className="portfolio-route-header">
        <p className="portfolio-kicker">Writing</p>
        <h1>Notes from the work.</h1>
      </header>

      {portfolioManifest.articles.length ? (
        <div className="portfolio-writing-list">
          {portfolioManifest.articles.map((article) => (
            <article key={article.slug}>
              <time dateTime={article.publicationDate}>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${article.publicationDate}T12:00:00`))}</time>
              <h2><Link to={article.href}>{article.title}</Link></h2>
              <p>{article.summary}</p>
              <ul>{article.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </article>
          ))}
        </div>
      ) : (
        <section className="portfolio-empty-state">
          <h2>No published notes yet.</h2>
          <Link to="/lab">Visit the Lab <ArrowUpRight aria-hidden="true" /></Link>
        </section>
      )}
    </main>
  );
}
