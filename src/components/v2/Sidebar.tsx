import { domAnimation, LazyMotion, m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer } from '@base-ui/react/drawer';
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { profile, projects } from '../../data/portfolioData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import DitherWorldMap, { type MapLocationId } from './DitherWorldMap';
import OmnitrixController, { type ProjectOption } from './OmnitrixController';
import ProjectGlyph from './ProjectGlyph';
import { useProjectGallery } from './ProjectGalleryContext';
import { SocialActionBar, type SocialAction } from './SocialActionBar';

const READOUT_EASE = [0.16, 1, 0.3, 1] as const;

const navItems = [
  { index: '01', label: 'Projects', path: '/' },
  { index: '02', label: 'Services', path: '/services' },
  { index: '03', label: 'About / Notes', path: '/about' },
  { index: '04', label: 'Contact', path: '/contact' },
] as const;

const mapLocations = {
  texas: {
    label: profile.location,
    timeZone: profile.timeZone,
  },
  'ho-chi-minh-city': {
    label: 'Ho Chi Minh City, Vietnam',
    timeZone: 'Asia/Ho_Chi_Minh',
  },
} satisfies Record<MapLocationId, { label: string; timeZone: string }>;

function SocialIcon({ label }: { label: string }) {
  if (label === 'GitHub') return <Github size={15} />;
  if (label === 'LinkedIn') return <Linkedin size={15} />;
  return <Mail size={15} />;
}

interface SidebarContentProps {
  onNavigate?: () => void;
  reserveOmnitrix?: boolean;
  omnitrixAnchorRef?: RefObject<HTMLDivElement>;
}

function SidebarContent({
  onNavigate,
  reserveOmnitrix = false,
  omnitrixAnchorRef,
}: SidebarContentProps) {
  const [now, setNow] = useState(() => new Date());
  const [activeMapLocation, setActiveMapLocation] = useState<MapLocationId>('texas');
  const reducedMotion = usePrefersReducedMotion();
  const previousMapLocationRef = useRef<MapLocationId>(activeMapLocation);
  const mapLocation = mapLocations[activeMapLocation];
  const animateReadout =
    !reducedMotion && previousMapLocationRef.current !== activeMapLocation;
  const socialActions = useMemo<SocialAction[]>(
    () =>
      profile.socialLinks.map((link) => {
        const external = link.href.startsWith('http');

        return {
          id: link.label.toLowerCase(),
          label: link.label,
          href: link.href,
          target: external ? '_blank' : undefined,
          rel: external ? 'noreferrer noopener' : undefined,
          icon: <SocialIcon label={link.label} />,
        };
      }),
    [],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    previousMapLocationRef.current = activeMapLocation;
  }, [activeMapLocation]);

  const localTime = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: mapLocation.timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now),
    [mapLocation.timeZone, now],
  );
  const localDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: mapLocation.timeZone,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(now),
    [mapLocation.timeZone, now],
  );

  return (
    <div className="v2-sidebar-content">
      <header className="v2-identity">
        <p className="v2-identity-name">{profile.name}</p>
        <p className="v2-identity-role">{profile.title}</p>
        <div className="v2-availability">
          <span aria-hidden="true" />
          Available for new projects
        </div>
      </header>

      <nav className="v2-primary-nav" aria-label="Portfolio">
        <ol>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={onNavigate}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                <span className="v2-nav-node" aria-hidden="true" />
                <span className="v2-nav-index">{item.index}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>

      {reserveOmnitrix ? (
        <div
          ref={omnitrixAnchorRef}
          className="v2-omnitrix-reserved-space"
          aria-hidden="true"
        />
      ) : null}

      <section className="v2-sidebar-section v2-local-time" aria-labelledby="local-time-label">
        <h2 id="local-time-label">Local time</h2>
        <DitherWorldMap onActiveLocationChange={setActiveMapLocation} />
        <LazyMotion features={domAnimation}>
          <div className="v2-local-time__readout" aria-live="polite" aria-atomic="true">
            <m.p
              key={`${activeMapLocation}-location`}
              initial={animateReadout ? { opacity: 0, y: 2 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: animateReadout ? 0.16 : 0,
                ease: READOUT_EASE,
              }}
            >
              {mapLocation.label}
            </m.p>
            <m.div
              key={`${activeMapLocation}-details`}
              className="v2-local-time__details"
              initial={animateReadout ? { opacity: 0, y: 2 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: animateReadout ? 0.16 : 0,
                delay: animateReadout ? 0.035 : 0,
                ease: READOUT_EASE,
              }}
            >
              <time dateTime={now.toISOString()}>{localTime}</time>
              <span>{localDate}</span>
            </m.div>
          </div>
        </LazyMotion>
      </section>

      <div className="v2-sidebar-actions">
        <NavLink className="v2-button v2-button-primary" to="/contact" onClick={onNavigate}>
          Let&apos;s build something <ArrowUpRight size={16} aria-hidden="true" />
        </NavLink>
        <a className="v2-button v2-button-secondary" href={`mailto:${profile.email}?subject=Resume request`}>
          View resume <ArrowRight size={15} aria-hidden="true" />
        </a>
        <SocialActionBar items={socialActions} ariaLabel="Social links" />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const omnitrixAnchorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const {
    bridge,
    controllerRef,
    selectedId,
    revealProject,
    setSelectorOpen,
  } = useProjectGallery();
  const projectOptions = useMemo<ProjectOption[]>(
    () =>
      projects.map((project) => ({
        id: project.id,
        label: project.title,
        glyph: <ProjectGlyph name={project.glyph} />,
      })),
    [],
  );

  const confirmProject = useCallback((projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    const opened = window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    if (opened) opened.opener = null;
  }, []);

  return (
    <>
      <aside className="v2-desktop-sidebar" aria-label="Profile and site navigation">
        <SidebarContent
          reserveOmnitrix
          omnitrixAnchorRef={omnitrixAnchorRef}
        />
      </aside>

      <header className="v2-mobile-bar">
        <NavLink to="/" className="v2-mobile-brand" aria-label="Jack Cao, projects">
          <span>
            <strong>{profile.name}</strong>
            <small>Product engineer</small>
          </span>
        </NavLink>

        <Drawer.Root
          open={open}
          onOpenChange={setOpen}
          swipeDirection="right"
          triggerId="portfolio-menu-trigger"
        >
          <Drawer.Trigger
            id="portfolio-menu-trigger"
            ref={triggerRef}
            className="v2-icon-button"
            aria-label="Open portfolio navigation"
          >
            <Menu size={21} />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop className="v2-drawer-backdrop" />
            <Drawer.Viewport className="v2-drawer-viewport">
              <Drawer.Popup className="v2-drawer" finalFocus={triggerRef}>
                <Drawer.Title className="sr-only">Portfolio navigation</Drawer.Title>
                <Drawer.Description className="sr-only">
                  Profile, pages, availability, and contact links.
                </Drawer.Description>
                <Drawer.Close className="v2-drawer-close" aria-label="Close navigation">
                  <X size={21} />
                </Drawer.Close>
                <Drawer.Content>
                  <SidebarContent onNavigate={() => setOpen(false)} />
                </Drawer.Content>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </header>

      {projectOptions.length ? (
        <OmnitrixController
          ref={controllerRef}
          projects={projectOptions}
          selectedId={selectedId}
          onPreviewChange={revealProject}
          onConfirm={confirmProject}
          onSelectorOpenChange={setSelectorOpen}
          anchorRef={omnitrixAnchorRef}
          previewRef={bridge?.previewRef}
          reducedMotion={reducedMotion}
        />
      ) : null}
    </>
  );
}
