import { useMemo, useState, type MouseEvent, type PointerEvent } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Globe2, Grid2X2, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { previewProjectManifest } from '../content/manifest';
import { usePortfolioSound } from '../providers/SoundProvider';
import { MediaStack, ProjectImage } from './ProjectMedia';
import {
  filterPreviewProjects,
  formatProjectDate,
  prepareProjectTransition,
  workFilters,
  type WorkFilter,
} from './projectPresentation';

type ArchiveView = 'list' | 'showcase';
const viewTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

export function WorkArchive({ standalone = false }: { standalone?: boolean }) {
  const [view, setView] = useState<ArchiveView>('list');
  const [filter, setFilter] = useState<WorkFilter>('all');
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const sound = usePortfolioSound();
  const projects = useMemo(
    () => filterPreviewProjects(previewProjectManifest, filter),
    [filter],
  );
  const visibleProjects = expanded ? projects : projects.slice(0, 3);
  const hiddenCount = projects.length - visibleProjects.length;

  const previewSound = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') sound.playProjectPreview();
  };

  const openProject = (
    event: MouseEvent<HTMLElement>,
    href: string,
    slug: string,
  ) => {
    prepareProjectTransition(event.currentTarget, slug);
    sound.playPageOpen();
    const isPlainPrimaryClick = (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );
    if (!isPlainPrimaryClick || typeof document.startViewTransition !== 'function') return;

    event.preventDefault();
    document.startViewTransition(() => {
      flushSync(() => navigate(href));
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };

  const changeView = (next: ArchiveView) => {
    if (next === view) return;
    setView(next);
    sound.play('toggle');
  };

  const changeFilter = (next: WorkFilter) => {
    if (next === filter) return;
    setFilter(next);
    setExpanded(false);
    sound.play('press');
  };

  return (
    <section
      id="work"
      className={`portfolio-content-shell portfolio-split-layout portfolio-work-archive${standalone ? ' is-standalone' : ''}`}
      data-portfolio-section="work"
      aria-labelledby={standalone ? 'work-page-heading' : 'work-archive-heading'}
    >
      <div className="portfolio-work-archive__sticky">
        <header className="portfolio-work-archive__header">
          <div>
            {standalone ? (
              <h1 id="work-page-heading">Work</h1>
            ) : (
              <h2 id="work-archive-heading">Work</h2>
            )}
          </div>
          <div className="portfolio-work-archive__controls">
            <div className="portfolio-view-switch" aria-label="Project view">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === 'list'}
                data-tooltip="List"
                onClick={() => changeView('list')}
              >
                <List aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Showcase view"
                aria-pressed={view === 'showcase'}
                data-tooltip="Showcase"
                onClick={() => changeView('showcase')}
              >
                <Grid2X2 aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <div className="portfolio-work-filters" aria-label="Filter work">
          {workFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => changeFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={`${view}-${filter}`}
          className={`portfolio-work-results is-${view}`}
          initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
          animate={{
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            transitionEnd: { clipPath: 'none' },
          }}
          exit={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
          transition={viewTransition}
        >
          {view === 'list' ? (
            <div className="portfolio-work-list">
              <AnimatePresence initial={false}>
                {visibleProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={viewTransition}
                    className="portfolio-work-list__item"
                  >
                    <Link
                      to={project.href}
                      viewTransition
                      className="portfolio-work-row"
                      onPointerEnter={previewSound}
                      onClick={(event) => openProject(event, project.href, project.slug)}
                    >
                      <MediaStack project={project} transition />
                      <strong data-project-transition="title">
                        {project.title}
                      </strong>
                      {project.completedAt ? <time dateTime={project.completedAt}>{formatProjectDate(project.completedAt)}</time> : null}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

              {hiddenCount > 0 ? (
                <button
                  type="button"
                  className="portfolio-more-row"
                  onPointerEnter={previewSound}
                  onClick={() => {
                    setExpanded(true);
                    sound.play('expansion');
                  }}
                  aria-label={`Show ${hiddenCount} more project${hiddenCount === 1 ? '' : 's'}`}
                >
                  <MediaStack project={projects[visibleProjects.length]} />
                  <span>More</span>
                  <span className="portfolio-more-row__arrow" aria-hidden="true">›</span>
                </button>
              ) : null}
            </div>
          ) : (
            <div className="portfolio-work-showcase">
              {projects.map((project) => (
                <article className="portfolio-showcase-card" key={project.slug}>
                  <Link
                    to={project.href}
                    viewTransition
                    className="portfolio-showcase-card__media-link"
                    onPointerEnter={previewSound}
                    onClick={(event) => openProject(event, project.href, project.slug)}
                  >
                    <ProjectImage
                      project={project}
                      className="portfolio-showcase-card__media"
                      transition
                    />
                  </Link>
                  <div className="portfolio-showcase-card__footer">
                    <div>
                      <Link
                        to={project.href}
                        viewTransition
                        onClick={(event) => openProject(event, project.href, project.slug)}
                        data-project-transition="title"
                      >
                        {project.title}
                      </Link>
                      {project.role ? <span>{project.role}</span> : null}
                    </div>
                    {project.completedAt ? <time dateTime={project.completedAt}>{formatProjectDate(project.completedAt)}</time> : null}
                    <div className="portfolio-showcase-card__actions">
                      {project.links.live ? (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className="is-live"
                          aria-label={`Open ${project.title} live site`}
                        >
                          <Globe2 aria-hidden="true" />
                        </a>
                      ) : null}
                      {project.links.repository ? (
                        <a
                          href={project.links.repository}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${project.title} GitHub repository`}
                        >
                          <Github aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
