import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/portfolioData';
import { OverviewAbout } from '../components/OverviewAbout';
import { ServicesReceipts } from '../components/ServicesReceipts';
import { SelectedWork } from '../work/SelectedWork';
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
            <span>{profile.name} is a product engineer in Texas.</span>
            <strong>He designs the interface, shapes the system, and builds the product.</strong>
          </h1>

          <div className="portfolio-hero__copy">
            <p>
              Explore my{' '}
              <Link className="portfolio-hero__text-link" to="/#work">projects</Link>
              , see my code on{' '}
              <a className="portfolio-hero__text-link" href="https://github.com/Tec94" target="_blank" rel="noreferrer">GitHub</a>
              , connect on{' '}
              <a className="portfolio-hero__text-link" href="https://www.linkedin.com/in/jackcao" target="_blank" rel="noreferrer">LinkedIn</a>
              , or read my{' '}
              <a className="portfolio-hero__text-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">resume</a>
              .
            </p>
            <p>
              Have something useful in mind?{' '}
              <a className="portfolio-hero__text-link" href={`mailto:${profile.email}`}>Email me</a>
              {' '}or{' '}
              <a className="portfolio-hero__text-link" href={profile.calUrl} target="_blank" rel="noreferrer">Book a 15-minute call</a>
              .
            </p>
          </div>
        </div>

        <Link
          className="portfolio-hero__scroll-cue"
          to="/#featured"
          onClick={() => sound.play('navigation')}
        >
          <span>Selected work</span>
          <span aria-hidden="true">↓</span>
        </Link>
      </section>

      <SelectedWork />
      <WorkArchive />

      <ServicesReceipts />

      <OverviewAbout />

      <section id="writing" className="portfolio-content-shell portfolio-split-layout portfolio-overview-section portfolio-writing-teaser" data-portfolio-section="writing">
        <header className="portfolio-section-heading">
          <h2>Writing</h2>
        </header>
        <Link className="portfolio-inline-link" to="/writing">Writing <ArrowUpRight aria-hidden="true" /></Link>
      </section>

      <button
        type="button"
        className="portfolio-content-shell portfolio-page-top"
        onClick={() => {
          sound.play('arrival');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </main>
  );
}
