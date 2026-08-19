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

  if (!project && !previewProject) return <MissingContentPage label="project" />;

  if (!project && previewProject) {
    return (
      <main id="portfolio-main" className="portfolio-page portfolio-project-preview">
        <article>
          <header className="portfolio-project-preview__header">
            <time dateTime={previewProject.completedAt}>{formatProjectDate(previewProject.completedAt)}</time>
            <h1 style={projectTransitionStyle(previewProject.slug, 'title')}>
              {previewProject.title}
            </h1>
            <p>{previewProject.role}</p>
          </header>
          <ProjectImage project={previewProject} className="portfolio-project-preview__media" transition activeTransition />
          <p className="portfolio-project-preview__state">Case study in review.</p>
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
        <header className="portfolio-case-study__hero">
          <Link className="portfolio-text-link" to={getLandingSectionUrl('work')}><ArrowLeft aria-hidden="true" /> Work index</Link>
          <div className="portfolio-case-study__title-row">
            <div>
              <time dateTime={current.completedAt}>{formatProjectDate(current.completedAt)}</time>
              <h1 style={projectTransitionStyle(current.slug, 'title')}>{current.title}</h1>
              <p>{current.summary}</p>
            </div>
            <div className="portfolio-case-study__actions" aria-label="Project links">
              {current.links.live ? <a href={current.links.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight aria-hidden="true" /></a> : null}
              {current.links.repository ? <a href={current.links.repository} target="_blank" rel="noreferrer"><Github aria-hidden="true" /> Repository</a> : null}
              {current.links.devpost ? <a href={current.links.devpost} target="_blank" rel="noreferrer">Devpost <ArrowUpRight aria-hidden="true" /></a> : null}
            </div>
          </div>
          <dl className="portfolio-case-study__facts">
            <div><dt>Role</dt><dd>{current.role}</dd></div>
            <div><dt>Duration</dt><dd>{current.duration}</dd></div>
            <div><dt>Stack</dt><dd>{current.technologies.join(', ')}</dd></div>
          </dl>
          <button className="portfolio-case-study__media-trigger" type="button" onClick={() => setViewerOpen(true)} aria-label={`Open ${current.title} media viewer`}>
            <ProjectImage project={current} className="portfolio-project-preview__media" transition activeTransition />
            <span>Open media</span>
          </button>
        </header>

        <div className="portfolio-case-study__body">
          <ContentNavigation headings={current.headings} />
          <div className="portfolio-mdx portfolio-case-study__content">
            <Content />
          </div>
        </div>

        {nextProject ? (
          <footer className="portfolio-next-project">
            <span>Next project</span>
            <Link to={nextProject.href} viewTransition>
              {nextProject.title} <ArrowUpRight aria-hidden="true" />
            </Link>
          </footer>
        ) : null}
      </article>

      <MediaViewer media={current.media} projectTitle={current.title} open={viewerOpen} onClose={() => setViewerOpen(false)} />
    </main>
  );
}

export function ArticleBoundaryPage() {
  const { slug = '' } = useParams();
  const article = getPublishedArticle(slug);
  if (!article) return <MissingContentPage label="article" />;
  const Content = article.Content;

  return (
    <main id="portfolio-main" className="portfolio-article-page">
      <article>
        <header className="portfolio-article-page__header">
          <Link className="portfolio-text-link" to="/writing"><ArrowLeft aria-hidden="true" /> Writing</Link>
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
        <Link to={getLandingSectionUrl('work')}>
          Work archive <ArrowUpRight aria-hidden="true" />
        </Link>
      )}
    />
  );
}
