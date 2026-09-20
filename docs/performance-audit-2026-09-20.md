# Performance audit — September 20, 2026

## Scope and measurement

Investigate the supplied Lighthouse report and fix issues confirmed in the
current production build while preserving the portfolio design and interactions.

The supplied Lighthouse 13.4.1 report measured Vite development at
`http://localhost:5173/`, with extension scripts included. Its performance score
of 63 and development JavaScript estimates are not a production baseline.
The comparison below uses Lighthouse 13.4.1 against `npm run build` served at
`http://localhost:4173/`, in separate Chrome profiles with extensions disabled.
Desktop uses Lighthouse's desktop configuration; mobile uses its standard
simulated mobile configuration, including 4x CPU slowdown.

| Metric | Desktop before | Desktop after | Mobile after |
| --- | ---: | ---: | ---: |
| Performance | 96 | 100 | 85 |
| Accessibility | 91 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| SEO | 92 | 100 | 100 |
| First Contentful Paint | 1.1 s | 0.5 s | 2.3 s |
| Largest Contentful Paint | 1.1 s | 0.7 s | 3.3 s |
| Total Blocking Time | 0 ms | 10 ms | 270 ms |
| Cumulative Layout Shift | 0.012 | 0 | 0 |

These are individual local lab observations, not field measurements or guaranteed
scores. No pre-change mobile baseline was captured. Raw reports are retained
locally in ignored `output/lighthouse-before.json`,
`output/lighthouse-verified-desktop.json`, and
`output/lighthouse-verified-mobile.json`.

## Confirmed issues fixed

- Work list frames fetched full cover images. Six generated WebP thumbnails
  reduce their combined image bytes from 974,145 to 44,520 (95.4%). Showcase and
  project detail media keep their originals. `npm run generate:work-thumbnails`
  regenerates the source-keyed manifest and assets.
- An external Google Fonts stylesheet delayed rendering. The same Besley,
  Geologica, and JetBrains Mono faces are now self-hosted with their original
  Unicode subsets, variable weights, and licenses. Font definitions load from
  the entry stylesheet; the hero's Besley roman Latin face is preloaded.
- The initial scroll reset forced layout before first paint. Initial no-hash
  visits now skip that work; route changes still reset scroll, and hash links
  still scroll to their section. The final mobile forced-reflow audit has no
  entries; desktop still reports a separate favicon-related layout calculation.
- Service receipt triggers now use native buttons with valid expanded state and
  keyboard/touch activation. About dates expose their full period as screen
  reader text. Filter names include the visible count.
- A real `robots.txt` replaces the SPA HTML previously returned at that URL.

## Verification and remaining limits

All 81 tests pass. Portfolio type checking and the production build pass.
Portfolio lint has no errors and six existing React Refresh warnings.
Browser checks confirmed local font loading without Google Fonts requests,
thumbnail decoding, preserved full-size showcase images, section navigation,
project scroll resets, and receipt keyboard/touch controls. The checked mobile
services layout has no horizontal overflow. No page errors were observed in
these checks.

The desktop trace still attributes 87.6 ms of forced layout to the favicon path.
The throttled mobile run still reports 270 ms of blocking time and required
entry CSS on the rendering path. Homepage coverage also reports unused code
and styles; that alone does not establish they are unused on other routes.
No broad dependency or stylesheet removal was justified by this report.
The local preview's cache diagnostics do not establish deployed Cloudflare/R2
cache behavior, so hosting headers were not changed.

Changes are local; production was not deployed as part of this audit.
