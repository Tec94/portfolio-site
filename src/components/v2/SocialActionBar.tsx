import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useId, useState, type ReactNode } from 'react';
import { useHoverCapable } from '../../hooks/useHoverCapable';

const SPRING_LAYOUT = {
  type: 'spring',
  stiffness: 460,
  damping: 34,
  mass: 0.62,
} as const;

const LABEL_TRANSITION = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.7,
} as const;

export interface SocialAction {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

interface SocialActionBarProps {
  items: readonly SocialAction[];
  ariaLabel: string;
}

/**
 * A link-safe adaptation of beUI's Expandable Action Bar.
 */
export function SocialActionBar({ items, ariaLabel }: SocialActionBarProps) {
  const groupId = useId();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <LayoutGroup id={groupId}>
      <motion.nav
        layout
        aria-label={ariaLabel}
        onPointerLeave={() => setActiveId(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setActiveId(null);
          }
        }}
        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
        className="v2-social-action-bar"
      >
        {items.map((item) => {
          const expanded = !canHover || activeId === item.id;

          return (
            <motion.a
              layout="position"
              initial={false}
              animate={{
                flexGrow: canHover && activeId === item.id ? 1.5 : 1,
              }}
              key={item.id}
              href={item.href}
              target={item.target}
              rel={item.rel ?? (item.target === '_blank' ? 'noreferrer noopener' : undefined)}
              aria-label={item.label}
              onPointerEnter={() => {
                if (canHover) setActiveId(item.id);
              }}
              onFocus={() => setActiveId(item.id)}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
              className={expanded ? 'is-expanded' : undefined}
            >
              {activeId === item.id ? (
                <motion.span
                  layoutId={`v2-social-action-active-${groupId}`}
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                  className="v2-social-action-highlight"
                />
              ) : null}
              <span className="v2-social-action-icon" aria-hidden="true">
                {item.icon}
              </span>
              <AnimatePresence mode="popLayout" initial={false}>
                {expanded ? (
                  <motion.span
                    layout
                    key={`${item.id}-label`}
                    aria-hidden="true"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -4, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: -2,
                            filter: 'blur(2px)',
                            transition: { duration: 0.12 },
                          }
                    }
                    transition={reduce ? { duration: 0.12 } : LABEL_TRANSITION}
                    className="v2-social-action-label"
                  >
                    {item.label}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.a>
          );
        })}
      </motion.nav>
    </LayoutGroup>
  );
}
