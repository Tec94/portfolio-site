import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import watchCore from '../../assets/watch/omniverse_watch_core.png';
import watchCover from '../../assets/watch/omniverse_watch_cover.png';
import watchFrame from '../../assets/watch/omniverse_watch_frame.png';
import watchRim from '../../assets/watch/omniverse_watch_rim.png';
import radialPlate from '../../assets/watch/empty_radial.png';

gsap.registerPlugin(useGSAP);

export type ProjectOption = {
  id: string;
  label: string;
  glyph: ReactNode;
  disabled?: boolean;
};

export type OmnitrixControllerHandle = {
  armSelection: (projectId: string) => void;
  closeSelector: () => void;
};

export type OmnitrixControllerProps = {
  projects: ProjectOption[];
  selectedId: string;
  onPreviewChange: (projectId: string) => void;
  onConfirm: (projectId: string) => void | Promise<void>;
  open?: boolean;
  defaultOpen?: boolean;
  onSelectorOpenChange?: (open: boolean) => void;
  anchorRef?: RefObject<HTMLElement>;
  previewRef?: RefObject<HTMLElement | null>;
  reducedMotion?: boolean;
};

type SelectorState = 'closed' | 'opening' | 'browsing' | 'closing';
type CoverState = 'closed' | 'opening' | 'open' | 'closing';
type MechanismState = 'covered' | 'arming' | 'armed' | 'confirming' | 'recovering';
type PointerZone = 'watch' | 'menu' | 'preview';

const SLOT_POINTS = [
  { x: 0.373, y: 0.1703 },
  { x: 0.5747, y: 0.2881 },
  { x: 0.637, y: 0.4619 },
  { x: 0.5803, y: 0.6375 },
  { x: 0.4059, y: 0.7722 },
] as const;

const WHEEL_THRESHOLD = 54;
const DRAG_THRESHOLD = 48;
const HOVER_INTENT_DURATION = 0.06;
const POINTER_EXIT_GRACE_DURATION = 0.08;
const MECHANISM_REVERSE_TIME_SCALE = 0.5;

function pauseAtStart(animation: gsap.core.Animation | null) {
  animation?.pause(0);
}

function restartDelayed(animation: gsap.core.Animation | null) {
  animation?.restart();
}

function isPromiseLike(value: unknown): value is PromiseLike<void> {
  return Boolean(value && typeof (value as PromiseLike<void>).then === 'function');
}

function circularOffset(index: number, activeIndex: number, length: number) {
  if (length <= 1) return 0;
  let offset = (index - activeIndex + length) % length;
  if (offset > length / 2) offset -= length;
  return offset;
}

