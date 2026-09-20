# Jack Cao portfolio

This repository contains Jack Cao's current tactile editorial portfolio, two
preserved legacy experiences, a payment demonstration, and the Supabase contact
submission function.

## Development

Install the project dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Vite serves the site from `http://localhost:5173`.

## Local content editor

Run `npm run studio` and open the local URL printed in the terminal. Portfolio
Studio edits projects, process writing, articles, site copy, profile details,
services, and media. Save and preview locally, then use **Publish saved changes**
to build and deploy to Cloudflare without an AI prompt.

See [the Studio guide](docs/portfolio-studio.md) for publishing, drafts, media,
authentication, and recovery details.

## Quality checks

Run these commands before you submit a change:

```bash
npm run type-check:portfolio
npm run lint:portfolio
npm test
npm run build
```

The repository also includes generators for project preview assets and the
ASCII world map data:

```bash
npm run generate:previews
npm run generate:world-map
```

## Repository structure

The project keeps runtime source, static assets, backend files, and project
documentation in separate locations:

- `src/` contains the React application, styles, tests, and bundled assets.
- `public/assets/project-device/` contains the active project-device videos.
- `public/screenshots/` contains generated project preview SVG files.
- `scripts/` contains repeatable asset and data generators.
- `supabase/` contains the contact function and database migration.
- `docs/` contains current project status and planned product work.
- `.impeccable.md` contains the active visual direction for design tools.
- `payment-reference.pen` is the editable Pencil source for the payment page.

Generated builds, browser captures, automation state, logs, local environment
files, and dependency folders are excluded through `.gitignore`.

Run `npm run generate:work-thumbnails` after replacing project cover images or
video posters. It writes content-hashed WebP list previews and their source map;
commit both `public/assets/work-thumbnails/` and
`src/portfolio/work/thumbnails.json`. Showcase and detail views retain the
original images. A changed or new source uses its original until regenerated.

## Routes

The current portfolio owns `/`, the landing-page section anchors, project case
studies under `/work/:slug`, and the Services, About, Writing, Lab, and Contact
routes. `/preview/*` redirects to the equivalent public route.

The preserved experiences remain available at `/v2/*` and `/classic`.
`/payment` and the legacy `/services/:slug` demonstrations remain separate.

## Current status

The tactile portfolio is active at the root and remains under visual and
content refinement. Read the [product polish roadmap](docs/roadmap.md) and
[active design direction](.impeccable.md) before changing page structure,
motion, typography, accessibility, or color. The latest supplied performance
evidence is recorded in the
[September 2026 performance audit](docs/performance-audit-2026-09-20.md).

## Next steps

Use the roadmap to select one bounded page or system at a time. Verify keyboard,
responsive, reduced-motion, loading, error, and empty states with each change.
