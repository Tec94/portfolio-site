import { AboutDossier, ResumeStamp } from '../components/AboutDossier';

export function AboutPage() {
  return (
    <main id="portfolio-main" className="portfolio-route-page portfolio-about-page">
      <div className="portfolio-split-layout portfolio-about-dossier">
        <header className="portfolio-dossier-heading"><h1>About</h1><ResumeStamp /></header>
        <AboutDossier />
      </div>
    </main>
  );
}
