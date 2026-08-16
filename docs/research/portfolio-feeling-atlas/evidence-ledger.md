# Evidence ledger

This ledger records where the atlas came from and where evidence remains
incomplete. It distinguishes public-page measurements from creator statements
and design interpretation so future implementation can recheck the claims that
carry the most risk.

## Research methods

The pass combined four complementary methods. No single method was treated as a
complete representation of a modern interactive site.

- **Public route discovery:** Firecrawl maps exposed the visible content
  architecture, detail routes, archives, essays, and project families.
- **Rendered-page inspection:** an automated Chromium pass measured desktop and
  compact layouts, computed styles, active animations, fixed and sticky layers,
  media, hover, focus, press, and reduced-motion behavior.
- **Source and text extraction:** Firecrawl and Exa extracted public markup,
  primary page copy, metadata, font and color declarations, and library docs.
- **Primary-source search:** Exa found creator-authored announcements, craft
  essays, interviews, public component repositories, and technical project
  writing that explain intent not visible in the DOM.

The repeatable DOM probe is retained in
[audit-reference-portfolio.js](../../../scripts/audit-reference-portfolio.js).
It prevents the numbers in this report from becoming undocumented visual
guesses.

## Coverage ledger

The status column describes this research pass, not the overall quality of a
site. “Strong” means the evidence is adequate for design synthesis. “Partial”
means a live manual revisit is required before copying a specific behavior.

