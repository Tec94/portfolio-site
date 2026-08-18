import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { previewProjectManifest } from '../content/manifest';
import { usePortfolioSound } from '../providers/SoundProvider';
import { ProjectImage } from './ProjectMedia';
import { prepareProjectTransition } from './projectPresentation';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SelectedWork() {
  const scope = useRef<HTMLElement>(null);
  const sound = usePortfolioSound();

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(min-width: 56rem) and (prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.portfolio-selected__panel');
        if (panels.length < 2) return undefined;

        gsap.set(panels, { autoAlpha: 0, yPercent: 0, scale: 0.96 });
        gsap.set(panels[0], { autoAlpha: 1, scale: 1 });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            snap: {
              snapTo: 'labelsDirectional',
              duration: { min: 0.12, max: 0.24 },
              delay: 0.08,
              ease: 'power1.out',
            },
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set('.portfolio-selected__progress-fill', { scaleX: self.progress });
            },
          },
        });

        timeline.addLabel('project-0', 0);

        panels.slice(1).forEach((panel, index) => {
          const previous = panels[index];
          timeline
            .to(previous, { autoAlpha: 0, scale: 0.965, duration: 0.45 })
            .fromTo(
              panel,
              { autoAlpha: 0, scale: 0.96 },
              { autoAlpha: 1, scale: 1, duration: 0.55 },
              '<0.15',
            )
            .fromTo(
              panel.querySelector('.portfolio-selected__media img'),
              { yPercent: 4 },
              { yPercent: -4, duration: 0.55 },
              '<',
            );
          timeline.addLabel(`project-${index + 1}`);
        });

        return () => timeline.kill();
      });
      return () => media.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="work"
      className="portfolio-selected"
      data-portfolio-section="work"
      aria-labelledby="selected-work-heading"
    >
      <div className="portfolio-selected__sticky">
        <header className="portfolio-section-heading portfolio-selected__heading">
          <h2 id="selected-work-heading">My Projects</h2>
        </header>

        <div className="portfolio-selected__locator" aria-hidden="true">
          <span className="portfolio-selected__progress">
            <span className="portfolio-selected__progress-fill" />
          </span>
        </div>

        <div className="portfolio-selected__stage">
          {previewProjectManifest.map((project) => (
            <article className="portfolio-selected__panel" key={project.slug}>
              <Link
                to={project.href}
                viewTransition
                className="portfolio-selected__link"
                onClick={(event) => {
                  prepareProjectTransition(event.currentTarget, project.slug);
                  sound.playPageOpen();
                }}
              >
                <ProjectImage project={project} className="portfolio-selected__media" transition />
                <span className="portfolio-selected__copy">
                  <strong data-project-transition="title">
                    {project.title}
                  </strong>
                </span>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
