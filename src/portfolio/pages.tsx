import pageCopy from '../content/site/pages.json';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Compass, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SystemPage } from '../components/SystemPage';
import { ContentNavigation } from './components/ContentNavigation';
import { MediaViewer } from './components/MediaViewer';
import {
  getPreviewProject,
  getPublishedArticle,
  getPublishedProject,
  portfolioManifest,
} from './content/manifest';
import { ProjectImage } from './work/ProjectMedia';
import { formatProjectDate, projectTransitionStyle } from './work/projectPresentation';
import { getLandingSectionUrl } from './routeOwnership';

export function ProjectBoundaryPage() {
  const { slug = '' } = useParams();
  const project = getPublishedProject(slug);
  const previewProject = getPreviewProject(slug);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!project && !previewProject) return <MissingContentPage label={pageCopy["project"]} />;

  if (!project && previewProject) {
    return (
      <main id="portfolio-main" className="portfolio-page portfolio-project-preview">
        <article>
          <header className="portfolio-project-preview__header">
            {previewProject.completedAt ? <time dateTime={previewProject.completedAt}>{formatProjectDate(previewProject.completedAt)}</time> : null}
            <h1 style={projectTransitionStyle(previewProject.slug, 'title')}>
              {previewProject.title}
            </h1>
            {previewProject.role ? <p>{previewProject.role}</p> : null}
          </header>
          <ProjectImage project={previewProject} className="portfolio-project-preview__media" transition activeTransition />
          <p className="portfolio-project-preview__state">{pageCopy["case_study_in_review"]}</p>
        </article>
      </main>
    );
  }

  const current = project!;
  const Content = current.Content;
  const currentIndex = portfolioManifest.projects.findIndex((entry) => entry.slug === current.slug);
  const nextProject = portfolioManifest.projects[(currentIndex + 1) % portfolioManifest.projects.length];

  return (
    <main id="portfolio-main" className="portfolio-case-study">
      <article>
        <Link className="portfolio-text-link portfolio-case-study__back" to={getLandingSectionUrl('work')}><ArrowLeft aria-hidden="true" />{pageCopy["work_index"]}</Link>
        <aside className="portfolio-case-study__sidebar" aria-label="Project details">
          {current.completedAt || current.role || current.duration || current.technologies.length ? <dl className="portfolio-case-study__facts">
            {current.completedAt ? <div><dt>Shipped</dt><dd><time dateTime={current.completedAt}>{formatProjectDate(current.completedAt)}</time></dd></div> : null}
            {current.role ? <div><dt>{pageCopy["role"]}</dt><dd>{current.role}</dd></div> : null}
            {current.duration ? <div><dt>{pageCopy["duration"]}</dt><dd>{current.duration}</dd></div> : null}
            {current.technologies.length ? <div><dt>{pageCopy["stack"]}</dt><dd>{current.technologies.join(', ')}</dd></div> : null}
          </dl> : null}
          {Object.values(current.links).some(Boolean) ? <div className="portfolio-case-study__actions" aria-label="Project links">
              {current.links.live ? <a href={current.links.live} target="_blank" rel="noreferrer">{pageCopy["live_site"]}<ArrowUpRight aria-hidden="true" /></a> : null}
              {current.links.repository ? <a href={current.links.repository} target="_blank" rel="noreferrer">{pageCopy["repository"]}<Github aria-hidden="true" /></a> : null}
              {current.links.devpost ? <a href={current.links.devpost} target="_blank" rel="noreferrer">{pageCopy["devpost"]}<ArrowUpRight aria-hidden="true" /></a> : null}
            </div> : null}

          {current.bodyText ? <ContentNavigation headings={current.headings} /> : null}
        </aside>
        <div className="portfolio-case-study__main">
          <header className="portfolio-case-study__hero">
            <h1 style={projectTransitionStyle(current.slug, 'title')}>{current.title}</h1>
            {current.summary ? <p className="portfolio-case-study__summary">{current.summary}</p> : null}
          </header>
          <button className="portfolio-case-study__media-trigger" type="button" onClick={() => { setViewerIndex(0); setViewerOpen(true); }} aria-label={`Open ${current.title} media viewer`}>
            <ProjectImage project={current} className="portfolio-project-preview__media" transition activeTransition />
            <span>{current.media[0].type === 'video' ? 'Watch demo' : 'Open media'}</span>
          </button>

          {current.bodyText ? <div className="portfolio-mdx portfolio-case-study__content"><Content components={{
            ProjectDetails: () => (
              <div className="portfolio-case-study__gallery">
                {current.media.filter((media) => media.type === 'image' && media.narrativeRole === 'detail').map((media) => (
                  <figure key={media.source}>
                    <button type="button" onClick={() => { setViewerIndex(current.media.indexOf(media)); setViewerOpen(true); }} aria-label={`Open media viewer: ${media.alt}`}>
                      <img src={media.source} alt={media.alt} loading="lazy" />
                    </button>
                    <figcaption>{media.alt}</figcaption>
                  </figure>
                ))}
              </div>
            ),
          }} /></div> : null}
          {nextProject && nextProject.slug !== current.slug ? (
            <footer className="portfolio-next-project">
              <Link to={nextProject.href} viewTransition>
                <span className="portfolio-next-project__copy"><span>{pageCopy["next_project"]}</span><strong>{nextProject.title} <ArrowUpRight aria-hidden="true" /></strong></span>
                <ProjectImage project={nextProject} className="portfolio-next-project__image" decorative />
              </Link>
            </footer>
          ) : null}
        </div>
      </article>

      <MediaViewer media={current.media} projectTitle={current.title} open={viewerOpen} initialIndex={viewerIndex} onClose={() => setViewerOpen(false)} />
    </main>
  );
}

export function ArticleBoundaryPage() {
  const { slug = '' } = useParams();
  const article = getPublishedArticle(slug);
  if (!article) return <MissingContentPage label={pageCopy["article"]} />;
  const Content = article.Content;

  return (
    <main id="portfolio-main" className="portfolio-article-page">
      <article>
        <header className="portfolio-article-page__header">
          <Link className="portfolio-text-link" to="/writing"><ArrowLeft aria-hidden="true" />{pageCopy["writing"]}</Link>
          <time dateTime={article.publicationDate}>{new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(`${article.publicationDate}T12:00:00`))}</time>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
        </header>
        <div className="portfolio-case-study__body">
          <ContentNavigation headings={article.headings} />
          <div className="portfolio-mdx portfolio-case-study__content"><Content /></div>
        </div>
      </article>
    </main>
  );
}

export function MissingContentPage({ label = 'page' }: { label?: string }) {
  return (
    <SystemPage
      mainId="portfolio-main"
      eyebrow="404 / Content not found"
      title={`This ${label} is unavailable.`}
      description="The address may be outdated, or this content is not published."
      icon={<Compass />}
      actions={(
        <Link to={getLandingSectionUrl('work')}>{pageCopy["work_archive"]}<ArrowUpRight aria-hidden="true" />
        </Link>
      )}
    />
  );
}
