import { useState } from 'react';
import { flushSync } from 'react-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { education, experiences, profile, toolbox } from '../../data/portfolioData';
import { usePortfolioSound } from '../providers/SoundProvider';

const visibleChapters = 3;

export function ResumeStamp() {
  return <a className="portfolio-stamp portfolio-dossier-resume" href={profile.resumeUrl} target="_blank" rel="noreferrer" aria-label="Resume (PDF, opens in a new tab)">Resume</a>;
}

export function AboutDossier() {
  const [showAll, setShowAll] = useState(false);
  const sound = usePortfolioSound();
  const reducedMotion = usePrefersReducedMotion();
  const toggleChapters = () => {
    sound.play('press');
    const update = () => setShowAll((expanded) => !expanded);
    if (reducedMotion || typeof document.startViewTransition !== 'function') update();
    else document.startViewTransition(() => flushSync(update));
  };
  const chapters = [
    ...experiences.map((experience) => ({
      title: experience.company,
      description: experience.role,
      location: experience.location,
      period: experience.period,
      year: experience.period.match(/\d{4}/)?.[0] ?? '',
      highlights: experience.highlights,
      education: false,
    })),
    {
      title: education.school,
      description: education.degree,
      location: education.location,
      period: education.period,
      year: education.period.match(/\d{4}/)?.[0] ?? '',
      highlights: [] as string[],
      education: true,
    },
  ].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className="portfolio-dossier-body">
      <ol className="portfolio-dossier-ledger" aria-label="Experience and education">
        {(showAll ? chapters : chapters.slice(0, visibleChapters)).map((chapter) => (
          <li key={chapter.title}>
            <div className="portfolio-dossier-date">
              <span className="sr-only">{chapter.period}</span>
              <span className="portfolio-dossier-year" aria-hidden="true">{chapter.year}{chapter.education ? '–' : ''}</span>
              <span className="portfolio-dossier-months" aria-hidden="true">{chapter.education
                ? `Exp. ${chapter.period.match(/\d{4}/g)?.slice(-1)[0]}`
                : chapter.period.replace(/\s*\d{4}/g, '').replace(/[A-Za-z]+/g, (month) => month.slice(0, 3))}</span>
            </div>
            <div className="portfolio-dossier-entry">
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
              {chapter.highlights.length ? (
                <details className="portfolio-dossier-more" onToggle={() => sound.play('press')}>
                  <summary>Highlights <span aria-hidden="true">+</span></summary>
                  <ul>{chapter.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                </details>
              ) : null}
            </div>
            <span className="portfolio-dossier-place" title={chapter.location}>{chapter.location.split(',')[0]}</span>
          </li>
        ))}
      </ol>
      {chapters.length > visibleChapters ? (
        <button type="button" className="portfolio-dossier-toggle" aria-expanded={showAll} onClick={toggleChapters}>
          {showAll ? 'View less' : `View more · ${String(chapters.length - visibleChapters).padStart(2, '0')}`}
        </button>
      ) : null}
      <section className="portfolio-dossier-tools" aria-label="Toolbox">
        <div className="portfolio-ledger-heading"><h3>Toolbox</h3><span aria-hidden="true" /><span>{String(toolbox.length).padStart(2, '0')}</span></div>
        <ul>{toolbox.map((tool) => <li key={tool}><span>{tool}</span></li>)}</ul>
      </section>
    </div>
  );
}
