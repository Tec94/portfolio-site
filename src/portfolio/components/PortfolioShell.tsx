import pageCopy from '../../content/site/PortfolioShell.json';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { ArrowUp, Moon, Search, Sun, Volume2, VolumeX } from 'lucide-react';
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom';
import { transitionPortfolioPage } from '../motion';
import { mountLedgerFavicon } from '../ledgerFavicon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
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
  useEffect(mountLedgerFavicon, []);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [dockHover, setDockHover] = useState<number | null>(null);
  const [utilityHover, setUtilityHover] = useState<'theme' | 'sound' | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const projectMatch = useMatch('/work/:slug');
  const writingMatch = useMatch('/writing/*');
  const location = useLocation();
  const theme = usePortfolioTheme();
  const sound = usePortfolioSound();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const activeDock = Math.max(0, navigation.findIndex((item) => (
    location.pathname === '/'
      ? activeSection === item.section || (item.section === 'work' && activeSection === 'featured')
      : location.pathname.startsWith(item.route)
  )));
  const dockIndex = dockHover ?? activeDock;
  const moveDock = (index: number | null) => {
    setDockHover(index);
  };
  const moveUtility = (next: 'theme' | 'sound' | null) => {
    setUtilityHover(next);
  };
  const navigateLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!link || link.getAttribute('aria-disabled') === 'true') return;
    sound.play('navigation');
    if (link.target || link.hasAttribute('download') || link.matches('[data-project-transition]') || link.querySelector('[data-project-transition]')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || url.pathname === location.pathname) return;
    event.preventDefault();
    transitionPortfolioPage(() => navigate(`${url.pathname}${url.search}${url.hash}`));
  };

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

  useLayoutEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView?.({
        behavior: 'auto',
        block: 'start',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
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
          if (!section || window.location.pathname !== '/') return;

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
    <div className="portfolio-root" data-command-open={commandOpen} onClickCapture={navigateLink}>
      <a className="portfolio-skip-link" href={pageCopy["portfolio_main"]}>{pageCopy["skip_to_main_content"]}</a>

      <div className="portfolio-page-content" key={location.pathname}>{children}</div>

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
        {projectMatch || writingMatch ? (
          <Link
            className="portfolio-dock__back"
            to={writingMatch ? (location.pathname === '/writing' ? '/#writing' : '/writing') : getLandingSectionUrl('work')}
          >{writingMatch ? (location.pathname === '/writing' ? '← Back to home' : '← Back to writing') : pageCopy["back_to_index"]}</Link>
        ) : (
          <div className="portfolio-dock__links" onPointerLeave={() => moveDock(null)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) moveDock(null); }}>
            <span className="portfolio-dock__knob" aria-hidden="true" style={{ transform: `translateX(${dockIndex * 100}%)` }} />
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                data-highlighted={dockIndex === index}
                aria-current={activeDock === index && activeSection !== 'overview' ? 'location' : undefined}
                onPointerEnter={(event) => { if (event.pointerType === 'mouse') moveDock(index); }}
                onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) moveDock(index); }}
                className={(
                  (location.pathname === '/' && (
                    activeSection === item.section ||
                    (item.section === 'work' && activeSection === 'featured')
                  )) ||
                  (location.pathname !== '/' && location.pathname.startsWith(item.route))
                ) ? 'is-active' : undefined}
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
            onClick={() => {
              sound.play('navigation');
              window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
            }}
          >
            <ArrowUp aria-hidden="true" />
          </button>
        ) : null}
        <div className="portfolio-utility-capsule" data-knob={utilityHover === 'sound' ? 'sound' : 'theme'}
          onPointerLeave={() => moveUtility(null)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) moveUtility(null); }}>
        <span className="portfolio-utility-capsule__knob" aria-hidden="true" />
        {utilityHover && <span className="portfolio-utility-tooltip" aria-hidden="true">
          {utilityHover === 'theme' ? `Theme · ${theme.mode}` : `Sound · ${sound.enabled ? 'on' : 'off'}`}
        </span>}
        <button
          type="button"
          className="portfolio-icon-button"
          aria-label={`Theme: ${theme.mode}; switch to ${theme.mode === 'light' ? 'dark' : 'light'}`}
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') moveUtility('theme'); }}
          onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) moveUtility('theme'); }}
          onClick={() => {
            theme.cycleMode();
            sound.play('press');
          }}
        >
          <span className="portfolio-theme-icon" aria-hidden="true">
            <Sun data-active={theme.mode === 'light' || undefined} />
            <Moon data-active={theme.mode === 'dark' || undefined} />
          </span>
        </button>
        <button
          type="button"
          className="portfolio-icon-button"
          aria-label={`Interface sound ${sound.enabled ? 'on' : 'off'}`}
          aria-pressed={sound.enabled}
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') moveUtility('sound'); }}
          onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) moveUtility('sound'); }}
          onClick={sound.toggle}
        >
          <span className="portfolio-sound-icon" aria-hidden="true">
            <Volume2 data-active={sound.enabled || undefined} />
            <VolumeX data-active={!sound.enabled || undefined} />
          </span>
        </button>
        </div>
      </div>

      <CommandMenu
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        returnFocusRef={searchButtonRef}
      />
    </div>
  );
}
