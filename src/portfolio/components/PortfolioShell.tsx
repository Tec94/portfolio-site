import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Monitor, Search, Volume2, VolumeX } from 'lucide-react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { CommandMenu } from './CommandMenu';
import { usePortfolioSound } from '../providers/SoundProvider';
import { usePortfolioTheme } from '../providers/ThemeProvider';
import { getLandingSectionUrl, parseLandingSection, type LandingSection } from '../routeOwnership';

const navigation = [
  { label: 'Work', href: getLandingSectionUrl('work'), route: '/work', section: 'work' },
  { label: 'Services', href: getLandingSectionUrl('services'), route: '/services', section: 'services' },
  { label: 'About', href: getLandingSectionUrl('about'), route: '/about', section: 'about' },
] satisfies ReadonlyArray<{
  label: string;
  href: string;
  route: string;
  section: LandingSection;
}>;

export function PortfolioShell({ children }: { children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const projectMatch = useMatch('/work/:slug');
  const location = useLocation();
  const theme = usePortfolioTheme();
  const sound = usePortfolioSound();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    return undefined;
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      const routeSection = navigation.find((item) => location.pathname.startsWith(item.route));
      setActiveSection(routeSection?.section ?? (projectMatch ? 'work' : 'overview'));
      return undefined;
    }

    const requestedSection = parseLandingSection(location.hash.slice(1));
    setActiveSection(requestedSection ?? 'overview');
    const sections = [...document.querySelectorAll<HTMLElement>('[data-portfolio-section]')];
    let observer: IntersectionObserver | undefined;
    const observeSections = () => {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const section = parseLandingSection(
            visible?.target.getAttribute('data-portfolio-section') ?? '',
          );
          if (!section) return;

          setActiveSection(section);
          const sectionUrl = getLandingSectionUrl(section);
          const currentUrl = `${window.location.pathname}${window.location.hash}`;
          if (currentUrl !== sectionUrl) {
            window.history.replaceState(window.history.state, '', sectionUrl);
          }
        },
        { rootMargin: '-30% 0px -55%', threshold: [0, 0.2, 0.6] },
      );
      sections.forEach((section) => observer?.observe(section));
    };

    const frame = location.hash ? window.requestAnimationFrame(observeSections) : undefined;
    if (!location.hash) observeSections();

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [location.hash, location.pathname, projectMatch]);

  return (
    <div className="portfolio-root">
      <a className="portfolio-skip-link" href="#portfolio-main">Skip to main content</a>

      {children}

      <nav className="portfolio-dock" aria-label="Portfolio">
        <button
          ref={searchButtonRef}
          type="button"
          className="portfolio-dock__search"
          aria-label="Search portfolio"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={() => setCommandOpen(true)}
        >
          <Search aria-hidden="true" />
        </button>
        {projectMatch ? (
          <Link className="portfolio-dock__back" to="/work" onClick={sound.playPageClose}>
            Back to index
          </Link>
        ) : (
          <div className="portfolio-dock__links">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={(
                  (location.pathname === '/' && activeSection === item.section) ||
                  (location.pathname !== '/' && location.pathname.startsWith(item.route))
                ) ? 'is-active' : undefined}
                onClick={() => sound.play('navigation')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="portfolio-utilities" aria-label="Preferences">
        {projectMatch ? (
          <button
            type="button"
            className="portfolio-icon-button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          className="portfolio-icon-button"
          aria-label={`Theme: ${theme.mode}${theme.mode === 'system' ? `, currently ${theme.resolvedTheme}` : ''}`}
          onClick={() => {
            theme.cycleMode();
            sound.play('toggle');
          }}
        >
          <Monitor aria-hidden="true" />
        </button>
        <button
          type="button"
          className="portfolio-icon-button"
          aria-label={`Interface sound ${sound.enabled ? 'on' : 'off'}`}
          aria-pressed={sound.enabled}
          onClick={sound.toggle}
        >
          {sound.enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        </button>
      </div>

      <CommandMenu
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        returnFocusRef={searchButtonRef}
      />
    </div>
  );
}
