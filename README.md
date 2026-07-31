# Jack Cao portfolio

This repository contains the current React portfolio, its classic experience,
the v2 portfolio shell, a payment demonstration, and the Supabase contact
submission function.

## Development

Install the project dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Vite serves the site from `http://localhost:5173`.

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

## Current status

The portfolio is under active visual development. Read the
[product polish roadmap](docs/roadmap.md) before you change page structure,
motion, typography, accessibility, or color.

## Next steps

Use the roadmap to select one bounded page or system at a time. Verify keyboard,
responsive, reduced-motion, loading, error, and empty states with each change.
