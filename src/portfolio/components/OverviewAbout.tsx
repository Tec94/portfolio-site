import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { education, experiences, toolbox } from '../../data/portfolioData';
import { usePortfolioSound } from '../providers/SoundProvider';

export function OverviewAbout() {
  const [expanded, setExpanded] = useState(false);
  const [atPageEnd, setAtPageEnd] = useState(false);
  const atPageEndRef = useRef(false);
  const headingRef = useRef<HTMLElement>(null);
  const previousHeadingTop = useRef<number>();
  const sound = usePortfolioSound();
  const compactExperiences = experiences.slice(0, 2);
  const additionalExperiences = experiences.slice(2);

  useEffect(() => {
    if (!expanded) {
      atPageEndRef.current = false;
      setAtPageEnd(false);
      return undefined;
    }

    const updateEndState = () => {
      const page = document.documentElement;
      const nextAtPageEnd = window.scrollY + window.innerHeight >= page.scrollHeight - 1;
      if (atPageEndRef.current === nextAtPageEnd) return;
      previousHeadingTop.current = headingRef.current?.getBoundingClientRect().top;
      atPageEndRef.current = nextAtPageEnd;
      setAtPageEnd(nextAtPageEnd);
    };

    const frame = window.requestAnimationFrame(updateEndState);
    window.addEventListener('scroll', updateEndState, { passive: true });
    window.addEventListener('resize', updateEndState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateEndState);
      window.removeEventListener('resize', updateEndState);
    };
  }, [expanded]);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const previousTop = previousHeadingTop.current;
    previousHeadingTop.current = undefined;
    if (
      !heading ||
      previousTop === undefined ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof heading.animate !== 'function'
    ) return undefined;

    const currentTop = heading.getBoundingClientRect().top;
    const animation = heading.animate(
      [
        { transform: `translateY(${previousTop - currentTop}px)` },
        { transform: 'translateY(0)' },
      ],
      { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
    return () => animation.cancel();
  }, [atPageEnd]);

  return (
    <section
      id="about"
      className="portfolio-content-shell portfolio-split-layout portfolio-overview-section portfolio-about-overview"
      data-portfolio-section="about"
      data-at-end={atPageEnd || undefined}
    >
      <header ref={headingRef} className="portfolio-section-heading">
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
          onClick={() => {
            setExpanded((current) => !current);
            sound.play('press');
          }}
        >
          {expanded ? 'Show less' : 'More about me'}
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
