import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Github } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { projects, type Project, type ProjectCategory } from '../../data/portfolioData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import ProjectGlyph from './ProjectGlyph';
import { useProjectGallery } from './ProjectGalleryContext';
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

function ProjectPreviewContent({ project, eager }: { project: Project; eager: boolean }) {
  return (
    <>
      <img
        src={project.images[0]}
        alt={`${project.title} interface preview`}
        loading={eager ? 'eager' : 'lazy'}
      />
      <span className="v2-project-preview-index" aria-hidden="true">
        {project.index}
      </span>
    </>
  );
}

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<(typeof categories)[number]>('All work');
  const initialProject = parseProjectView(searchParams).project;
  const [activeProjectId, setActiveProjectId] = useState(initialProject.id);
  const archiveRef = useRef<HTMLDivElement>(null);
  const projectStackRef = useRef<HTMLElement>(null);
  const [projectRefs] = useState(() => new Map<string, HTMLElement>());
  const activePreviewRef = useRef<HTMLElement | null>(null);
  const pendingScrollProjectRef = useRef<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { selectedId, setSelectedId, setBridge } = useProjectGallery();

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
      setSelectedId(projectId);
      if (updateUrl) {
        setSearchParams({ project: projectId }, { replace: true });
      }
    },
    [setSearchParams, setSelectedId],
  );

  useEffect(() => {
    if (filtered.some((project) => project.id === selectedId) && selectedId !== activeProjectId) {
      setActiveProjectId(selectedId);
    }
  }, [activeProjectId, filtered, selectedId]);

  useEffect(() => {
    if (!filtered.some((project) => project.id === activeProjectId) && filtered[0]) {
      selectProject(filtered[0].id);
    }
  }, [activeProjectId, filtered, selectProject]);

  useGSAP(
    () => {
      const triggers = filtered.flatMap((project) => {
        const article = projectRefs.get(project.id);
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

  const scrollToProject = useCallback((projectId: string) => {
    const project = filtered.find((item) => item.id === projectId);
    if (!project) {
      pendingScrollProjectRef.current = projectId;
      setCategory('All work');
      return;
    }
    const article = projectRefs.get(project.id);
    selectProject(project.id);
    article?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [filtered, projectRefs, reducedMotion, selectProject]);

  useEffect(() => {
    const pendingProjectId = pendingScrollProjectRef.current;
    if (!pendingProjectId || !filtered.some((project) => project.id === pendingProjectId)) return;

    pendingScrollProjectRef.current = null;
    const frame = window.requestAnimationFrame(() => scrollToProject(pendingProjectId));
    return () => window.cancelAnimationFrame(frame);
  }, [filtered, scrollToProject]);

  useEffect(() => {
    const nextBridge = {
      previewRef: activePreviewRef,
      onPreviewChange: scrollToProject,
    };
    setBridge(nextBridge);
  }, [scrollToProject, setBridge]);

  useEffect(
    () => () => {
      setBridge((current) => (current?.previewRef === activePreviewRef ? null : current));
    },
    [setBridge],
  );

  return (
    <div ref={archiveRef} className="v2-page v2-projects-page">
      <div className="v2-gallery-tools" aria-label="Project archive controls">
        <div className="v2-gallery-title">
          <span className="v2-eyebrow">Project archive</span>
          <h1>Projects</h1>
          <span aria-hidden="true">/ {filtered.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="v2-filter-list" role="group" aria-label="Filter projects">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
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
          {filtered.map((project, index) => {
            const isActive = project.id === activeProject?.id;
            const setActivePreview = (node: HTMLElement | null) => {
              if (isActive) activePreviewRef.current = node;
              else if (activePreviewRef.current === node) activePreviewRef.current = null;
            };

            return (
              <article
              id={`project-${project.id}`}
              className="v2-project-card"
              key={project.id}
              ref={(node) => {
                if (node) projectRefs.set(project.id, node);
                else projectRefs.delete(project.id);
              }}
              data-active={isActive}
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
                ref={setActivePreview}
                className="v2-project-preview"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the live ${project.title} project`}
              >
                <ProjectPreviewContent project={project} eager={index < 2} />
              </a>
            </article>
            );
          })}
        </section>

      </div>
    </div>
  );
}
