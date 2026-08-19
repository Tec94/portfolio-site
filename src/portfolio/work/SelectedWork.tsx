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

        const panelImages = panels
          .map((panel) => panel.querySelector<HTMLElement>('.portfolio-selected__media img'))
          .map((image) => image ?? null);
        const panelCopies = panels.map((panel) => panel.querySelector<HTMLElement>('.portfolio-selected__copy'));
        const progressFill = scope.current?.querySelector<HTMLElement>('.portfolio-selected__progress-fill');
        const lastIndex = panels.length - 1;

        const renderStack = (progress: number) => {
          const position = progress * lastIndex;

          panels.forEach((panel, index) => {
            const distance = index - position;
            const depth = Math.abs(distance);
            const isPrevious = distance < 0;
            const opacityStep = isPrevious ? 0.28 : 0.34;
            const opacity = gsap.utils.clamp(0, 1, 1 - depth * opacityStep);
            const yPercent = distance * (isPrevious ? 7 : 11.5);
            const scale = 1 - Math.min(depth, 3) * 0.022;

            gsap.set(panel, {
              autoAlpha: opacity,
              yPercent,
              scale,
              zIndex: Math.round(1000 - depth * 100 + (distance >= 0 ? 1 : 0)),
            });

            const image = panelImages[index];
            if (image) {
              gsap.set(image, {
                yPercent: gsap.utils.clamp(-6, 6, distance * -3),
              });
            }

            const copy = panelCopies[index];
            if (copy) {
              const copyOpacity = distance < 0
                ? gsap.utils.clamp(0, 1, 1 + distance * 2.5)
                : opacity;
              gsap.set(copy, { autoAlpha: copyOpacity });
            }
          });

          if (progressFill) gsap.set(progressFill, { scaleX: progress });
        };

        renderStack(0);

        const scrollTrigger = ScrollTrigger.create({
          trigger: scope.current,
          start: 'top top',
          end: 'bottom bottom',
          snap: {
            snapTo: (progress) => Math.round(progress * lastIndex) / lastIndex,
            duration: { min: 0.12, max: 0.24 },
            delay: 0.08,
            ease: 'power1.out',
          },
          invalidateOnRefresh: true,
          onRefresh: (self) => renderStack(self.progress),
          onUpdate: (self) => renderStack(self.progress),
        });

        return () => scrollTrigger.kill();
      });
      return () => media.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="featured"
      className="portfolio-selected"
      data-portfolio-section="featured"
      aria-label="Featured projects"
    >
      <div className="portfolio-content-shell portfolio-selected__sticky">
        <div className="portfolio-selected__locator" aria-hidden="true">
          <span className="portfolio-selected__progress">
            <span className="portfolio-selected__progress-fill" />
          </span>
        </div>

        <div className="portfolio-selected__stage">
          {previewProjectManifest.map((project, index) => (
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
                <ProjectImage
                  project={project}
                  className="portfolio-selected__media"
                  transition
                  priority={index === 0}
                />
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
