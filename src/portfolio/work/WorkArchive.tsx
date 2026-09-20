import pageCopy from '../../content/site/WorkArchive.json';
import { useMemo, useState, type MouseEvent, type PointerEvent } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, Github, Grid2X2, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { previewProjectManifest } from '../content/manifest';
import { usePortfolioSound } from '../providers/SoundProvider';
import { transitionPortfolioPage } from '../motion';
import { ProjectImage } from './ProjectMedia';
import {
  filterPreviewProjects,
  formatProjectDate,
  prepareProjectTransition,
  workFilters,
  type WorkFilter,
} from './projectPresentation';

type ArchiveView = 'list' | 'showcase';

export function WorkArchive({ standalone = false }: { standalone?: boolean }) {
  const [view, setView] = useState<ArchiveView>('list');
  const [filter, setFilter] = useState<WorkFilter>('all');
  const [hoverView, setHoverView] = useState<ArchiveView | null>(null);
  const navigate = useNavigate();
  const sound = usePortfolioSound();
  const projects = useMemo(
    () => {
      const latestYear = Math.max(...previewProjectManifest.flatMap((project) => project.year ? [project.year] : []));
      return filterPreviewProjects(previewProjectManifest, filter).slice().sort(
        (a, b) => (b.year ?? latestYear) - (a.year ?? latestYear),
      );
    },
    [filter],
  );
  const projectGroups = [...new Set(projects.map((project) => project.year))].map((year) => ({
    label: year ? String(year) : 'More work',
    projects: projects.filter((project) => project.year === year),
  }));
  const highlightedView = hoverView ?? view;
  const moveViewKnob = (next: ArchiveView | null) => {
    setHoverView(next);
  };

  const previewSound = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') sound.playProjectPreview();
  };

  const openProject = (
    event: MouseEvent<HTMLElement>,
    href: string,
    slug: string,
  ) => {
    prepareProjectTransition(event.currentTarget, slug);
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
    transitionPortfolioPage(() => setView(next));
    sound.play('press');
  };

  const changeFilter = (next: WorkFilter) => {
    if (next === filter) return;
    transitionPortfolioPage(() => setFilter(next));
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
              <h1 id="work-page-heading">{pageCopy["work"]}</h1>
            ) : (
              <h2 id="work-archive-heading">{pageCopy["work_"]}</h2>
            )}
          </div>
          <div className="portfolio-work-archive__controls">
            <div className="portfolio-view-switch" aria-label="Project view" data-view={highlightedView}
              onPointerLeave={() => moveViewKnob(null)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) moveViewKnob(null); }}>
              <span className="portfolio-view-switch__knob" aria-hidden="true" />
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === 'list'}
                data-tooltip="List"
                onClick={() => changeView('list')}
                onPointerEnter={(event) => { if (event.pointerType === 'mouse') moveViewKnob('list'); }}
                onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) moveViewKnob('list'); }}
              >
                <List aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Showcase view"
                aria-pressed={view === 'showcase'}
                data-tooltip="Showcase"
                onClick={() => changeView('showcase')}
                onPointerEnter={(event) => { if (event.pointerType === 'mouse') moveViewKnob('showcase'); }}
                onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) moveViewKnob('showcase'); }}
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
              aria-label={item.label}
              onClick={() => changeFilter(item.id)}
            >
              <span>{item.label}</span>
              <span className="portfolio-work-filter-count" aria-hidden="true">{String(filterPreviewProjects(previewProjectManifest, item.id).length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`portfolio-work-results is-${view}`}>
          {view === 'list' ? (
            <div className="portfolio-work-list">
              {projectGroups.map((group) => (
                <div className="portfolio-work-group" key={group.label}>
                  <div className="portfolio-ledger-heading portfolio-work-year"><span>{group.label}</span><span aria-hidden="true" /><span>{String(group.projects.length).padStart(2, '0')}</span></div>
                  {group.projects.map((project) => (
                    <Link
                      key={project.slug}
                      to={project.href}
                      viewTransition
                      className="portfolio-work-row"
                      onPointerEnter={previewSound}
                      onClick={(event) => openProject(event, project.href, project.slug)}
                    >
                      <ProjectImage className="portfolio-work-row__frame" project={project} transition />
                      <span className="portfolio-work-row__copy">
                        <strong data-project-transition="title">{project.title}</strong>
                        <span title={project.role ?? project.summary}>{project.role ?? project.summary}</span>
                      </span>
                      <span className="portfolio-work-row__meta">
                        {project.completedAt ? <time dateTime={project.completedAt}>{formatProjectDate(project.completedAt)}</time> : null}
                        <span title={project.categories.join(' · ')}>{project.categories.find((category) => category === 'Hackathon' || category === 'Product site') ?? project.categories[0]}</span>
                      </span>
                      <span className="portfolio-work-row__arrow" aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="portfolio-work-showcase">
              {projects.map((project, index) => (
                <article className="portfolio-showcase-card" key={project.slug}>
                  <Link
                    to={project.href}
                    viewTransition
                    className="portfolio-showcase-card__media-link"
                    onPointerEnter={previewSound}
                    onClick={(event) => openProject(event, project.href, project.slug)}
                  >
                    <span className="portfolio-preview-address" aria-hidden="true">
                      <span className="portfolio-preview-lights"><span /><span /><span /></span>
                      <span>{project.links.live ? new URL(project.links.live).host : project.href}</span>
                      <span>16 : 10</span>
                    </span>
                    <ProjectImage
                      project={project}
                      className="portfolio-showcase-card__media"
                      transition
                    />
                  </Link>
                  <div className="portfolio-showcase-card__footer">
                    <div>
                      <p className="portfolio-showcase-card__eyebrow">{String(index + 1).padStart(2, '0')} / {project.completedAt ? `${formatProjectDate(project.completedAt)} · ` : ''}{project.categories.join(' · ')}</p>
                      <Link
                        to={project.href}
                        viewTransition
                        onClick={(event) => openProject(event, project.href, project.slug)}
                        data-project-transition="title"
                      >
                        {project.title}
                      </Link>
                      <p className="portfolio-showcase-card__description">{project.role ?? project.summary}</p>
                    </div>
                    <div className="portfolio-showcase-card__actions">
                      {project.links.repository ? (
                        <a
                          href={project.links.repository}
                          target="_blank"
                          rel="noreferrer"
                          className="portfolio-stamp portfolio-stamp--outline"
                          aria-label={`Open ${project.title} GitHub repository`}
                        >
                          <Github aria-hidden="true" /><span>Code</span>
                        </a>
                      ) : null}
                      {project.links.live ? (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className="portfolio-stamp"
                          aria-label={`Open ${project.title} live site`}
                        >
                          <span>Live</span><span className="portfolio-stamp__clip" data-direction="external" aria-hidden="true"><span><ArrowUpRight /><ArrowUpRight /></span></span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {projects.length === 0 && <p className="portfolio-work-empty" role="status">No projects in this category yet.</p>}
      </div>
    </section>
  );
}
