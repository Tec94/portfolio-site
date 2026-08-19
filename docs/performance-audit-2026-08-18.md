# Performance audit — August 18, 2026

The supplied Lighthouse and DevTools trace describe a local Vite development
session at `http://localhost:5173/`. They identify one production-relevant
loading issue, but they are not a deploy-quality performance baseline.

## Lighthouse snapshot

Lighthouse 13.4.0 reported:

| Category or metric | Result |
| --- | ---: |
| Performance | 56 |
| Accessibility | 94 |
| Best practices | 100 |
| SEO | 92 |
| First Contentful Paint | 3.4 s |
| Largest Contentful Paint | 6.2 s |
| Total Blocking Time | 80 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 17.0 s |

The run also reported `PROTOCOL_TIMEOUT` while capturing the full-page
screenshot. Lighthouse warned that Chrome extensions affected load performance.
Its unused-JavaScript list contains extension scripts and Vite's unminified
development dependency modules, so those byte estimates must not be treated as
production bundle evidence.

## Trace findings

The trace contains 103,036 events. On the inspected renderer main thread it
contains four tasks of at least 50 milliseconds; the longest is 101.42
milliseconds. ScrollTrigger's measured layout work is negligible compared with
the development React and module-evaluation work, so the evidence does not
support removing the selected-work sequence.

The first featured project image is the LCP candidate and was marked
`loading="lazy"`. That delayed browser prioritization of content already visible
in the initial viewport.

## Applied change

The first featured project image now uses eager loading and high fetch priority.
Later featured images, archive thumbnails, and offscreen media remain lazy.
This is the only source change directly required by the supplied trace.

## Next measurement

Measure the deployed production build in a clean Chrome profile after final
media replaces the SVG previews. Record field Core Web Vitals separately from
local lab evidence; do not compare extension-affected development scores with
production results.
