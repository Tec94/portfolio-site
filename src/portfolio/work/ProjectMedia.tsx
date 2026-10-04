import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import type { PreviewProjectRecord } from '../content/manifest';
import { projectTransitionStyle } from './projectPresentation';
import thumbnailManifest from './thumbnails.json';

const thumbnails: Record<string, { source: string; width: number; height: number }> = thumbnailManifest;

interface ProjectImageProps {
  project: PreviewProjectRecord;
  className?: string;
  decorative?: boolean;
  transition?: boolean;
  activeTransition?: boolean;
  priority?: boolean;
  thumbnail?: boolean;
  /** Play a video cover as a muted loop while it is on screen. */
  loop?: boolean;
}

export function ProjectImage({
  project,
  className,
  decorative = false,
  transition = false,
  activeTransition = false,
  priority = false,
  thumbnail = false,
  loop = false,
}: ProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const media = project.media[0];
  const previewSource = media.type === 'video' ? media.poster : media.source;
  const smallImage = thumbnail && previewSource ? thumbnails[previewSource] : undefined;

  useEffect(() => setFailed(false), [previewSource]);

  const playsLoop = loop && media.type === 'video' && !reducedMotion && !failed;
  useEffect(() => {
    if (!playsLoop || !video || typeof IntersectionObserver === 'undefined') return;
    // Only decode while visible; offscreen loops stay paused.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [playsLoop, video]);

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
      {playsLoop ? (
        <video
          ref={setVideo}
          src={media.source}
          poster={media.poster}
          width={media.aspectRatio.width}
          height={media.aspectRatio.height}
          aria-label={decorative ? undefined : media.alt}
          aria-hidden={decorative || undefined}
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="none"
          onError={() => setFailed(true)}
        />
      ) : failed || !previewSource ? (
        <span className="portfolio-project-image__fallback" aria-hidden={decorative || undefined}>
          {project.title}
        </span>
      ) : (
        <img
          src={smallImage?.source ?? previewSource}
          width={smallImage?.width ?? media.aspectRatio.width}
          height={smallImage?.height ?? media.aspectRatio.height}
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
