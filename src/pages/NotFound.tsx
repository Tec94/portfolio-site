import { ArrowUpRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SystemPage } from '../components/SystemPage';

const suggestedRoutes = [
  { label: 'Work', to: '/#work' },
  { label: 'Services', to: '/services' },
  { label: 'About / Notes', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function NotFound() {
  return (
    <SystemPage
      eyebrow="404 / Route not found"
      title="This path leaves the portfolio."
      description="The address may be outdated. Continue through one of the current sections."
      icon={<Compass />}
      actionsLabel="Portfolio sections"
      actions={(
        <>
          {suggestedRoutes.map((route) => (
            <Link key={route.to} to={route.to}>
              <span>{route.label}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </>
      )}
      details={(
        <p className="portfolio-system-path">
          Requested path <code>{window.location.pathname}</code>
        </p>
      )}
    />
  );
}
