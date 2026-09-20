import pageCopy from '../../content/site/OverviewPage.json';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/portfolioData';
import { OverviewAbout } from '../components/OverviewAbout';
import { ServicesReceipts } from '../components/ServicesReceipts';
import { WorkArchive } from '../work/WorkArchive';
import { RecentWriting } from '../components/WritingIndex';
import { usePortfolioSound } from '../providers/SoundProvider';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function OverviewPage() {
  const sound = usePortfolioSound();
  const reducedMotion = usePrefersReducedMotion();
  return (
    <main id="portfolio-main" className="portfolio-overview">
      <section
        id="overview"
        className="portfolio-content-shell portfolio-hero"
        data-portfolio-section="overview"
        aria-labelledby="portfolio-hero-heading"
      >
        <div className="portfolio-hero__statement">
          <h1 id="portfolio-hero-heading">
            <span><strong className="portfolio-hero__name">{profile.name}<span className="portfolio-hero__name-ink" aria-hidden="true">{profile.name}</span></strong>{pageCopy["is_a_product_engineer_in_texas"]}</span>
          </h1>

          <div className="portfolio-hero__copy">
            <p>{pageCopy["explore_my"]}{' '}
              <Link className="portfolio-hero__text-link" data-destination="/Work →" to="/#work">{pageCopy["projects"]}</Link>{pageCopy["see_my_code_on"]}{' '}
              <a className="portfolio-hero__text-link" data-destination="GitHub.com/tec94 ↗" href={pageCopy["https_github_com_tec94"]} target="_blank" rel="noreferrer">{pageCopy["github"]}</a>{pageCopy["connect_on"]}{' '}
              <a className="portfolio-hero__text-link" data-destination="LinkedIn ↗" href={pageCopy["https_www_linkedin_com_in_khiet_cao_95b545393"]} target="_blank" rel="noreferrer">{pageCopy["linkedin"]}</a>{pageCopy["or_read_my"]}{' '}
              <a className="portfolio-hero__text-link" data-destination="Read resume ↗" href={profile.resumeUrl} target="_blank" rel="noreferrer">{pageCopy["resume"]}</a>
              .
            </p>
          </div>
          <div className="portfolio-hero__actions">
            <a className="portfolio-stamp" href={`mailto:${profile.email}`}>
              {pageCopy["email_me"]}
              <span className="portfolio-stamp__clip" data-direction="external" aria-hidden="true"><span><ArrowUpRight /><ArrowUpRight /></span></span>
            </a>
            <a className="portfolio-stamp portfolio-stamp--outline" href={profile.calUrl} target="_blank" rel="noreferrer">{pageCopy["book_a_15_minute_call"]}</a>
          </div>
        </div>

        <Link
          className="portfolio-hero__scroll-cue"
          to="/#work"
        >
          <span>{pageCopy["work"]}</span>
          <span aria-hidden="true">↓</span>
        </Link>
      </section>

      <WorkArchive />

      <ServicesReceipts />

      <OverviewAbout />

      <RecentWriting />

      <button
        type="button"
        className="portfolio-content-shell portfolio-page-top"
        onClick={() => {
          sound.play('navigation');
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
      >{pageCopy["back_to_top"]}<span aria-hidden="true">↑</span>
      </button>
    </main>
  );
}
