import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState, type ReactNode } from 'react';
import { useHoverCapable } from '../../hooks/useHoverCapable';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING_LAYOUT = {
  type: 'spring',
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export interface PreviewRailItem {
  id: string;
  label: string;
  href: string;
  preview: ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

interface PreviewRailProps {
  items: readonly PreviewRailItem[];
  ariaLabel: string;
  activeId?: string;
  ariaCurrent?: 'page' | 'step';
  onItemSelect?: (id: string) => void;
  className?: string;
}

/**
 * Adapted from beUI's Preview Rail:
 * https://beui.dev/components/motion/preview-rail
 */
export function PreviewRail({
  items,
  ariaLabel,
  activeId,
  ariaCurrent = 'page',
  onItemSelect,
  className,
}: PreviewRailProps) {
  const layoutId = useId();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const displayedId = hoveredId ?? focusedId ?? '';
  const displayedIndex = items.findIndex((item) => item.id === displayedId);
  const rowTemplate = items.length ? `repeat(${items.length}, 1.75rem)` : undefined;

  return (
    <motion.div
      layoutRoot
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusedId(null);
        }
      }}
      className={`v2-preview-rail${className ? ` ${className}` : ''}`}
    >
      <nav
        aria-label={ariaLabel}
        onPointerLeave={() => setHoveredId(null)}
        style={{ gridTemplateRows: rowTemplate }}
        className="v2-preview-rail-nav"
      >
        {items.map((item, index) => {
          const displayed = item.id === displayedId;
          const active = item.id === activeId;
          const distance =
            displayedIndex < 0 ? Number.POSITIVE_INFINITY : Math.abs(index - displayedIndex);
          const scale = displayed
            ? 1
            : distance === 1
              ? 0.68
              : distance === 2
                ? 0.44
                : active
                  ? 0.72
                  : 0.25;

          return (
            <a
              key={item.id}
              href={item.href}
              target={item.target}
              rel={item.rel ?? (item.target === '_blank' ? 'noreferrer noopener' : undefined)}
              aria-label={item.label}
              aria-current={active ? ariaCurrent : undefined}
              onPointerEnter={() => {
                if (canHover) setHoveredId(item.id);
              }}
              onPointerDown={() => setFocusedId(null)}
              onFocus={(event) => {
                if (event.currentTarget.matches(':focus-visible')) {
                  setFocusedId(item.id);
                }
              }}
              onClick={(event) => {
                if (onItemSelect) {
                  event.preventDefault();
                  onItemSelect(item.id);
                }
              }}
              className="v2-preview-rail-link"
            >
              <motion.span
                aria-hidden="true"
                animate={{ scaleX: scale }}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                className={`v2-preview-rail-tick${displayed ? ' is-highlighted' : ''}${
                  active ? ' is-active' : ''
                }`}
              />
            </a>
          );
        })}
      </nav>

      <div
        aria-hidden="true"
        style={{ gridTemplateRows: rowTemplate }}
        className="v2-preview-rail-previews"
      >
        {items.map((item) => (
          <div key={item.id} className="v2-preview-rail-preview-row">
            {item.id === displayedId ? (
              <motion.div
                layoutId={`v2-preview-rail-card-${layoutId}`}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                className="v2-preview-rail-preview-position"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={item.id}
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: 4, filter: 'blur(6px)' }
                    }
                    animate={
                      reduce
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: -2,
                            filter: 'blur(4px)',
                            transition: { duration: 0.12, ease: EASE_OUT },
                          }
                    }
                    transition={{ duration: reduce ? 0.12 : 0.18, ease: EASE_OUT }}
                  >
                    {item.preview}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
