# Product polish roadmap

This document records the visible product work that remains after the current
portfolio redesign. It prevents completed technical experiments from being
mistaken for finished interface work.

> **Note:** This is a preview feature currently under active development.

## Project-device motion

The project-device watch uses a scroll-scrubbed reference video, but the final
animation is not fully realized. The remaining work must address timing,
continuity, visual ownership, scroll reversal, responsive framing, and the
reduced-motion presentation.

The final motion must feel like part of the portfolio rather than an embedded
reference clip. It must remain legible at narrow widths and must not compete
with project content.

## Page-wide refinement

Every route still needs a deliberate review and rework pass. The review must
cover the v2 pages, classic portfolio, service details, payment demonstration,
not-found page, loading states, and error states.

Each pass must address these areas:

- Typography hierarchy, measure, wrapping, rhythm, and responsive scale.
- Accessibility semantics, keyboard order, focus visibility, labels, contrast,
  reduced motion, and screen-reader announcements.
- Layout grouping, spacing, alignment, density, overflow, and breakpoint
  behavior.
- Color roles, contrast, surface separation, state colors, and the removal of
  inconsistent legacy accents.
- Motion purpose, interruption, loading feedback, and input-method support.
- Content clarity, real links, accurate states, and consistent calls to action.

## Completion criteria

A page is ready only when its desktop and mobile layouts are coherent, its
keyboard path is complete, its reduced-motion behavior is intentional, and its
loading and error states match the final visual system.

Automated checks must pass, but they do not replace visual, interaction, and
content review.

## Next steps

Finish the project-device motion direction first. Then review one route at a
time and record its remaining issues before changing shared styles.
