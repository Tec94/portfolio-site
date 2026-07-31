import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Github } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { projects, type ProjectCategory } from '../../data/portfolioData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import ProjectGlyph from './ProjectGlyph';
import ScrollProjectDevice from './ScrollProjectDevice';
import { parseProjectView } from './projectViewState';

gsap.registerPlugin(ScrollTrigger);

const categories: Array<'All work' | ProjectCategory> = [
  'All work',
  'Web Apps',
  'Dashboards',
  'Marketing Sites',
  'Experiments',
  'Client Work',
];

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<(typeof categories)[number]>('All work');
  const initialProject = parseProjectView(searchParams).project;
  const [activeProjectId, setActiveProjectId] = useState(initialProject.id);
  const archiveRef = useRef<HTMLDivElement>(null);
  const projectStackRef = useRef<HTMLElement>(null);
  const projectRefs = useRef(new Map<string, HTMLElement>());
  const reducedMotion = usePrefersReducedMotion();

  const filtered = useMemo(
    () =>
      category === 'All work'
        ? projects
        : projects.filter((project) => project.category === category),
    [category],
  );

  const activeIndex = Math.max(
    0,
    filtered.findIndex((project) => project.id === activeProjectId),
  );
  const activeProject = filtered[activeIndex] ?? filtered[0];
  const filterKey = filtered.map((project) => project.id).join(':');

  const selectProject = useCallback(
    (projectId: string, updateUrl = true) => {
      setActiveProjectId(projectId);
      if (updateUrl) {
        setSearchParams({ project: projectId }, { replace: true });
      }
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (!filtered.some((project) => project.id === activeProjectId) && filtered[0]) {
      selectProject(filtered[0].id);
    }
  }, [activeProjectId, filtered, selectProject]);

  useGSAP(
    () => {
      const triggers = filtered.flatMap((project) => {
        const article = projectRefs.current.get(project.id);
        if (!article) return [];

        const activeTrigger = ScrollTrigger.create({
          trigger: article,
          start: 'top center',
          end: 'bottom center',
          onToggle: ({ isActive }) => {
            if (isActive) selectProject(project.id);
          },
        });
        return [activeTrigger];
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    {
      scope: archiveRef,
      dependencies: [filterKey, reducedMotion],
      revertOnUpdate: true,
    },
  );

  const scrollToProject = (index: number) => {
    const project = filtered[index];
    const article = projectRefs.current.get(project.id);
    selectProject(project.id);
    article?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <div ref={archiveRef} className="v2-page v2-projects-page">
      <div className="v2-gallery-tools" aria-label="Project archive controls">
        <div className="v2-gallery-title">
          <span className="v2-eyebrow">Project archive</span>
          <h1>Selected work</h1>
          <span aria-hidden="true">/ {filtered.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="v2-filter-list" role="group" aria-label="Filter projects">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'is-active' : undefined}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="v2-project-archive">
        <section
          ref={projectStackRef}
          className="v2-project-stack"
          aria-label={`${category} projects`}
        >
          {filtered.map((project, index) => (
            <article
              id={`project-${project.id}`}
              className="v2-project-card"
              key={project.id}
              ref={(node) => {
                if (node) projectRefs.current.set(project.id, node);
                else projectRefs.current.delete(project.id);
              }}
              data-active={project.id === activeProject?.id}
            >
              <div className="v2-project-copy">
                <div className="v2-project-heading">
                  <span
                    className="v2-glyph-box"
                    style={{ '--project-accent': project.accent } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    <ProjectGlyph name={project.glyph} />
                  </span>
                  <div>
                    <span className="v2-project-index">
                      {project.index} / {project.category}
                    </span>
                    <h2>{project.title}</h2>
                  </div>
                </div>
                <p className="v2-project-tagline">{project.tagline}</p>
                <p>{project.description}</p>
                <ul className="v2-project-tech" aria-label={`${project.title} technologies`}>
                  {project.tech.slice(0, 4).map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <div className="v2-project-actions">
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    View live project <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  {project.sourceUrl ? (
                    <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                      Source <Github size={16} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>

              <a
                className="v2-project-preview"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the live ${project.title} project`}
              >
                <img
                  src={project.images[0]}
                  alt={`${project.title} interface preview`}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
                <span className="v2-project-preview-index" aria-hidden="true">
                  {project.index}
                </span>
              </a>
            </article>
          ))}
        </section>

        <ScrollProjectDevice
          activeIndex={activeIndex}
          projects={filtered}
          onProjectSelect={scrollToProject}
          scrollTrackRef={projectStackRef}
        />
      </div>
    </div>
  );
}
