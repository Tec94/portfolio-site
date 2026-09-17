import { AboutDossier } from './AboutDossier';

export function OverviewAbout() {
  return (
    <section id="about" className="portfolio-content-shell portfolio-split-layout portfolio-overview-section portfolio-about-dossier" data-portfolio-section="about">
      <header className="portfolio-dossier-heading"><h2>About</h2></header>
      <AboutDossier />
    </section>
  );
}
