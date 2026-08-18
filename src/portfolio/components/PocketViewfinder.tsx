import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import gsap from 'gsap';
import { RotateCcw } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type ViewfinderPhase = 'closed' | 'inspecting' | 'opening' | 'opened' | 'resetting';

interface SceneHandle {
  group: import('three').Group;
  renderer: import('three').WebGLRenderer;
  render: () => void;
}

export default function PocketViewfinder() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandle | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [phase, setPhase] = useState<ViewfinderPhase>('closed');
  const phaseRef = useRef<ViewfinderPhase>('closed');
  const [fallback, setFallback] = useState(false);
  const [metrics, setMetrics] = useState({ calls: 0, triangles: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const debug = new URLSearchParams(window.location.search).has('debug');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let disposed = false;
    let frame = 0;
    let visible = true;
    let pageVisible = document.visibilityState === 'visible';
    let handleVisibility: (() => void) | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let intersectionObserver: IntersectionObserver | undefined;
    let metricsElapsed = 0;

    void import('three').then((THREE) => {
      if (disposed) return;
      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
        camera.position.set(0, 0.1, 5.2);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        group.rotation.set(-0.12, 0.45, -0.05);
        scene.add(group);

        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x24211d, metalness: 0.42, roughness: 0.38 });
        const paperMaterial = new THREE.MeshStandardMaterial({ color: 0xe8ddc8, metalness: 0.04, roughness: 0.78 });
        const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xd2653b, emissive: 0x3c1008, emissiveIntensity: 0.2, roughness: 0.48 });
        const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8ba5a0, transmission: 0.28, opacity: 0.82, transparent: true, roughness: 0.18 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.65, 0.42, 2, 2, 1), bodyMaterial);
        group.add(body);
        const inset = new THREE.Mesh(new THREE.BoxGeometry(2.18, 1.22, 0.48), paperMaterial);
        inset.position.z = 0.04;
        group.add(inset);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.22, 32), glassMaterial);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0.62, 0.12, 0.34);
        group.add(lens);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.07, 12, 32), accentMaterial);
        ring.position.set(0.62, 0.12, 0.48);
        group.add(ring);
        const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 20), accentMaterial);
        shutter.rotation.x = Math.PI / 2;
        shutter.position.set(-0.72, 0.7, 0.24);
        group.add(shutter);

        scene.add(new THREE.HemisphereLight(0xfff4df, 0x342a24, 2.2));
        const key = new THREE.DirectionalLight(0xffffff, 3.1);
        key.position.set(3, 4, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xd36d42, 2);
        rim.position.set(-4, -2, 2);
        scene.add(rim);

        const clock = new THREE.Clock();
        const render = () => {
          renderer.render(scene, camera);
        };
        sceneRef.current = { group, renderer, render };

        const resize = () => {
          const bounds = mount.getBoundingClientRect();
          const width = Math.max(1, Math.floor(bounds.width));
          const height = Math.max(1, Math.floor(bounds.height));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          render();
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        resize();

        const tick = () => {
          if (disposed) return;
          const delta = Math.min(clock.getDelta(), 0.05);
          if (visible && pageVisible && !reducedMotion) {
            const response = 1 - Math.exp(-7 * delta);
            const targetX = -0.12 + pointerRef.current.y * 0.16;
            const targetY = (phaseRef.current === 'opened' ? -0.15 : 0.45) + pointerRef.current.x * 0.22;
            group.rotation.x += (targetX - group.rotation.x) * response;
            group.rotation.y += (targetY - group.rotation.y) * response;
            render();
            metricsElapsed += delta;
            if (debug && metricsElapsed >= 0.5) {
              metricsElapsed = 0;
              setMetrics({
                calls: renderer.info.render.calls,
                triangles: renderer.info.render.triangles,
              });
            }
          }
          frame = window.requestAnimationFrame(tick);
        };
        if (!reducedMotion) frame = window.requestAnimationFrame(tick);
        else render();

        intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) clock.getDelta();
        });
        intersectionObserver.observe(mount);
        handleVisibility = () => {
          pageVisible = document.visibilityState === 'visible';
          if (pageVisible) clock.getDelta();
        };
        document.addEventListener('visibilitychange', handleVisibility);
      } catch {
        if (!disposed) setFallback(true);
      }
    }).catch(() => {
      if (!disposed) setFallback(true);
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (handleVisibility) document.removeEventListener('visibilitychange', handleVisibility);
      timelineRef.current?.kill();
      const sceneHandle = sceneRef.current;
      if (sceneHandle) {
        sceneHandle.group.traverse((object) => {
          if (!('geometry' in object)) return;
          const mesh = object as import('three').Mesh;
          mesh.geometry?.dispose();
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        });
        sceneHandle.renderer.dispose();
        sceneHandle.renderer.forceContextLoss();
        sceneHandle.renderer.domElement.remove();
      }
      sceneRef.current = null;
    };
  }, [debug, reducedMotion]);

  const openViewfinder = () => {
    const handle = sceneRef.current;
    if (!handle || phase === 'opening') return;
    timelineRef.current?.kill();
    setPhase('opening');
    if (reducedMotion) {
      handle.group.rotation.y = -0.15;
      handle.group.scale.setScalar(1.04);
      handle.render();
      setPhase('opened');
      return;
    }
    timelineRef.current = gsap.timeline({ onComplete: () => setPhase('opened') })
      .to(handle.group.rotation, { y: -0.15, z: 0.04, duration: 0.62, ease: 'power3.inOut' })
      .to(handle.group.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.38, ease: 'back.out(1.4)' }, 0.18);
  };

  const resetViewfinder = () => {
    const handle = sceneRef.current;
    if (!handle) return;
    timelineRef.current?.kill();
    setPhase('resetting');
    if (reducedMotion) {
      handle.group.rotation.set(-0.12, 0.45, -0.05);
      handle.group.scale.setScalar(1);
      handle.render();
      setPhase('closed');
      return;
    }
    timelineRef.current = gsap.timeline({ onComplete: () => setPhase('closed') })
      .to(handle.group.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power2.inOut' })
      .to(handle.group.rotation, { x: -0.12, y: 0.45, z: -0.05, duration: 0.5, ease: 'power3.inOut' }, 0);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
    };
    if (phase === 'closed') setPhase('inspecting');
  };

  return (
    <section className="portfolio-viewfinder" data-phase={phase}>
      <div
        ref={mountRef}
        className="portfolio-viewfinder__canvas"
        aria-hidden="true"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerRef.current = { x: 0, y: 0 };
          if (phase === 'inspecting') setPhase('closed');
        }}
      >
        {fallback ? <div className="portfolio-viewfinder__fallback"><span>◫</span></div> : null}
      </div>
      <div className="portfolio-viewfinder__copy">
        <span>{phase}</span>
        <h2>Pocket viewfinder</h2>
        <p>{phase === 'opened' ? 'The Lab is open. Inspect the experiments below.' : 'A bounded Three.js object study with a fixed camera and no post-processing.'}</p>
        {phase === 'opened' ? (
          <button type="button" onClick={resetViewfinder}><RotateCcw aria-hidden="true" /> Reset</button>
        ) : (
          <button type="button" onClick={openViewfinder}>Open viewfinder</button>
        )}
      </div>
      {debug ? <output className="portfolio-viewfinder__debug">seed 94 · camera design · calls {metrics.calls} · triangles {metrics.triangles} · no post</output> : null}
    </section>
  );
}
