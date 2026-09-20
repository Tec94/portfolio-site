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
  const previewSource = media.type === 'video' ? media.poster : media.source;

  useEffect(() => setFailed(false), [previewSource]);

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
      {failed || !previewSource ? (
        <span className="portfolio-project-image__fallback" aria-hidden={decorative || undefined}>
          {project.title}
        </span>
      ) : (
        <img
          src={previewSource}
          alt={decorative ? '' : media.alt}
          aria-hidden={decorative || undefined}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...(priority ? { fetchpriority: 'high' } : {})}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
