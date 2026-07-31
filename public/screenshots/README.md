# Project preview assets

This directory contains the lightweight project previews that the portfolio
archive loads from `src/data/portfolioData.ts`.

## Generate the previews

The preview generator writes one SVG file for each project. Run it from the
repository root:

```bash
npm run generate:previews
```

Keep the project identifiers in
`scripts/generate-project-previews.cjs` synchronized with the image paths in
`src/data/portfolioData.ts`.

Do not store browser test captures or review screenshots in this directory.
Playwright output belongs in the ignored `output/` directory and can be
deleted after review.
