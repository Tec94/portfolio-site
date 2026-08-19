import {
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/portfolioData';
import { OverviewAbout } from '../components/OverviewAbout';
import { ServicesReceipts } from '../components/ServicesReceipts';
import { SelectedWork } from '../work/SelectedWork';
import { WorkArchive } from '../work/WorkArchive';
import { usePortfolioSound } from '../providers/SoundProvider';

const heroLinkIcons = {
  projects: '/projects.svg',
  github: '/github.svg',
  linkedin: '/linkedin.svg',
  mail: '/mail.svg',
  resume: '/resume.svg',
} as const;

function HeroLinkIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="portfolio-hero__link-icon"
      style={{ '--portfolio-inline-icon': `url("${src}")` } as CSSProperties}
    />
  );
}

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
        <header className="portfolio-hero__identity">
          <span className="portfolio-hero__monogram" aria-hidden="true">{profile.initials}</span>
          <h1 id="portfolio-hero-heading">{profile.name}</h1>
        </header>
        <div className="portfolio-hero__copy">
          <p>
            I’m a product engineer in Texas. I shape useful software from the interface inward—designing flows, states, and systems, then building them into working products.
          </p>
          <p>
            Explore my{' '}
            <Link className="portfolio-hero__text-link" to="/#work">
              <HeroLinkIcon src={heroLinkIcons.projects} />
              <span className="portfolio-hero__text-label">projects</span>
            </Link>
            , see my code on{' '}
            <a className="portfolio-hero__text-link" href="https://github.com/Tec94" target="_blank" rel="noreferrer">
              <HeroLinkIcon src={heroLinkIcons.github} />
              <span className="portfolio-hero__text-label">GitHub</span>
            </a>
            , connect on{' '}
            <a className="portfolio-hero__text-link" href="https://www.linkedin.com/in/jackcao" target="_blank" rel="noreferrer">
              <HeroLinkIcon src={heroLinkIcons.linkedin} />
              <span className="portfolio-hero__text-label">LinkedIn</span>
            </a>
            , send me an{' '}
            <a className="portfolio-hero__text-link" href={`mailto:${profile.email}`}>
              <HeroLinkIcon src={heroLinkIcons.mail} />
              <span className="portfolio-hero__text-label">email</span>
            </a>
            , or read my{' '}
            <a className="portfolio-hero__text-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <HeroLinkIcon src={heroLinkIcons.resume} />
              <span className="portfolio-hero__text-label">resume</span>
            </a>
            .
          </p>
        </div>
        <div className="portfolio-hero__actions">
          <a href={`mailto:${profile.email}`}>Email me</a>
          <a href={profile.calUrl} target="_blank" rel="noreferrer">
            <CalendarDays aria-hidden="true" /> Book a 15-minute call
          </a>
        </div>
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
