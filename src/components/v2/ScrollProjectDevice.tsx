import { useRef, useState, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Project } from '../../data/portfolioData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { PreviewRail, type PreviewRailItem } from './PreviewRail';

interface ScrollProjectDeviceProps {
  activeIndex: number;
  projects: Project[];
  onProjectSelect: (index: number) => void;
  scrollTrackRef: RefObject<HTMLElement>;
}

export default function ScrollProjectDevice({
  activeIndex,
  projects,
  onProjectSelect,
  scrollTrackRef,
}: ScrollProjectDeviceProps) {
  const deviceRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [videoDuration, setVideoDuration] = useState(0);
  const activeProject = projects[activeIndex] ?? projects[0];
  const previewRailItems: PreviewRailItem[] = projects.map((project) => ({
    id: project.id,
    label: `Scroll to project ${project.index}: ${project.title}`,
    href: `#project-${project.id}`,
    preview: (
      <span
        className="v2-project-rail-card"
        style={{ '--project-accent': project.accent } as React.CSSProperties}
      >
        <img src={project.images[0]} alt="" />
        <span>
          <strong>{project.title}</strong>
          <small>
            {project.index} / {project.category}
          </small>
        </span>
      </span>
    ),
  }));

  useGSAP(
    () => {
      const video = videoRef.current;
      const scrollTrack = scrollTrackRef.current;
      if (!video || !scrollTrack || videoDuration <= 0) {
        return;
      }

      video.pause();
      if (reducedMotion) {
        video.currentTime = 0;
        return;
      }

      const timelineEnd = Math.max(0, videoDuration - 0.05);
      const scrub = gsap.fromTo(
        video,
        { currentTime: 0 },
        {
          currentTime: timelineEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: scrollTrack,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => scrub.kill();
    },
    {
      scope: deviceRef,
      dependencies: [reducedMotion, scrollTrackRef, videoDuration],
      revertOnUpdate: true,
    },
  );

  const handleVideoMetadata = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.pause();
    video.currentTime = 0;
    setVideoDuration(video.duration);
  };

  return (
    <aside className="v2-project-device-rail" aria-label="Project scroll position">
      <p className="sr-only" aria-live="polite">
        Project {activeIndex + 1} of {projects.length}: {activeProject.title}
      </p>

      <div className="v2-project-progress">
        <span aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')}</span>
        <PreviewRail
          items={previewRailItems}
          activeId={activeProject.id}
          ariaCurrent="step"
          ariaLabel="Project gallery"
          onItemSelect={(id) => {
            const index = projects.findIndex((project) => project.id === id);
            if (index >= 0) onProjectSelect(index);
          }}
          className="v2-project-preview-rail"
        />
        <span aria-hidden="true">{String(projects.length).padStart(2, '0')}</span>
      </div>

      <div
        ref={deviceRef}
        className={`v2-scroll-watch ${videoDuration > 0 ? 'is-ready' : ''}`}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          className="v2-scroll-watch-video"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={handleVideoMetadata}
        >
          <source
            src="/assets/project-device/reference-alpha.webm"
            type="video/webm; codecs=vp9"
          />
          <source src="/assets/project-device/reference.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="v2-project-device-caption" aria-hidden="true">
        <span>Scroll</span>
        <i />
        <span>{activeProject.title}</span>
      </div>
    </aside>
  );
}
