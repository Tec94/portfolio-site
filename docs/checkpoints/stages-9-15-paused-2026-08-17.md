# Stages 9–15 pause checkpoint

> **Historical record:** Work resumed after this checkpoint and the tactile
> portfolio now owns the public root routes. Use `README.md`, `.impeccable.md`,
> and `docs/roadmap.md` for current implementation guidance. The instructions
> below are preserved as the August 17 handoff record.

Paused at the owner’s request on August 17, 2026. Do not restart the implementation from scratch.

## Contract

Complete Stages 9–15 in one continuous implementation, defer noncritical visual/content decisions into one revision packet at the end, and stop early only for a critical owner decision.

## Completed in this run

- Read and applied the frontend-design, better-writing, better-accessibility, GSAP React, Three.js camera, procedural-animation, and visual-validation skill guidance.
- Reconciled the Stage 6 evidence audit with the owner approvals.
- Added an accessible content-navigation component with active heading tracking.
- Added a native-dialog project media viewer with:
  - Escape and backdrop dismissal.
  - Focus management through the native modal dialog.
  - Arrow-key navigation.
  - Full-height side navigation columns.
  - Pointer drag and touch swipe.
  - Image and video states.
  - Optional filmstrip for multiple media items.
- Rebuilt the project route as a case-study template with:
  - Evidence-safe metadata.
  - Hero media transition.
  - Role, duration, and stack facts.
  - Live, repository, and Devpost links when available.
  - Sticky table of contents.
  - Next-project navigation.
- Published all five approved case studies:
  1. Credify.
  2. CitizenVoice.
  3. Smartnest.
  4. Stock Tracker.
  5. $Munky.
- Removed unsupported quantitative and security claims from the case studies.
- Added a draft Writing MDX record to prove draft exclusion without publishing owner-unapproved writing.
- Implemented production route components for:
  - Services using the approved receipt interaction.
  - About with experience, milestones, toolbox, local time, résumé request, Writing, and Lab links.
  - Writing with published-only rendering and an intentional empty state.
  - Contact with email, copy-email, Cal.com, progressive inquiry form, validation, honeypot, privacy copy, direct-email fallback, and the existing Supabase submission backend.
  - Lab with an on-demand Omnitrix project launcher, curated snapshots, v2 archive link, and a lazy Three.js pocket viewfinder.
- Implemented the pocket viewfinder with:
  - Built-in Three.js geometry.
  - Fixed camera.
  - Closed, inspecting, opening, opened, and resetting phases.
  - Pointer response on the object rather than the camera.
  - GSAP-authored open/reset staging.
  - Clamped delta and elapsed-time rendering.
  - Offscreen and hidden-tab pausing.
  - Explicit geometry, material, renderer, event, and animation disposal.
  - Reduced-motion still behavior.
  - WebGL failure fallback.
  - Deterministic debug readout via the `debug` query parameter.
  - No post-processing.
- Changed new-portfolio content and search URLs from `/preview/*` to standard public routes.
- Changed the new shell navigation to `/work`, `/services`, `/about`, and `/contact`.
- Added `/preview/*` redirects to the equivalent public route.
- Moved the former root v2 routes to:
  - `/v2`
  - `/v2/services`
  - `/v2/about`
  - `/v2/contact`
- Updated v2 internal navigation and project-reveal routing for the `/v2` prefix.
- Retained `/classic`, `/payment`, and legacy `/services/:slug`.
- Added SPA hosting fallbacks:
  - `vercel.json`
  - `public/_redirects`
- Added `@types/three` as a development dependency.

## Current proof

The latest command passed:

```text
cmd /c npm run type-check:portfolio
Portfolio content valid: 5 projects (5 published), 1 articles (0 published).
TypeScript exit code: 0
```

The dependency install reported existing audit inventory:

- 1 low vulnerability.
- 3 moderate vulnerabilities.
- 6 high vulnerabilities.

No audit mutation was attempted because it is outside this UI implementation contract and `npm audit fix --force` could introduce breaking changes.

## Files added

- `src/portfolio/components/ContentNavigation.tsx`
- `src/portfolio/components/MediaViewer.tsx`
- `src/portfolio/components/PocketViewfinder.tsx`
- `src/portfolio/pages/AboutPage.tsx`
- `src/portfolio/pages/ContactPage.tsx`
- `src/portfolio/pages/LabPage.tsx`
- `src/portfolio/pages/ServicesPage.tsx`
- `src/portfolio/pages/WritingPage.tsx`
- `src/content/writing/ship-small-learn-fast.mdx`
- `vercel.json`
- `public/_redirects`

## Files materially updated

- `src/App.tsx`
- `src/components/v2/Sidebar.tsx`
- `src/components/v2/V2Layout.tsx`
- `src/components/v2/ServicesPage.tsx`
- `src/content/projects/*.mdx`
- `src/portfolio/PreviewPortfolio.tsx`
- `src/portfolio/components/PortfolioShell.tsx`
- `src/portfolio/components/ServicesReceipts.tsx`
- `src/portfolio/content/manifest.ts`
- `src/portfolio/content/search.ts`
- `src/portfolio/pages.tsx`
- `src/portfolio/pages/OverviewPage.tsx`
- `src/portfolio/portfolio.css`
- `package.json`
- `package-lock.json`

## Immediate follow-ups on resume

1. Fix the Three.js viewfinder lifecycle before browser verification:
   - The visibility-change listener cleanup currently lives inside the dynamic-import callback and is not returned to the outer effect cleanup.
   - The render loop closes over the initial `phase`; add a phase ref so the opened camera composition is current without recreating the scene.
2. Add the missing `.portfolio-services-page` spacing override so the route does not double-apply the route and receipt insets.
3. Inspect the production CSS insertion order. The new production-route block begins near line 587 and the prior homepage block begins near line 1707; verify that later legacy prototype selectors do not unintentionally override production-route responsive rules.
4. Run:

```text
cmd /c npm run lint:portfolio
cmd /c npm test
cmd /c npm run build
npx react-doctor@latest --verbose --scope changed
git diff --check
```

5. Add or update tests for:
   - Root/new portfolio cutover.
   - `/preview/*` redirects.
   - `/v2/*` preservation.
   - Five published projects.
   - Draft Writing exclusion.
   - Root search URLs and ranking.
   - Media viewer keyboard/dismissal behavior.
   - Contact validation and progressive disclosure.
   - WebGL fallback selection.
6. Start or reuse the Vite server at `http://localhost:5173`.
7. Browser-verify:
   - `/`
   - `/work`
   - Every `/work/:slug`.
   - `/services`
   - `/about`
   - `/writing`
   - `/lab?debug=1`
   - `/contact`
   - `/v2`
   - `/classic`
   - Direct-route refreshes.
   - Desktop, 390px mobile, 320px reflow, keyboard, reduced motion, and failed media.
8. Only after proof passes, prepare the single consolidated owner decision and revision packet.

## Deferred owner revision packet

These are intentionally deferred and are not implementation blockers:

- Final qualitative wording in each case study.
- Whether to publish the existing draft article.
- Whether to expose a downloadable résumé instead of the current résumé-request email.
- Final media replacement for the current audited SVG placeholders.
- Final visual adjustments after desktop and mobile browser review.

## Resume instruction

Resume from “Immediate follow-ups on resume,” not from Stage 9 planning.
