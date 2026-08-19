import { useEffect, useState } from 'react';
import type { PreviewProjectRecord } from '../content/manifest';
import { projectTransitionStyle } from './projectPresentation';

interface ProjectImageProps {
  project: PreviewProjectRecord;
  className?: string;
  decorative?: boolean;
  transition?: boolean;
  activeTransition?: boolean;
  priority?: boolean;
}

export function ProjectImage({
  project,
  className,
  decorative = false,
  transition = false,
  activeTransition = false,
  priority = false,
}: ProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const media = project.media[0];

  useEffect(() => setFailed(false), [media.source]);

  const style = activeTransition
    ? projectTransitionStyle(project.slug, 'media')
    : undefined;

  return (
    <span
      className={className}
      data-media-failed={failed || undefined}
      data-project-transition={transition ? 'media' : undefined}
      style={style}
    >
      {failed ? (
        <span className="portfolio-project-image__fallback" aria-hidden={decorative || undefined}>
          {project.title}
        </span>
      ) : (
        <img
          src={media.source}
          alt={decorative ? '' : media.alt}
          aria-hidden={decorative || undefined}
          loading={priority ? 'eager' : 'lazy'}
          {...(priority ? { fetchpriority: 'high' } : {})}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export function MediaStack({
  project,
  transition = false,
}: {
  project: PreviewProjectRecord;
  transition?: boolean;
}) {
  return (
    <span className="portfolio-media-stack" data-cursor-intent="media" data-cursor-tone="dark">
      <ProjectImage project={project} className="portfolio-media-stack__frame is-back" decorative />
      <ProjectImage project={project} className="portfolio-media-stack__frame is-middle" decorative />
      <ProjectImage
        project={project}
        className="portfolio-media-stack__frame is-front"
        transition={transition}
      />
    </span>
  );
}
