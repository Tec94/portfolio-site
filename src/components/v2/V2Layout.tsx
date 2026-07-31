import { useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Sidebar from './Sidebar';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function V2Layout() {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

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
    <div className="v2-root">
      <Sidebar />
      <main id="main-content" className="v2-main">
        <div ref={contentRef} className="v2-route" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