const OmnitrixController = forwardRef<OmnitrixControllerHandle, OmnitrixControllerProps>(
  function OmnitrixController(
    {
      projects,
      selectedId,
      onPreviewChange,
      onConfirm,
      open,
      defaultOpen = false,
      onSelectorOpenChange,
      anchorRef,
      previewRef,
      reducedMotion = false,
    },
    forwardedRef,
  ) {
    const firstEnabled = projects.find((project) => !project.disabled);
    const initialProject = projects.find((project) => project.id === selectedId) ?? firstEnabled;
    const [activeProjectId, setActiveProjectId] = useState(initialProject?.id ?? '');
    const [selector, setSelectorState] = useState<SelectorState>('closed');
    const [coverState, setCoverState] = useState<CoverState>('closed');
    const [mechanism, setMechanismState] = useState<MechanismState>('covered');
    const [dragging, setDragging] = useState(false);
    const [announcedProjectId, setAnnouncedProjectId] = useState(initialProject?.id ?? '');

    const rootRef = useRef<HTMLDivElement>(null);
    const watchButtonRef = useRef<HTMLButtonElement>(null);
    const menuZoneRef = useRef<HTMLDivElement>(null);
    const plateRef = useRef<HTMLDivElement>(null);
    const glyphLayerRef = useRef<HTMLDivElement>(null);
    const rimRef = useRef<HTMLImageElement>(null);
    const coreRef = useRef<HTMLSpanElement>(null);
    const coreSidewallRef = useRef<HTMLSpanElement>(null);
    const coreShadowRef = useRef<HTMLSpanElement>(null);
    const coverRef = useRef<HTMLSpanElement>(null);
    const coverShadowRef = useRef<HTMLSpanElement>(null);
    const pulseRef = useRef<HTMLSpanElement>(null);
    const glyphRefs = useRef(new Map<string, HTMLButtonElement>());

    const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const coverTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const coreTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const confirmationTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const hoverIntentCallRef = useRef<gsap.core.Timeline | null>(null);
    const closeGraceCallRef = useRef<gsap.core.Timeline | null>(null);
    const announcementCallRef = useRef<gsap.core.Timeline | null>(null);

    const selectorRef = useRef<SelectorState>('closed');
    const coverStateRef = useRef<CoverState>('closed');
    const mechanismRef = useRef<MechanismState>('covered');
    const activeProjectIdRef = useRef(initialProject?.id ?? '');
    const projectsRef = useRef(projects);
    const pointerZonesRef = useRef(new Set<PointerZone>());
    const keyboardFocusWithinRef = useRef(false);
    const coreActivationRequestedRef = useRef(false);
    const hoverSuppressedUntilExitRef = useRef(false);
    const suppressFocusOpenOnceRef = useRef(false);
    const keyboardModalityRef = useRef(true);
    const wheelAccumulatorRef = useRef(0);
    const dragPointRef = useRef({ x: 0, y: 0, accumulator: 0 });
    const confirmationIdRef = useRef<string | null>(null);
    const confirmationStatusRef = useRef<'idle' | 'pending' | 'success' | 'failure'>('idle');
    const mountedRef = useRef(true);
    const hasAppliedDefaultOpenRef = useRef(false);

    const onPreviewChangeRef = useRef(onPreviewChange);
    const onConfirmRef = useRef(onConfirm);
    const onSelectorOpenChangeRef = useRef(onSelectorOpenChange);
    const animateGlyphsRef = useRef<
      (activeIndex: number, direction: number, immediate?: boolean) => void
    >(() => {});
    const openSelectorRef = useRef<(immediate?: boolean) => void>(() => {});
    const closeSelectorRef = useRef<(explicit?: boolean) => void>(() => {});
    const armSelectionRef = useRef<(projectId: string) => void>(() => {});
    const revealCoverRef = useRef(() => {});
    const retractCoverRef = useRef(() => {});
    const revealMechanismRef = useRef(() => {});
    const retractMechanismRef = useRef<(force?: boolean) => void>(() => {});
    const confirmSelectionRef = useRef(() => {});
    const performConfirmRef = useRef(() => {});

    const projectKey = projects.map((project) => `${project.id}:${project.disabled ? 1 : 0}`).join('|');
    const activeIndex = Math.max(
      0,
      projects.findIndex((project) => project.id === activeProjectId),
    );
    const activeProject = projects[activeIndex] ?? firstEnabled;
    const activeLabel = activeProject?.label ?? 'project';
    const visibleIds = useMemo(() => {
      const ids = new Set<string>();
      projects.forEach((project, index) => {
        if (Math.abs(circularOffset(index, activeIndex, projects.length)) <= 2) {
          ids.add(project.id);
        }
      });
      return ids;
    }, [activeIndex, projects]);

    const commitSelectorState = useCallback((next: SelectorState) => {
      selectorRef.current = next;
      setSelectorState(next);
    }, []);

    const commitCoverState = useCallback((next: CoverState) => {
      coverStateRef.current = next;
      setCoverState(next);
    }, []);

    const commitMechanismState = useCallback((next: MechanismState) => {
      mechanismRef.current = next;
      setMechanismState(next);
    }, []);

    const revealCover = useCallback(() => {
      const timeline = coverTimelineRef.current;
      if (!timeline) return;

      if (timeline.progress() >= 0.999) {
        commitCoverState('open');
        if (coreActivationRequestedRef.current) revealMechanismRef.current();
        return;
      }

      commitCoverState('opening');
      timeline.timeScale(1).play();
    }, [commitCoverState]);

    const retractCover = useCallback(() => {
      const timeline = coverTimelineRef.current;
      if (!timeline || timeline.progress() <= 0.01) {
        timeline?.pause(0);
        if (coverStateRef.current !== 'closed') commitCoverState('closed');
        return;
      }
      if (timeline.reversed()) return;

      commitCoverState('closing');
      timeline.timeScale(reducedMotion ? 1 : MECHANISM_REVERSE_TIME_SCALE).reverse();
    }, [commitCoverState, reducedMotion]);

    const revealMechanism = useCallback(() => {
      if (mechanismRef.current === 'confirming') return;
      coreActivationRequestedRef.current = true;

      const coverTimeline = coverTimelineRef.current;
      if (!coverTimeline || coverTimeline.progress() < 0.999) return;

      const timeline = coreTimelineRef.current;
      if (!timeline) return;

      if (timeline.progress() >= 0.999) {
        commitMechanismState('armed');
        return;
      }

      commitMechanismState('arming');
      timeline.timeScale(1).play();
    }, [commitMechanismState]);

    const retractMechanism = useCallback((force = false) => {
      if (mechanismRef.current === 'confirming' && !force) return;
      const timeline = coreTimelineRef.current;
      if (!timeline || timeline.progress() <= 0.01) {
        timeline?.pause(0);
        if (mechanismRef.current !== 'covered') commitMechanismState('covered');
        return;
      }
      if (timeline.reversed()) return;

      commitMechanismState('recovering');
      timeline.timeScale(reducedMotion ? 1 : MECHANISM_REVERSE_TIME_SCALE).reverse();
    }, [commitMechanismState, reducedMotion]);

    const armSelection = useCallback(
      (projectId: string) => {
        const project = projectsRef.current.find((item) => item.id === projectId);
        if (
          selectorRef.current !== 'browsing' ||
          activeProjectIdRef.current !== projectId ||
          !project ||
          project.disabled
        ) {
          return;
        }

        revealCover();
        revealMechanism();
      },
      [revealCover, revealMechanism],
    );
    const closeSelector = useCallback(
      (explicit = true) => {
        if (selectorRef.current === 'closed' || selectorRef.current === 'closing') return;

        pauseAtStart(hoverIntentCallRef.current);
        pauseAtStart(closeGraceCallRef.current);
        pauseAtStart(announcementCallRef.current);
        wheelAccumulatorRef.current = 0;
        setDragging(false);

        if (explicit && pointerZonesRef.current.has('watch')) {
          hoverSuppressedUntilExitRef.current = true;
        }

        commitSelectorState('closing');
        coreActivationRequestedRef.current = false;
        confirmationTimelineRef.current?.pause();
        confirmationIdRef.current = null;
        confirmationStatusRef.current = 'idle';
        menuTimelineRef.current?.reverse();
        retractMechanism(true);
        retractCover();
      },
      [commitSelectorState, retractCover, retractMechanism],
    );
    const openSelector = useCallback(
      (immediate = false) => {
        if (
          hoverSuppressedUntilExitRef.current ||
          selectorRef.current === 'opening' ||
          selectorRef.current === 'browsing'
        ) {
          return;
        }

        pauseAtStart(closeGraceCallRef.current);
        commitSelectorState('opening');
        onSelectorOpenChangeRef.current?.(true);

        const menuTimeline = menuTimelineRef.current;
        if (!menuTimeline) return;
        if (immediate && reducedMotion) {
          menuTimeline.timeScale(1.5);
        } else {
          menuTimeline.timeScale(1);
        }
        menuTimeline.play();
      },
      [commitSelectorState, reducedMotion],
    );
    const completeConfirmationFailure = useCallback(() => {
      if (!mountedRef.current || selectorRef.current === 'closing') return;
      confirmationStatusRef.current = 'failure';
      confirmationIdRef.current = null;
      confirmationTimelineRef.current?.pause(0);
      gsap.to(coreRef.current, {
        z: reducedMotion ? 0 : 26,
        scale: reducedMotion ? 1.01 : 1.05,
        duration: reducedMotion ? 0.08 : 0.16,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(rimRef.current, {
        rotation: 0,
        duration: reducedMotion ? 0.08 : 0.16,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      commitMechanismState('armed');
    }, [commitMechanismState, reducedMotion]);

    const completeConfirmationSuccess = useCallback(() => {
      if (!mountedRef.current || selectorRef.current === 'closing') return;
      confirmationStatusRef.current = 'success';
      const timeline = confirmationTimelineRef.current;
      if (!timeline || timeline.progress() >= 0.999) {
        closeSelectorRef.current(false);
      }
    }, []);

    const performConfirm = useCallback(() => {
      const projectId = confirmationIdRef.current;
      if (!projectId || confirmationStatusRef.current !== 'pending') return;

      try {
        const result = onConfirmRef.current(projectId);
        if (isPromiseLike(result)) {
          Promise.resolve(result).then(completeConfirmationSuccess, completeConfirmationFailure);
        } else {
          completeConfirmationSuccess();
        }
      } catch {
        completeConfirmationFailure();
      }
    }, [completeConfirmationFailure, completeConfirmationSuccess]);
    const confirmSelection = useCallback(() => {
      if (mechanismRef.current !== 'armed' || confirmationIdRef.current) return;
      const project = projectsRef.current.find(
        (item) => item.id === activeProjectIdRef.current,
      );
      if (!project || project.disabled) return;

      confirmationIdRef.current = project.id;
      confirmationStatusRef.current = 'pending';
      commitMechanismState('confirming');
      confirmationTimelineRef.current?.restart();
    }, [commitMechanismState]);

    useEffect(() => {
      projectsRef.current = projects;
      onPreviewChangeRef.current = onPreviewChange;
      onConfirmRef.current = onConfirm;
      onSelectorOpenChangeRef.current = onSelectorOpenChange;
      armSelectionRef.current = armSelection;
      closeSelectorRef.current = closeSelector;
      openSelectorRef.current = openSelector;
      revealCoverRef.current = revealCover;
      retractCoverRef.current = retractCover;
      revealMechanismRef.current = revealMechanism;
      retractMechanismRef.current = retractMechanism;
      performConfirmRef.current = performConfirm;
      confirmSelectionRef.current = confirmSelection;
    }, [
      armSelection,
      closeSelector,
      confirmSelection,
      onConfirm,
      onPreviewChange,
      onSelectorOpenChange,
      openSelector,
      performConfirm,
      projects,
      retractCover,
      retractMechanism,
      revealCover,
      revealMechanism,
    ]);

    const selectProject = useCallback((projectId: string, direction = 0) => {
      if (mechanismRef.current === 'confirming' || selectorRef.current === 'closing') return;
      const nextIndex = projectsRef.current.findIndex((project) => project.id === projectId);
      const project = projectsRef.current[nextIndex];
      if (!project || project.disabled) return;

      if (projectId === activeProjectIdRef.current) {
        return;
      }

      activeProjectIdRef.current = projectId;
      setActiveProjectId(projectId);
      animateGlyphsRef.current(nextIndex, direction);
      onPreviewChangeRef.current(projectId);

      pauseAtStart(announcementCallRef.current);
      restartDelayed(announcementCallRef.current);
    }, []);

    const selectRelative = useCallback(
      (direction: -1 | 1) => {
        const options = projectsRef.current;
        if (!options.length) return;
        const currentIndex = Math.max(
          0,
          options.findIndex((project) => project.id === activeProjectIdRef.current),
        );

        for (let step = 1; step <= options.length; step += 1) {
          const candidateIndex =
            (currentIndex + direction * step + options.length) % options.length;
          const candidate = options[candidateIndex];
          if (!candidate.disabled) {
            selectProject(candidate.id, direction);
            return;
          }
        }
      },
      [selectProject],
    );

    const selectBoundary = useCallback(
      (boundary: 'first' | 'last') => {
        const enabled = projectsRef.current.filter((project) => !project.disabled);
        const project = boundary === 'first' ? enabled[0] : enabled[enabled.length - 1];
        if (project) selectProject(project.id, boundary === 'first' ? -1 : 1);
      },
      [selectProject],
    );

    useLayoutEffect(() => {
      const controller = rootRef.current;
      const anchor = anchorRef?.current;
      if (!controller || !anchor) return;

      const shell = controller.closest('.v2-root');
      const sidebar = anchor.closest('.v2-desktop-sidebar');
      const syncPosition = () => {
        const bounds = anchor.getBoundingClientRect();
        const shellBounds = shell?.getBoundingClientRect();
        if (!shellBounds || bounds.width < 1 || bounds.height < 1) return;
        controller.style.setProperty(
          '--omnitrix-anchor-x',
          `${bounds.left - shellBounds.left + bounds.width / 2}px`,
        );
        controller.style.setProperty(
          '--omnitrix-anchor-y',
          `${bounds.top - shellBounds.top + bounds.height / 2}px`,
        );
      };

      syncPosition();
      const resizeObserver = new ResizeObserver(syncPosition);
      resizeObserver.observe(anchor);
      if (sidebar) resizeObserver.observe(sidebar);
      window.addEventListener('resize', syncPosition);
      sidebar?.addEventListener('scroll', syncPosition, { passive: true });

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', syncPosition);
        sidebar?.removeEventListener('scroll', syncPosition);
        controller.style.removeProperty('--omnitrix-anchor-x');
        controller.style.removeProperty('--omnitrix-anchor-y');
      };
    }, [anchorRef]);

    useGSAP(
      (_context, contextSafe) => {
        const plate = plateRef.current;
        const glyphLayer = glyphLayerRef.current;
        const cover = coverRef.current;
        const coverShadow = coverShadowRef.current;
        const rim = rimRef.current;
        const core = coreRef.current;
        const coreSidewall = coreSidewallRef.current;
        const coreShadow = coreShadowRef.current;
        const pulse = pulseRef.current;
        if (
          !plate ||
          !glyphLayer ||
          !cover ||
          !coverShadow ||
          !rim ||
          !core ||
          !coreSidewall ||
          !coreShadow ||
          !pulse
        ) {
          return;
        }

        gsap.set(plate, {
          autoAlpha: 0,
          x: reducedMotion ? -5 : -26,
          rotation: reducedMotion ? 0 : -10,
          scale: reducedMotion ? 0.99 : 0.92,
          clipPath: reducedMotion
            ? 'inset(0 0 0 20% round 24px)'
            : 'inset(46% 92% 46% 0 round 40px)',
          transformOrigin: '0% 50%',
        });
        gsap.set(glyphLayer, {
          autoAlpha: 0,
          filter: reducedMotion ? 'none' : 'blur(7px)',
        });
        gsap.set(cover, { xPercent: -50, yPercent: -50, z: 0 });
        gsap.set(coverShadow, { xPercent: -50, yPercent: -50, autoAlpha: 0.38 });
        gsap.set(rim, { xPercent: -50, yPercent: -50, z: 0, rotation: 0 });
        gsap.set(core, { xPercent: -50, yPercent: -50, z: 0, scale: 1, y: 0 });
        gsap.set(coreSidewall, { xPercent: -50, yPercent: -50, autoAlpha: 0, y: 2 });
        gsap.set(coreShadow, { xPercent: -50, yPercent: -50, autoAlpha: 0.24, scale: 0.82 });
        gsap.set(pulse, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.72 });

        const menuTimeline = gsap.timeline({
          paused: true,
          onComplete: () => {
            if (selectorRef.current !== 'opening') return;
            commitSelectorState('browsing');
          },
          onReverseComplete: () => {
            commitSelectorState('closed');
            confirmationIdRef.current = null;
            confirmationStatusRef.current = 'idle';
            onSelectorOpenChangeRef.current?.(false);
          },
        });
        menuTimeline
          .to(
            plate,
            {
              autoAlpha: 1,
              x: 0,
              rotation: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0 round 0px)',
              duration: reducedMotion ? 0.08 : 0.18,
              ease: reducedMotion ? 'power2.out' : 'power4.out',
            },
            0,
          )
          .to(
            glyphLayer,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: reducedMotion ? 0.05 : 0.1,
              ease: 'power3.out',
            },
            reducedMotion ? 0.015 : 0.08,
          );
        menuTimelineRef.current = menuTimeline;

        const coverTimeline = gsap.timeline({
          paused: true,
          onComplete: () => {
            if (coverStateRef.current !== 'opening') return;
            commitCoverState('open');
            if (coreActivationRequestedRef.current) revealMechanismRef.current();
          },
          onReverseComplete: () => {
            commitCoverState('closed');
          },
        });
        const coverDuration = reducedMotion ? 0.08 : 0.28;
        coverTimeline
          .to(
            coverShadow,
            {
              yPercent: -97,
              x: reducedMotion ? 0 : 4,
              scale: reducedMotion ? 1 : 1.04,
              autoAlpha: 0.24,
              duration: coverDuration,
              ease: 'power3.inOut',
            },
            0,
          )
          .to(
            cover,
            {
              yPercent: -97,
              z: reducedMotion ? 0 : 4,
              duration: coverDuration,
              ease: 'power3.inOut',
            },
            0,
          );
        coverTimelineRef.current = coverTimeline;

        const coreTimeline = gsap.timeline({
          paused: true,
          onComplete: () => {
            if (mechanismRef.current === 'arming') commitMechanismState('armed');
          },
          onReverseComplete: () => {
            commitMechanismState('covered');
          },
        });
        const coreDuration = reducedMotion ? 0.04 : 0.09;
        coreTimeline
          .to(
            coreShadow,
            {
              autoAlpha: 0.52,
              y: reducedMotion ? 3 : 10,
              scale: reducedMotion ? 0.92 : 1.14,
              duration: coreDuration,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            coreSidewall,
            {
              autoAlpha: reducedMotion ? 0.45 : 0.88,
              y: reducedMotion ? 2 : 7,
              duration: coreDuration,
              ease: 'power2.out',
            },
            0,
          )
          .to(
            rim,
            {
              z: reducedMotion ? 0 : 12,
              duration: coreDuration,
              ease: reducedMotion ? 'power2.out' : 'back.out(1.25)',
            },
            0,
          )
          .to(
            core,
            {
              z: reducedMotion ? 0 : 26,
              y: reducedMotion ? 0 : -2,
              scale: reducedMotion ? 1.01 : 1.05,
              duration: coreDuration,
              ease: reducedMotion ? 'power2.out' : 'back.out(1.25)',
            },
            0,
          );
        coreTimelineRef.current = coreTimeline;

        const confirmationTimeline = gsap.timeline({
          paused: true,
          onComplete: () => {
            if (confirmationStatusRef.current === 'success') {
              closeSelectorRef.current(false);
            }
          },
        });
        confirmationTimeline
          .to(
            core,
            {
              z: reducedMotion ? 0 : 22,
              scale: 0.96,
              duration: 0.09,
              ease: 'power2.in',
              overwrite: 'auto',
            },
            0,
          )
          .to(
            rim,
            {
              rotation: reducedMotion ? 0 : 8,
              duration: 0.13,
              ease: 'power2.inOut',
              overwrite: 'auto',
            },
            0,
          )
          .fromTo(
            pulse,
            { autoAlpha: 0, scale: 0.72 },
            {
              autoAlpha: reducedMotion ? 0.28 : 0.56,
              scale: reducedMotion ? 1.02 : 1.85,
              duration: reducedMotion ? 0.16 : 0.28,
              ease: 'power3.out',
              yoyo: true,
              repeat: 1,
            },
            0.06,
          )
          .call(() => performConfirmRef.current(), undefined, 0.18)
          .to(
            core,
            {
              z: reducedMotion ? 0 : 26,
              scale: reducedMotion ? 1.01 : 1.05,
              duration: 0.12,
              ease: 'power2.out',
            },
            0.18,
          )
          .to(
            rim,
            { rotation: 0, duration: 0.12, ease: 'power2.out' },
            0.18,
          );
        confirmationTimelineRef.current = confirmationTimeline;

        hoverIntentCallRef.current = gsap
          .timeline({ paused: true })
          .to(
            { progress: 0 },
            { progress: 1, duration: HOVER_INTENT_DURATION, ease: 'none' },
          )
          .call(() => {
            if (
              pointerZonesRef.current.has('watch') &&
              !hoverSuppressedUntilExitRef.current
            ) {
              openSelectorRef.current();
              revealCoverRef.current();
            }
          });
        closeGraceCallRef.current = gsap
          .timeline({ paused: true })
          .to(
            { progress: 0 },
            { progress: 1, duration: POINTER_EXIT_GRACE_DURATION, ease: 'none' },
          )
          .call(() => {
            if (
              pointerZonesRef.current.size === 0 &&
              !keyboardFocusWithinRef.current
            ) {
              closeSelectorRef.current(false);
            }
          });
        announcementCallRef.current = gsap
          .timeline({ paused: true })
          .to({ progress: 0 }, { progress: 1, duration: 0.22, ease: 'none' })
          .call(() => setAnnouncedProjectId(activeProjectIdRef.current));

        const positionGlyphs = (
          nextActiveIndex: number,
          _direction: number,
          immediate = false,
        ) => {
            const menu = menuZoneRef.current;
            if (!menu) return;
            const bounds = menu.getBoundingClientRect();
            const width = bounds.width || 260;
            const height = bounds.height || 390;

            projectsRef.current.forEach((project, projectIndex) => {
              const node = glyphRefs.current.get(project.id);
              if (!node) return;
              const offset = circularOffset(
                projectIndex,
                nextActiveIndex,
                projectsRef.current.length,
              );
              const visible = Math.abs(offset) <= 2;
              const slotIndex = Math.max(0, Math.min(4, offset + 2));
              const point = SLOT_POINTS[slotIndex];
              const endpointDistance = Math.abs(slotIndex - 2);
              const opacity = !visible ? 0 : endpointDistance === 0 ? 1 : endpointDistance === 1 ? 0.7 : 0.4;
              node.dataset.slot = visible ? String(slotIndex) : 'hidden';
              node.style.pointerEvents = visible ? 'auto' : 'none';

              gsap.to(node, {
                x: point.x * width,
                y: point.y * height,
                xPercent: -50,
                yPercent: -50,
                scale: endpointDistance === 0 ? 1.08 : endpointDistance === 1 ? 1 : 0.94,
                autoAlpha: opacity,
                duration: immediate ? 0 : reducedMotion ? 0.12 : 0.24,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            });

        };
        animateGlyphsRef.current = contextSafe
          ? contextSafe(positionGlyphs)
          : positionGlyphs;

        const initialIndex = Math.max(
          0,
          projectsRef.current.findIndex(
            (project) => project.id === activeProjectIdRef.current,
          ),
        );
        animateGlyphsRef.current(initialIndex, 0, true);

        const resizeObserver = new ResizeObserver(() => {
          const currentIndex = Math.max(
            0,
            projectsRef.current.findIndex(
              (project) => project.id === activeProjectIdRef.current,
            ),
          );
          animateGlyphsRef.current(currentIndex, 0, true);
        });
        if (menuZoneRef.current) resizeObserver.observe(menuZoneRef.current);

        if (selectorRef.current !== 'closed') menuTimeline.progress(1, true).pause();
        if (coverStateRef.current === 'open' || coverStateRef.current === 'closing') {
          coverTimeline.progress(1, true).pause();
        }
        if (mechanismRef.current === 'armed' || mechanismRef.current === 'confirming') {
          coreTimeline.progress(1, true).pause();
        }

        return () => {
          resizeObserver.disconnect();
          menuTimelineRef.current = null;
          coverTimelineRef.current = null;
          coreTimelineRef.current = null;
          confirmationTimelineRef.current = null;
          hoverIntentCallRef.current = null;
          closeGraceCallRef.current = null;
          announcementCallRef.current = null;
          animateGlyphsRef.current = () => {};
        };
      },
      {
        scope: rootRef,
        dependencies: [projectKey, reducedMotion],
        revertOnUpdate: true,
      },
    );

    useEffect(() => {
      const project = projects.find((item) => item.id === selectedId) ?? firstEnabled;
      if (!project || project.id === activeProjectIdRef.current) return;
      const previousIndex = projects.findIndex(
        (item) => item.id === activeProjectIdRef.current,
      );
      const nextIndex = projects.findIndex((item) => item.id === project.id);
      const direction = nextIndex >= previousIndex ? 1 : -1;
      activeProjectIdRef.current = project.id;
      setActiveProjectId(project.id);
      animateGlyphsRef.current(nextIndex, direction);
    }, [firstEnabled, projects, selectedId]);

    useEffect(() => {
      if (open === true) openSelectorRef.current(true);
      if (open === false) closeSelectorRef.current(false);
    }, [open]);

    useEffect(() => {
      if (hasAppliedDefaultOpenRef.current) return;
      hasAppliedDefaultOpenRef.current = true;
      if (open === undefined && defaultOpen) openSelectorRef.current(true);
    }, [defaultOpen, open]);

    const enterZone = useCallback((zone: PointerZone) => {
      pointerZonesRef.current.add(zone);
      pauseAtStart(closeGraceCallRef.current);
    }, []);

    const leaveZone = useCallback((zone: PointerZone) => {
      pointerZonesRef.current.delete(zone);
      if (zone === 'watch' && hoverSuppressedUntilExitRef.current) {
        hoverSuppressedUntilExitRef.current = false;
      }
      if (pointerZonesRef.current.size === 0 && !keyboardFocusWithinRef.current) {
        pauseAtStart(closeGraceCallRef.current);
        restartDelayed(closeGraceCallRef.current);
      }
    }, []);

    useEffect(() => {
      const preview = previewRef?.current;
      const pointerZones = pointerZonesRef.current;
      if (!preview) return;

      const handleFocusIn = () => {
        if (!keyboardModalityRef.current) return;
        keyboardFocusWithinRef.current = true;
        enterZone('preview');
      };
      const handleFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (preview.contains(next) || rootRef.current?.contains(next)) return;
        keyboardFocusWithinRef.current = false;
        leaveZone('preview');
      };

      preview.addEventListener('focusin', handleFocusIn);
      preview.addEventListener('focusout', handleFocusOut);
      return () => {
        preview.removeEventListener('focusin', handleFocusIn);
        preview.removeEventListener('focusout', handleFocusOut);
        pointerZones.delete('preview');
      };
    }, [activeProjectId, enterZone, leaveZone, previewRef, selector]);

    useEffect(() => {
      const handleWheel = (event: WheelEvent) => {
        if (
          (selectorRef.current !== 'opening' && selectorRef.current !== 'browsing') ||
          mechanismRef.current === 'confirming' ||
          (pointerZonesRef.current.size === 0 && !keyboardFocusWithinRef.current)
        ) {
          return;
        }

        event.preventDefault();
        const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        const dominant =
          Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        wheelAccumulatorRef.current += dominant * multiplier;
        if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) return;

        const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
        wheelAccumulatorRef.current = 0;
        selectRelative(direction);
      };

      const handleDocumentPointerDown = (event: PointerEvent) => {
        keyboardModalityRef.current = false;
        if (selectorRef.current === 'closed') return;
        const target = event.target as Node;
        if (rootRef.current?.contains(target) || previewRef?.current?.contains(target)) return;
        closeSelectorRef.current(true);
      };

      const handleDocumentKeyDown = (event: KeyboardEvent) => {
        keyboardModalityRef.current = true;
        if (event.key !== 'Escape' || selectorRef.current === 'closed') return;
        event.preventDefault();
        closeSelectorRef.current(true);
        suppressFocusOpenOnceRef.current = true;
        watchButtonRef.current?.focus({ preventScroll: true });
      };

      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('pointerdown', handleDocumentPointerDown);
      document.addEventListener('keydown', handleDocumentKeyDown);
      return () => {
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('pointerdown', handleDocumentPointerDown);
        document.removeEventListener('keydown', handleDocumentKeyDown);
      };
    }, [previewRef, selectRelative]);

    useEffect(() => {
      mountedRef.current = true;
      const pointerZones = pointerZonesRef.current;
      return () => {
        mountedRef.current = false;
        pointerZones.clear();
      };
    }, []);

    useImperativeHandle(
      forwardedRef,
      () => ({
        armSelection: (projectId) => armSelectionRef.current(projectId),
        closeSelector: () => closeSelectorRef.current(true),
      }),
      [],
    );

    const handleWatchPointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
      enterZone('watch');
      if (event.pointerType === 'touch') return;
      pauseAtStart(hoverIntentCallRef.current);

      const menuProgress = menuTimelineRef.current?.progress() ?? 0;
      const coverProgress = coverTimelineRef.current?.progress() ?? 0;
      if (
        selectorRef.current !== 'closed' ||
        menuProgress > 0.001 ||
        coverProgress > 0.001
      ) {
        hoverSuppressedUntilExitRef.current = false;
        openSelectorRef.current();
        revealCoverRef.current();
        return;
      }

      restartDelayed(hoverIntentCallRef.current);
    };

    const handleWatchPointerLeave = () => {
      pauseAtStart(hoverIntentCallRef.current);
      coreActivationRequestedRef.current = false;
      retractMechanismRef.current();
      retractCoverRef.current();
      leaveZone('watch');
    };

    const handleCorePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'touch') return;
      coreActivationRequestedRef.current = true;
      revealMechanismRef.current();
    };

    const handleCorePointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === 'touch') return;
      coreActivationRequestedRef.current = false;
      retractMechanismRef.current();
    };

    const handleWatchClick = () => {
      if (selectorRef.current === 'closed' || selectorRef.current === 'closing') {
        hoverSuppressedUntilExitRef.current = false;
        openSelectorRef.current(true);
      }
      revealCoverRef.current();
      if (mechanismRef.current === 'armed') {
        confirmSelectionRef.current();
      } else if (mechanismRef.current !== 'confirming') {
        coreActivationRequestedRef.current = true;
        revealMechanismRef.current();
      }
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        selectRelative(-1);
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        selectRelative(1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        selectBoundary('first');
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        selectBoundary('last');
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && event.target === watchButtonRef.current) {
        event.preventDefault();
        handleWatchClick();
      }
    };

    const handleFocusCapture = () => {
      if (!keyboardModalityRef.current) return;
      keyboardFocusWithinRef.current = true;
      pauseAtStart(closeGraceCallRef.current);
      if (suppressFocusOpenOnceRef.current) {
        suppressFocusOpenOnceRef.current = false;
        return;
      }
      hoverSuppressedUntilExitRef.current = false;
      if (selectorRef.current === 'closed' || selectorRef.current === 'closing') {
        openSelectorRef.current(true);
      }
      revealCoverRef.current();
    };

    const handleBlurCapture = (event: ReactFocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget as Node | null;
      if (rootRef.current?.contains(next) || previewRef?.current?.contains(next)) return;
      keyboardFocusWithinRef.current = false;
      if (pointerZonesRef.current.size === 0) {
        pauseAtStart(closeGraceCallRef.current);
        restartDelayed(closeGraceCallRef.current);
      }
    };

    const handleMenuPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (selectorRef.current !== 'browsing' || mechanismRef.current === 'confirming') return;
      const target = event.target as HTMLElement;
      if (target.closest('button')) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      dragPointRef.current = { x: event.clientX, y: event.clientY, accumulator: 0 };
      setDragging(true);
    };

    const handleMenuPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const deltaX = event.clientX - dragPointRef.current.x;
      const deltaY = event.clientY - dragPointRef.current.y;
      dragPointRef.current.x = event.clientX;
      dragPointRef.current.y = event.clientY;
      dragPointRef.current.accumulator += Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
      if (Math.abs(dragPointRef.current.accumulator) < DRAG_THRESHOLD) return;
      const direction = dragPointRef.current.accumulator > 0 ? 1 : -1;
      dragPointRef.current.accumulator = 0;
      selectRelative(direction);
    };

    const endMenuDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        typeof event.currentTarget.hasPointerCapture === 'function' &&
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragPointRef.current.accumulator = 0;
      setDragging(false);
    };

    const watchLabel =
      selector === 'closed'
        ? 'Open project selector'
        : mechanism === 'covered'
          ? `Arm selected project: ${activeLabel}`
          : mechanism === 'armed'
            ? `Open selected project: ${activeLabel}`
            : mechanism === 'confirming'
              ? `Opening ${activeLabel}`
              : `Arming ${activeLabel}`;

    const announcedProject =
      projects.find((project) => project.id === announcedProjectId) ?? activeProject;
    const selectorAvailable = selector === 'opening' || selector === 'browsing';

    return (
      <div
        ref={rootRef}
        className="v2-omnitrix-controller"
        data-selector={selector}
        data-cover={coverState}
        data-mechanism={mechanism}
        data-dragging={dragging || undefined}
        data-reduced-motion={reducedMotion || undefined}
        onKeyDown={handleKeyDown}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcedProject
            ? `${announcedProject.label}, ${projects.findIndex((project) => project.id === announcedProject.id) + 1} of ${projects.length}`
            : 'No projects available'}
        </p>

        <div
          ref={menuZoneRef}
          id="omnitrix-project-selector"
          className="v2-omnitrix-menu-zone"
          role="listbox"
          aria-label="Project selector"
          aria-orientation="vertical"
          aria-hidden={!selectorAvailable || undefined}
          onPointerEnter={() => enterZone('menu')}
          onPointerLeave={() => leaveZone('menu')}
          onPointerDown={handleMenuPointerDown}
          onPointerMove={handleMenuPointerMove}
          onPointerUp={endMenuDrag}
          onPointerCancel={endMenuDrag}
        >
          <div ref={plateRef} className="v2-omnitrix-menu-plate" aria-hidden="true">
            <img src={radialPlate} alt="" draggable={false} />
          </div>

          <div ref={glyphLayerRef} className="v2-omnitrix-glyph-layer">
            {projects.map((project, index) => {
              const visible = visibleIds.has(project.id);
              const selected = project.id === activeProject?.id;
              return (
                <button
                  key={project.id}
                  ref={(node) => {
                    if (node) glyphRefs.current.set(project.id, node);
                    else glyphRefs.current.delete(project.id);
                  }}
                  type="button"
                  role="option"
                  aria-label={`${project.label}, ${index + 1} of ${projects.length}`}
                  aria-selected={selected}
                  aria-disabled={project.disabled || undefined}
                  aria-hidden={!visible || undefined}
                  tabIndex={selectorAvailable && visible ? 0 : -1}
                  disabled={project.disabled}
                  className="v2-omnitrix-socket-hit"
                  onClick={() => {
                    if (!selected) {
                      const direction = circularOffset(index, activeIndex, projects.length) >= 0 ? 1 : -1;
                      selectProject(project.id, direction);
                    }
                  }}
                >
                  <span className="v2-omnitrix-glyph" aria-hidden="true">
                    {project.glyph}
                  </span>
                  <span className="v2-omnitrix-tooltip" role="tooltip">
                    {project.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="v2-omnitrix-close"
            aria-label="Close project selector"
            tabIndex={selectorAvailable ? 0 : -1}
            onClick={() => closeSelectorRef.current(true)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div
          className="v2-omnitrix-watch-zone"
          onPointerEnter={handleWatchPointerEnter}
          onPointerLeave={handleWatchPointerLeave}
        >
          <span ref={coreShadowRef} className="v2-omnitrix-core-shadow" aria-hidden="true" />
          <img className="v2-omnitrix-frame" src={watchFrame} alt="" draggable={false} />
          <span ref={coreSidewallRef} className="v2-omnitrix-core-sidewall" aria-hidden="true" />
          <img ref={rimRef} className="v2-omnitrix-rim" src={watchRim} alt="" draggable={false} />
          <span
            ref={coreRef}
            className="v2-omnitrix-core"
            aria-hidden="true"
          >
            <img src={watchCore} alt="" draggable={false} />
          </span>
          <span ref={pulseRef} className="v2-omnitrix-confirmation-pulse" aria-hidden="true" />
          <span ref={coverShadowRef} className="v2-omnitrix-cover-shadow" aria-hidden="true" />
          <span ref={coverRef} className="v2-omnitrix-cover-stage" aria-hidden="true">
            <img className="v2-omnitrix-cover" src={watchCover} alt="" draggable={false} />
          </span>
          <span className="v2-omnitrix-frame-hit-area" aria-hidden="true" />
          <button
            ref={watchButtonRef}
            type="button"
            className="v2-omnitrix-watch-control"
            aria-label={watchLabel}
            aria-expanded={selector !== 'closed'}
            aria-controls="omnitrix-project-selector"
            onPointerEnter={handleCorePointerEnter}
            onPointerLeave={handleCorePointerLeave}
            onClick={handleWatchClick}
          />
          <span className="v2-omnitrix-focus-ring" aria-hidden="true" />
        </div>
      </div>
    );
  },
);

export default OmnitrixController;
