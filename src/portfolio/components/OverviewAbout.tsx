import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { education, experiences, toolbox } from '../../data/portfolioData';

export function OverviewAbout() {
  const [expanded, setExpanded] = useState(false);
  const compactExperiences = experiences.slice(0, 2);
  const additionalExperiences = experiences.slice(2);

  return (
    <section
      id="about"
      className="portfolio-overview-section portfolio-about-overview"
      data-portfolio-section="about"
    >
      <header className="portfolio-section-heading">
        <h2>About</h2>
      </header>

      <div className="portfolio-about-overview__body">
        <p className="portfolio-about-copy">
          I’m Jack, a product engineer in Texas. I care about the point where a good concept survives contact with real data, real constraints, and real people.
        </p>

        <div className="portfolio-experience">
          {compactExperiences.map((experience) => (
            <div key={experience.company}>
              <strong>{experience.company}</strong>
              <span>{experience.role}</span>
              <time>{experience.period}</time>
            </div>
          ))}
        </div>

        <div
          id="portfolio-about-details"
          className="portfolio-about-overview__full"
          data-expanded={expanded}
          aria-hidden={!expanded}
        >
          <div>
            <div className="portfolio-experience">
              {additionalExperiences.map((experience) => (
                <div key={experience.company}>
                  <strong>{experience.company}</strong>
                  <span>{experience.role}</span>
                  <time>{experience.period}</time>
                </div>
              ))}
            </div>

            <div className="portfolio-about-overview__details">
              <article>
                <h3>Education</h3>
                <strong>{education.school}</strong>
                <span>{education.degree}</span>
                <span>{education.location}</span>
                <time>{education.period}</time>
              </article>
              <article>
                <h3>Toolbox</h3>
                <ul>
                  {toolbox.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </article>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="portfolio-inline-link portfolio-about-overview__toggle"
          aria-expanded={expanded}
          aria-controls="portfolio-about-details"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? 'Show less' : 'More about me'}
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
