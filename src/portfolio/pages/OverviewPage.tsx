import { ArrowUpRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/portfolioData';
import { OverviewAbout } from '../components/OverviewAbout';
import { ServicesReceipts } from '../components/ServicesReceipts';
import { SelectedWork } from '../work/SelectedWork';
import { WorkArchive } from '../work/WorkArchive';

export function OverviewPage() {
  return (
    <main id="portfolio-main" className="portfolio-overview">
      <section
        id="overview"
        className="portfolio-hero"
        data-portfolio-section="overview"
        aria-labelledby="portfolio-hero-heading"
      >
        <header className="portfolio-hero__identity">
          <span className="portfolio-hero__monogram" aria-hidden="true">{profile.initials}</span>
          <div>
            <h1 id="portfolio-hero-heading">{profile.name}</h1>
            <p>Product engineer who designs</p>
          </div>
          <nav className="portfolio-hero__socials" aria-label="Social links">
            <a href="https://github.com/Tec94" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/jackcao" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin aria-hidden="true" />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email Jack">
              <Mail aria-hidden="true" />
            </a>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" aria-label="Resume (PDF)">
              <FileText aria-hidden="true" />
            </a>
          </nav>
        </header>
        <div className="portfolio-hero__copy">
          <p>I shape useful software from the interface inward—designing the flows, states, and systems, then building them into working products.</p>
          <p>I’m based in Texas and work across product engineering, interface systems, and early product direction.</p>
          <p className="portfolio-hero__availability"><span /> Available for thoughtful product work. <Link to="/contact">Start a conversation.</Link></p>
        </div>
        <div className="portfolio-hero__actions">
          <a href={`mailto:${profile.email}`}>Email me</a>
          <Link to="/contact">Project inquiry</Link>
        </div>
      </section>

      <SelectedWork />
      <WorkArchive />

      <ServicesReceipts />

      <OverviewAbout />

      <section id="writing" className="portfolio-overview-section portfolio-writing-teaser" data-portfolio-section="writing">
        <header className="portfolio-section-heading">
          <h2>Writing</h2>
        </header>
        <Link className="portfolio-inline-link" to="/writing">Writing <ArrowUpRight aria-hidden="true" /></Link>
      </section>

      <button
        type="button"
        className="portfolio-page-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </main>
  );
}

export function WorkPage() {
  return (
    <main id="portfolio-main" className="portfolio-page portfolio-work-page">
      <WorkArchive standalone />
    </main>
  );
}