| Reference | Public sources | Measured coverage | Status and limit |
| --- | --- | --- | --- |
| Nachi | [Home](https://www.nachi.design/), [creator launch note](https://www.linkedin.com/posts/nachiketa-tiwari_nachidesign-is-finally-live-just-me-activity-7490992791120920576-04bC) | Loader, base surface, font, cursor layer, media queries | **Partial:** completed project page did not render in the automated browser |
| Amaan | [Home](https://www.amaaan.in/), [Behance](https://www.behance.net/amaaan_designs) | Page length, font, color family, asset density, responsive regimes, links | **Strong for macro language;** individual project-media choreography needs manual video review |
| Rauno | [Home](https://rauno.me/), [Interaction design](https://rauno.me/craft/interaction-design), [Next.js craft](https://rauno.me/craft/nextjs), [Spaces interview](https://spaces.is/loversmagazine/interviews/rauno-freiberg), [UI Land interview](https://ui.land/interviews/rauno-freiberg) | Spatial canvas, minimap, fixed layers, focus, entrance, mobile, reduce mode | **Strong;** reduced-motion captures differed across viewports |
| Jakub | [Home](https://jakub.kr/), [Skills](https://jakub.kr/skills), [public skills repository](https://github.com/jakubkrehel/skills) | Column, type, cards, shadows, rows, links, focus, press, motion | **Strong** |
| Peter | [Home](https://www.petercsipkay.com/), [Three.js portfolio gallery article](https://www.petercsipkay.com/blog/threejs-portfolio-gallery) | Color, font, canvas count, controls, accordions, page length, reduce-mode query | **Strong for page system;** WebGL scene needs device-level visual review |
| NK Studio | [Home](https://www.nk.studio/), [Work](https://www.nk.studio/work), [Impact](https://www.nk.studio/impact) | Content chapters, page length, loader, control families, colors, type | **Partial for exact motion:** media and WebGL timings were not stable in automation |
| Lorenzo | [Home](https://lorenzocabra.xyz/), [Store](https://lorenzocabra.xyz/store) | Home content, framework metadata, color-scheme support, route archive, viewport metadata | **Partial for exact motion:** store transitions require a live manual pass |
| Jace | [Home](https://ja.mt/), [Work](https://ja.mt/work), [Words](https://ja.mt/words), [Lisse](https://ja.mt/work/lisse) | Palette, fonts, column, polaroids, stagger, hover, press, focus, responsive, reduce mode | **Strong;** some animations remained reported during reduced-motion emulation |
| Hamza | [Home](https://www.hamzaalabou.com/), [Odin](https://www.hamzaalabou.com/odin), [Inspekt](https://www.hamzaalabou.com/inspekt) | Dock, profile toggle, media preview, copy action, entrance, curves, fixed layers | **Strong** |
| Athrix | [Home](https://www.athrix.me/), [Projects](https://www.athrix.me/projects), [Designs](https://www.athrix.me/designs) | Controls, tabs, command trigger, ambient loops, media, fixed layers, reduce mode | **Strong** |
| Gareth | [Home](https://www.gareth.ng/) | Navigation, type, still and video inventory, document length, compact edit, animation absence | **Strong for home** |
| Noé | [Home](https://noechague-site.vercel.app/), [UI studies](https://noechague-site.vercel.app/ui), [Animated OTP](https://noechague-site.vercel.app/ui/animated-otp), [Drag card](https://noechague-site.vercel.app/ui/drag-card), [Shared-layout tabs](https://noechague-site.vercel.app/ui/shared-layout-tabs) | Column, card geometry, sampled easing, entrances, focus, cursor, reduce mode | **Strong** |
| Aniket | [Home](https://www.aniketpawar.com/), [Projects](https://www.aniketpawar.com/projects), [Crafts](https://www.aniketpawar.com/crafts), [Uses](https://www.aniketpawar.com/uses) | Type roles, navigation, content families, fixed utility, entrance sequence, reduce mode | **Strong for structure;** reduced-motion delivery needs a manual recheck |
| Cuelume | [Home and docs](https://cuelume-site.pages.dev/) | Cue inventory, attributes, API, controls, transitions, loops, pointer media queries, reduce mode | **Strong;** actual cue selection still requires listening tests |

## Route and architecture findings

The route crawl matters because the feeling of a portfolio often comes from how
its body of work is divided, not just from home-page styling.

### Craft libraries

Rauno, Jakub, Noé, and Aniket expose craft as a distinct content class. Rauno's
craft routes explain interaction principles and include sliders, tabs, menus,
and input experiments. Jakub separates components, skills, writing, and work.
Noé exposes UI studies. Aniket publishes projects, crafts, experience, uses, and
stats. These architectures make ongoing practice visible rather than hiding it
inside project case studies.

### Deep commercial archives

NK and Lorenzo expose much larger commercial bodies of work. NK divides work,
impact, studio, services, news, archive, and case studies, including localized
routes. Lorenzo's “Store” fans into many brand-specific project pages. Their
home-page minimalism or spectacle cannot be understood without that depth.

### Focused personal portfolios

Hamza exposes a small set of named project and essay routes. Gareth keeps the
home route as the primary media sequence. Nachi's public crawl returned only the
home route in this pass. These smaller graphs place more responsibility on the
home page's ordering and tone.

## Measurement notes

Browser measurements are rendered CSS pixels from public sites at the time of
the 2026-08-14 pass. They should be used to understand proportion and hierarchy,
not pasted as immutable tokens.

The desktop probe used a 1,440 by 1,000 viewport and the compact probe used 390
by 844. Those sizes were selected to expose a wide and narrow rendering of the
public pages during this research, not to define future product breakpoints.
Future breakpoints must come from the new portfolio's content collisions.

The audit grouped repeated interactive elements by tag, role, type, and class;
then sampled computed style before and during hover, focus, and pointer-down.
It also inspected the Web Animations API and readable stylesheet rules. Cross-
origin stylesheets that blocked `cssRules` access were skipped rather than
guessed.

## Reduced-motion interpretation

Emulation proves only what the delivered public page reported in the automated
browser. It does not replace a full accessibility audit, and running animation
objects can include zero-duration or visually inert effects.

The strongest captured response came from Noé, where long entrances collapsed
to near-zero timing. Athrix also removed the detected decorative loops. Peter's
home CSS exposed no detected reduced-motion media query. Jace, Aniket, and Rauno
returned results that need manual visual confirmation. Nachi declares a query,
but the completed site could not be reached.

For the new portfolio, reduced motion must be verified by visible outcome:
content is immediately available, orientation is preserved, ambient loops stop,
and no essential state is lost.

## Source-quality decisions

Primary sources were preferred over aggregators. Direct pages and published
creator writing support the atlas's concrete claims. Search-result snippets and
third-party showcases were used only for discovery unless the original page was
unavailable.

Nachi's launch note is particularly important because it records the author's
explicit goal of simplicity and non-flashy animation. Rauno's craft essays and
interviews explain the interaction principles visible in his site. Jakub's
public skills repository confirms that component craft is a deliberate public
artifact. Cuelume's own documentation defines its API and cue behavior.

## Known open evidence

The following claims remain intentionally open. They do not block the research
synthesis, but they do block exact reproduction of the named behavior.

- Nachi's post-loader home interactions and cursor need a successful live pass.
- NK's loader, cursor, scroll chapters, and case-study transition timings need
  manual video or device capture.
- Lorenzo's home-to-store and store-item transitions need manual capture.
- Peter's WebGL behavior needs a capable-device and reduced-motion visual pass.
- Cuelume's cue choices need listening tests on the devices used for the future
  portfolio.
- Jace, Rauno, and Aniket need a manual reduced-motion confirmation because the
  automation reported mixed results.

No unmeasured timing from these areas is used as a replication token in the
atlas.

## Research scale

The Exa pass reviewed seventy search results across per-site primary-source
discovery, creator and technical context, and sound-library implementation. The
Firecrawl pass mapped all fourteen public sites and performed deeper page or
source extraction where interaction or route evidence required it. Browser
inspection covered each reference at wide and narrow viewports, with the partial
exceptions recorded above.
