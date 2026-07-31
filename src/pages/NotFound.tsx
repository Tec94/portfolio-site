import { ArrowUpRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const suggestedRoutes = [
  { label: 'Projects', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About / Notes', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function NotFound() {
  return (
    <main id="main-content" className="v2-system-page">
      <section className="v2-system-panel" aria-labelledby="not-found-title">
        <span className="v2-system-icon" aria-hidden="true">
          <Compass />
        </span>
        <p className="v2-eyebrow">404 / Route not found</p>
        <h1 id="not-found-title">This path leaves the portfolio.</h1>
        <p>
          The address may be outdated. Continue through one of the current sections.
        </p>
        <nav className="v2-system-routes" aria-label="Portfolio sections">
          {suggestedRoutes.map((route) => (
            <Link key={route.to} to={route.to}>
              <span>{route.label}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <p className="v2-system-path">
          Requested path <code>{window.location.pathname}</code>
        </p>
      </section>
    </main>
  );
}
