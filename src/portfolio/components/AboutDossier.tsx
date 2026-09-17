import { ArrowUpRight } from 'lucide-react';
import { education, experiences, profile, toolbox } from '../../data/portfolioData';
import pageCopy from '../../content/site/OverviewAbout.json';

const toolGroups = [
  { title: 'Languages', tools: ['TypeScript', 'Python', 'C', 'SQL'] },
  { title: 'Building with', tools: ['React', 'Node.js', 'Vite'] },
  { title: 'Data', tools: ['PostgreSQL'] },
];

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
      <p className="portfolio-dossier-intro">{pageCopy.i_m_jack_a_product_engineer_in_texas_i_care_about_the_point_where_a_good_concept_survives_contact_with_real_data_real_constraints_and_real_people}</p>
      <ol className="portfolio-dossier-ledger" aria-label="Experience and education">
        {chapters.map((chapter) => (
          <li key={chapter.title}>
            <span className="portfolio-dossier-year">{chapter.year}{chapter.education ? '–' : ''}</span>
            <div>
              <div className="portfolio-dossier-entry"><h3>{chapter.title}</h3><span>{chapter.location} · {chapter.period}</span></div>
              <p>{chapter.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="portfolio-dossier-tools">
        {toolGroups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <h3>{group.title}</h3>
            <ul>{group.tools.filter((tool) => toolbox.includes(tool)).map((tool) => <li key={tool}>{tool}</li>)}</ul>
          </section>
        ))}
      </div>
      <div className="portfolio-about-actions">
        <a href={profile.resumeUrl} target="_blank" rel="noreferrer">Résumé<ArrowUpRight aria-hidden="true" /></a>
        <a href={profile.calUrl} target="_blank" rel="noreferrer">Book 15 minutes</a>
      </div>
    </div>
  );
}
