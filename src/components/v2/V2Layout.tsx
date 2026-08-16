import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Sidebar from './Sidebar';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  ProjectGalleryProvider,
  type ProjectGalleryBridge,
} from './ProjectGalleryContext';
import type { OmnitrixControllerHandle } from './OmnitrixController';
import { projects } from '../../data/portfolioData';

const defaultProjectId = projects[0]?.id ?? '';

export default function V2Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<OmnitrixControllerHandle | null>(null);
  const [bridge, setBridge] = useState<ProjectGalleryBridge | null>(null);
  const [selectedId, setSelectedId] = useState(() => {
    const requestedId = new URLSearchParams(location.search).get('project');
    return projects.some((project) => project.id === requestedId) ? requestedId! : defaultProjectId;
  });
  const [pendingRevealId, setPendingRevealId] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const requestedId = new URLSearchParams(location.search).get('project');
    if (projects.some((project) => project.id === requestedId)) {
      setSelectedId(requestedId!);
    }
  }, [location.search]);

  const revealProject = useCallback(
    (projectId: string) => {
      if (!projects.some((project) => project.id === projectId)) return;

      setSelectedId(projectId);
      if (location.pathname !== '/') {
        setPendingRevealId(projectId);
        navigate({ pathname: '/', search: `?project=${encodeURIComponent(projectId)}` });
        return;
      }

      bridge?.onPreviewChange(projectId);
    },
    [bridge, location.pathname, navigate],
  );

  useEffect(() => {
    if (!pendingRevealId || !bridge) return;
    bridge.onPreviewChange(pendingRevealId);
    setPendingRevealId(null);
  }, [bridge, pendingRevealId]);

  const galleryContext = useMemo(
    () => ({
      bridge,
      setBridge,
      controllerRef,
      selectedId,
      setSelectedId,
      revealProject,
      selectorOpen,
      setSelectorOpen,
    }),
    [bridge, revealProject, selectedId, selectorOpen],
  );

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform' },
      );
    },
    { scope: contentRef, dependencies: [location.pathname, reducedMotion], revertOnUpdate: true },
  );

  return (
    <ProjectGalleryProvider value={galleryContext}>
      <div className="v2-root" data-omnitrix-open={selectorOpen || undefined}>
        <Sidebar />
        <main id="main-content" className="v2-main">
          <div ref={contentRef} className="v2-route" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </ProjectGalleryProvider>
  );
}
