import type { ReactNode } from 'react';
import './SystemPage.css';

interface SystemPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  actions: ReactNode;
  details?: ReactNode;
  mainId?: string;
  actionsLabel?: string;
}

export function SystemPage({
  eyebrow,
  title,
  description,
  icon,
  actions,
  details,
  mainId = 'main-content',
  actionsLabel,
}: SystemPageProps) {
  return (
    <main id={mainId} className="portfolio-system-page">
      <section className="portfolio-system-card" aria-labelledby="portfolio-system-title">
        <span className="portfolio-system-icon" aria-hidden="true">
          {icon}
        </span>
        <p className="portfolio-system-eyebrow">{eyebrow}</p>
        <h1 id="portfolio-system-title">{title}</h1>
        <p className="portfolio-system-description">{description}</p>
        <div
          className="portfolio-system-actions"
          role={actionsLabel ? 'navigation' : undefined}
          aria-label={actionsLabel}
        >
          {actions}
        </div>
        {details}
      </section>
    </main>
  );
}
