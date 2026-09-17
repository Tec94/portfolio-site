import pageCopy from '../../content/site/LabPage.json';
import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowUpRight, Beaker, CircleDollarSign, Home, Landmark, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import watchCore from '../../assets/watch/omniverse_watch_core.png';
import watchCover from '../../assets/watch/omniverse_watch_cover.png';
import watchFrame from '../../assets/watch/omniverse_watch_frame.png';
import watchRim from '../../assets/watch/omniverse_watch_rim.png';
import { experiences } from '../../data/portfolioData';
import { portfolioManifest } from '../content/manifest';

const PocketViewfinder = lazy(() => import('../components/PocketViewfinder'));
const glyphs = [CircleDollarSign, Landmark, Home, Beaker, Sparkles];

export function LabPage() {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const navigate = useNavigate();
  const options = useMemo(
    () => portfolioManifest.projects.map((project, index) => ({ project, Icon: glyphs[index % glyphs.length] })),
    [],
  );

  return (
    <main id="portfolio-main" className="portfolio-route-page portfolio-lab-page">
      <header className="portfolio-route-header">
        <p className="portfolio-kicker">{pageCopy["lab"]}</p>
        <h1>{pageCopy["small_systems_with_room_to_misbehave"]}</h1>
      </header>

      <Suspense fallback={<div className="portfolio-lab-loading" role="status">{pageCopy["loading_viewfinder"]}</div>}>
        <PocketViewfinder />
      </Suspense>

      <section className="portfolio-lab-experiment" aria-labelledby="omnitrix-heading">
        <div>
          <span>{pageCopy["experiment_02"]}</span>
          <h2 id="omnitrix-heading">{pageCopy["omnitrix_project_launcher"]}</h2>
          <p>{pageCopy["the_project_selector_from_the_archived_portfolio_now_kept_as_an_on_demand_lab_object"]}</p>
        </div>
        <div className="portfolio-lab-omnitrix" data-open={launcherOpen || undefined}>
          <div className="portfolio-lab-omnitrix__menu" aria-hidden={!launcherOpen}>
            {options.map(({ project, Icon }, index) => (
              <button
                key={project.slug}
                type="button"
                style={{ '--project-slot': index } as React.CSSProperties}
                tabIndex={launcherOpen ? 0 : -1}
                onClick={() => navigate(project.href)}
              >
                <Icon aria-hidden="true" />
                <span>{project.title}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="portfolio-lab-omnitrix__watch"
            aria-label={launcherOpen ? 'Close project launcher' : 'Open project launcher'}
            aria-expanded={launcherOpen}
            onClick={() => setLauncherOpen((current) => !current)}
          >
            <img src={watchFrame} alt="" />
            <img src={watchRim} alt="" />
            <img src={watchCore} alt="" />
            <img src={watchCover} alt="" />
          </button>
        </div>
      </section>

      <section className="portfolio-lab-stats" aria-label="Curated portfolio snapshots">
        <article><strong>{portfolioManifest.projects.length}</strong><span>{pageCopy["audited_projects"]}</span></article>
        <article><strong>{experiences.length}</strong><span>{pageCopy["internship_chapters"]}</span></article>
        <article><strong>{portfolioManifest.articles.length}</strong><span>{pageCopy["published_notes"]}</span></article>
      </section>

      <a className="portfolio-lab-archive" href={pageCopy["v2"]}>{pageCopy["open_the_archived_v2_experience"]}<ArrowUpRight aria-hidden="true" /></a>
    </main>
  );
}
