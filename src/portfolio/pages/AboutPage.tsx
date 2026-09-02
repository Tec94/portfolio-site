import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, FileText, Github, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { experiences, profile, timeline, toolbox } from '../../data/portfolioData';

export function AboutPage() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const localTime = useMemo(
    () => new Intl.DateTimeFormat('en-US', {
      timeZone: profile.timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(now),
    [now],
  );
  return (
    <main id="portfolio-main" className="portfolio-route-page portfolio-about-page">
      <header className="portfolio-route-header">
        <p className="portfolio-kicker">About</p>
        <h1>A product engineer who designs.</h1>
        <p>I work from the interface inward—shaping the system, states, and implementation until a product is useful in someone’s hands.</p>
        <div className="portfolio-about-location">
          <MapPin aria-hidden="true" />
          <span>{profile.location}</span>
          <time dateTime={now.toISOString()}>{localTime}</time>
        </div>
      </header>

      <section className="portfolio-about-section" aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        <div className="portfolio-about-ledger">
          {experiences.map((experience) => (
            <article key={experience.company}>
              <time>{experience.period}</time>
              <div><h3>{experience.company}</h3><p>{experience.role}</p></div>
              <span>{experience.location}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-about-section" aria-labelledby="milestones-heading">
        <h2 id="milestones-heading">Milestones</h2>
        <div className="portfolio-milestones">
          {timeline.map((chapter) => (
            <article key={chapter.year}>
              <time>{chapter.year}</time>
              <h3>{chapter.title}</h3>
              <p>{chapter.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-about-section" aria-labelledby="toolbox-heading">
        <h2 id="toolbox-heading">Toolbox</h2>
        <ul className="portfolio-toolbox">
          {toolbox.map((tool) => <li key={tool}>{tool}</li>)}
        </ul>
      </section>

      <section className="portfolio-about-actions" aria-label="More about Jack">
        <a href="https://github.com/Tec94" target="_blank" rel="noreferrer"><Github aria-hidden="true" /> GitHub</a>
        <a href={profile.resumeUrl} target="_blank" rel="noreferrer"><FileText aria-hidden="true" /> Résumé</a>
        <Link to="/writing">Writing <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
