import { education, experiences, profile, toolbox } from '../../data/portfolioData';

export function AboutDossier() {
  const chapters = [
    ...experiences.map((experience) => ({
      title: experience.company,
      description: experience.role,
      location: experience.location,
      period: experience.period,
      year: experience.period.match(/\d{4}/)?.[0] ?? '',
      education: false,
    })),
    {
      title: education.school,
      description: education.degree,
      location: education.location,
      period: education.period,
      year: education.period.match(/\d{4}/)?.[0] ?? '',
      education: true,
    },
  ].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <div className="portfolio-dossier-body">
      <ol className="portfolio-dossier-ledger" aria-label="Experience and education">
        {chapters.map((chapter) => (
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
            </div>
            <span className="portfolio-dossier-place" title={chapter.location}>{chapter.location.split(',')[0]}</span>
          </li>
        ))}
      </ol>
      <section className="portfolio-dossier-tools" aria-label="Toolbox">
        <div className="portfolio-ledger-heading"><h3>Toolbox</h3><span aria-hidden="true" /><span>{String(toolbox.length).padStart(2, '0')}</span></div>
        <ul>{toolbox.map((tool) => <li key={tool}>{tool}</li>)}</ul>
      </section>
      <a className="portfolio-inline-link portfolio-dossier-resume" href={profile.resumeUrl} target="_blank" rel="noreferrer">Résumé <span>PDF ↗</span></a>
    </div>
  );
}
