# Product polish roadmap

The tactile editorial portfolio is active at the root. This document records
remaining product work without treating the preserved v2 and classic routes as
part of the new portfolio's visual system.

## Current foundation

- `/` owns the introduction, featured work, archive, Services, About, and
  Writing teaser.
- Published case studies live under `/work/:slug`.
- Services, About, Writing, Lab, and Contact have dedicated routes.
- `/v2/*`, `/classic`, `/payment`, and legacy service demonstrations remain
  available without defining the current design direction.
- The landing page uses one content shell and split-grid alignment contract.
- Loading, missing-content, and fatal-error states use the tactile portfolio
  palette instead of the v2 system skin.

## Remaining content work

Replace audited preview SVG files with final product media as owner-approved
captures become available. Keep project roles, outcomes, and qualitative claims
evidence-safe until the owner completes the case-study wording pass.

Publish Writing entries only after their content is approved. Draft MDX must
remain excluded from routes and search.

## Performance evidence

The August 18 supplied Lighthouse run used the Vite development server and a
Chrome profile with performance-affecting extensions. Its score is not a
production baseline. The trace did reveal one actionable issue: the first
featured image was a lazy-loaded LCP candidate. The implementation now gives
that image eager, high-priority loading while leaving later media lazy.

See [the performance audit](performance-audit-2026-08-18.md) for the measured
values and environment limits.

## Completion criteria

A change is ready when its desktop and mobile layouts are coherent, its keyboard
path is complete, reduced motion remains useful, and loading, missing-content,
and error states match the active visual system. Automated checks support, but
do not replace, visual and interaction review.

Review one bounded route or system at a time. Preserve the legacy routes unless
a separate task explicitly changes them.
