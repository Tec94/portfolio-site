import pageCopy from '../../content/site/OverviewPage.json';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/portfolioData';
import { OverviewAbout } from '../components/OverviewAbout';
import { ServicesReceipts } from '../components/ServicesReceipts';
import { WorkArchive } from '../work/WorkArchive';
import { usePortfolioSound } from '../providers/SoundProvider';

export function OverviewPage() {
  const sound = usePortfolioSound();
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
            <span>{profile.name}{pageCopy["is_a_product_engineer_in_texas"]}</span>
          </h1>

          <div className="portfolio-hero__copy">
            <p>{pageCopy["explore_my"]}{' '}
              <Link className="portfolio-hero__text-link" to="/#work">{pageCopy["projects"]}</Link>{pageCopy["see_my_code_on"]}{' '}
              <a className="portfolio-hero__text-link" href={pageCopy["https_github_com_tec94"]} target="_blank" rel="noreferrer">{pageCopy["github"]}</a>{pageCopy["connect_on"]}{' '}
              <a className="portfolio-hero__text-link" href={pageCopy["https_www_linkedin_com_in_khiet_cao_95b545393"]} target="_blank" rel="noreferrer">{pageCopy["linkedin"]}</a>{pageCopy["or_read_my"]}{' '}
              <a className="portfolio-hero__text-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">{pageCopy["resume"]}</a>
              .
            </p>
            <p>{pageCopy["have_something_useful_in_mind"]}{' '}
              <a className="portfolio-hero__text-link" href={`mailto:${profile.email}`}>{pageCopy["email_me"]}</a>
              {' '}{pageCopy["or"]}{' '}
              <a className="portfolio-hero__text-link" href={profile.calUrl} target="_blank" rel="noreferrer">{pageCopy["book_a_15_minute_call"]}</a>
              .
            </p>
          </div>
        </div>

        <Link
          className="portfolio-hero__scroll-cue"
          to="/#work"
          onClick={() => sound.play('navigation')}
        >
          <span>{pageCopy["work"]}</span>
          <span aria-hidden="true">↓</span>
        </Link>
      </section>

      <WorkArchive />

      <ServicesReceipts />

      <OverviewAbout />

      <section id="writing" className="portfolio-content-shell portfolio-split-layout portfolio-overview-section portfolio-writing-teaser" data-portfolio-section="writing">
        <header className="portfolio-section-heading">
          <h2>{pageCopy["writing"]}</h2>
        </header>
        <Link className="portfolio-inline-link" to="/writing">{pageCopy["writing_"]}<ArrowUpRight aria-hidden="true" /></Link>
      </section>

      <button
        type="button"
        className="portfolio-content-shell portfolio-page-top"
        onClick={() => {
          sound.play('arrival');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >{pageCopy["back_to_top"]}<span aria-hidden="true">↑</span>
      </button>
    </main>
  );
}
