# Site dissections

These dissections describe each reference as a system: what a visitor sees,
what changes under input, what the structure communicates, and which details
create the overall feeling. Exact measurements are included where the public
page exposed them; interpretations are marked as such.

## Nachi Tiwari

[Nachi's portfolio](https://www.nachi.design/) positions a product designer
working with AI and technology founders. Its most important evidence is the
creator's own restraint: in the public launch note, Nachi said the goal was to
keep the portfolio simple and avoid flashy or “crazy” animation. That statement
is more reliable than treating a loading failure as evidence of the intended
site experience.

### Visual and structural anatomy

The automated browser reached a full-viewport near-black loading layer rather
than the completed page. The visible canvas measured approximately `#0a0a0a`,
used Inter, and included a fixed custom-cursor layer. Public metadata describes
the site as a designer portfolio based in India and built around work with AI
and technology founders. The delivered CSS includes a narrow-screen breakpoint
around 640 pixels and a reduced-motion media query.

The loader displays progress as a percentage. On the desktop probe it remained
at zero; the narrow probe exposed an invalid negative value. These are partial
observations from the automated environment, not intended aesthetic features.

### Interaction character

The strongest published interaction direction is negative space: motion should
not compete with the work. A custom cursor suggests some pointer-specific
feedback, but its completed behavior was not observable in this pass. No timing
or project transition should be copied from the blocked loader.

### Feeling and transferable lesson

The intended feeling is likely direct, current, and founder-facing rather than
theatrical. The useful lesson is editorial discipline: sophisticated work does
not require a spectacle layer. This reference should influence how much is
removed, not provide unverified animation recipes.

### Replication note

Carry forward the stated simplicity, compact founder-oriented positioning, and
reduced-motion intent. Revisit the live page manually before borrowing its
cursor, page transition, or loading behavior. The loader is marked **partial**
in the evidence ledger.

## Amaan

[Amaan's portfolio](https://www.amaaan.in/) is a long brand-and-motion catalog.
It frames the designer through finished identities and motion systems rather
than through an application-like shell.

### Visual and structural anatomy

The home page is generated with Framer and uses Poppins. Its base language is
white, black, and gray with a controlled red accent. The page is unusually rich
in visual assets: the browser found dozens of raster images and more than one
hundred inline SVGs. That density is the content, while the surrounding layout
stays comparatively plain.

The desktop page extends beyond 5,000 CSS pixels and remains long on mobile. The
project sequence includes RepLight, EcoBite, Seven Zero, Productive Screens, and
Garden Carton, with years, scope descriptions, and brand-system language. The
footer and auxiliary navigation point to a “coming soon” route, reinforcing the
work-in-progress character of the current build.

Framer supplies three principal responsive regimes: wide desktop, intermediate
tablet, and a compact layout below roughly 809 pixels. The public markup exposes
the generated structure more clearly than bespoke component semantics.

### Interaction character

The interaction hierarchy is dominated by scroll and embedded visual media.
The chrome does not try to out-animate the motion-design work. Where animation
appears, it reads as a portfolio specimen or project transition rather than a
permanent navigation gimmick.

This makes the distinction between interface motion and showcased motion
important. The surrounding interface is a gallery wall; the project assets are
allowed to be expressive.

### Feeling and transferable lesson

The page feels like an extended graduate show or brand archive: abundant,
graphic, and process-aware. Its confidence comes from volume and variety held
together by a simple typographic frame.

### Replication note

Borrow the separation between calm chrome and expressive work, the use of year
and scope as catalog metadata, and the willingness to let a long page accumulate
evidence. Avoid copying Framer's generated asset density or generic breakpoint
structure without a performance budget tied to the portfolio's real media.

## Rauno Freiberg

[Rauno's portfolio](https://rauno.me/) makes the page itself a craft demo. It is
the clearest spatial reference in the set and is supported by extensive writing
about interaction design and implementation.

### Visual and structural anatomy

The home screen uses a light gray canvas near `#ededed`, black and muted gray
type, a display family exposed as `X`, and small warm accent colors including
orange and yellow. Instead of a conventional centered document, the content
lives on a fixed 1,200 by 720 pixel spatial canvas. The browser viewport reveals
only part of that canvas and the larger scrollable world around it.

A small fixed indicator sits near the center of the viewport. A fixed minimap,
approximately 191 by 18 pixels in the measured desktop view, sits at the top and
contains multiple trackers. Large linked frames occupy positions far beyond the
initial viewport. Email copy and external social actions are treated as tools
inside the world rather than as a footer afterthought.

On a 390-pixel mobile viewport, the same spatial canvas remains larger than the
screen and is shifted beneath it. That preserves the concept but makes the map
and orientation aids essential rather than decorative.

### Interaction character

The visible frames use a 350-millisecond entrance named `index_fadeFrames`, with
an 800-millisecond delay in the default desktop capture. The minimap changes
background and border over 200 milliseconds with an ease-in-out curve. Opacity
changes occur without the same delay, making the locator feel responsive while
its surface catches up.

The email control advertises a copy cursor. Focus is not an afterthought: the
browser measured a prominent four-pixel outline on the copy action and a
two-pixel outline on minimap controls. The reduced-motion probe removed or
shortened part of the initial entrance on desktop; mobile results were not fully
consistent and are therefore not treated as a complete motion-accessibility
contract.

Rauno's published craft notes explain the deeper logic. Interactions should
respond fluidly to intent, preserve momentum, use meaningful metaphor, and
consider frequency and novelty. His Next.js craft page also recommends animating
opacity and transforms instead of expensive shadows, maintaining consistent
focus rings, and using masks, gradients, and fluid type with restraint.

### Feeling and transferable lesson

The site feels like navigating a designed instrument or exhibition plan. The
visitor is not simply scrolling through cards; they are locating objects in a
world. The minimap makes exploration legible, while the tiny tracker motion
provides a continuous sense of agency.

The transferable lesson is not “make the page horizontal.” It is that ambitious
motion needs a coherent model, persistent orientation, and controls that make
the model learnable.

### Replication note

Borrow spatial confidence selectively: a project atlas, preview rail, or
overview map could create discovery without turning every route into a large
canvas. If the full spatial model is considered, keyboard navigation, focus
visibility, mobile reachability, reduced motion, and an ordinary document
fallback become part of the core design.

## Jakub Krehel

[Jakub's portfolio](https://jakub.kr/) is a precise, quiet design-engineering
reference. Its visual restraint makes component quality, writing, and subtle
state feedback the primary evidence of skill.

### Visual and structural anatomy

The page uses a near-white background around `#fcfcfc`, Inter Variable at a
16-pixel body size, and Libre Baskerville for selective editorial accents. The
desktop reading column is approximately 660 pixels wide; the narrow layout
contracts to roughly 342 pixels. There is no ornamental color system competing
with content.

Project cards measured approximately 314 by 236 pixels on desktop. They use a
16-pixel corner radius and multiple very soft shadow layers rather than one dark
drop shadow. Textual content rows are roughly 660 by 72 pixels on desktop and
358 by 94 pixels on the mobile probe, also with 16-pixel rounding. The geometry
is consistent enough to make the page feel assembled from a small, trusted set
of primitives.

The information architecture is explicit: work, writing, components, and
skills. Public component and article routes include motion gestures, shared
layout animation, drag gestures, clip-path buttons, an infinite card stack,
animated icons, gradients, shadows, and shader experiments. The portfolio is
both an archive and a reference manual.

### Interaction character

Card shadow response uses a 200-millisecond ease-out transition. Inline link
underlines change color over the same general duration. Keyboard focus produces
a visible two-pixel outline with a small two-pixel radius, preserving the crisp
type-led aesthetic.

The subscribe pill is approximately 112 by 48 pixels with a fully rounded
capsule shape. It compresses to a 0.97 scale while active and returns over a
200-millisecond ease-out transition. The interaction is tactile but does not
change layout or introduce novelty.

No continuing animation was detected on the home page after load, including in
the reduced-motion probe. Motion lives where a component or article needs to
demonstrate it.

### Feeling and transferable lesson

The page feels dependable, inspectable, and optically finished. It resembles a
well-made component documentation site with the warmth of a personal notebook.
Confidence comes from accumulated small decisions: line length, link state,
shadow falloff, button compression, and a clear content taxonomy.

### Replication note

Borrow the narrow measure, quiet surface hierarchy, semantic content families,
consistent focus language, and single-property micro-responses. Do not merely
copy the off-white palette; without the same density of finished details it
would read as unfinished rather than restrained.

## Peter Csipkay

[Peter Csipkay's portfolio](https://www.petercsipkay.com/) presents front-end,
Three.js, and AI work as an immersive capability narrative. It is a useful
counterpoint to the quieter references because its confidence comes from
spectacle and length.

### Visual and structural anatomy

The initial visual field uses a saturated blue close to `#2962f6`, white and
near-white content, dark contrast text, and PP Neue Montreal in regular and
medium weights. The headline explicitly combines front-end development,
immersive 3D experiences, and AI-driven solutions.

The desktop document exceeded 6,900 CSS pixels in the browser capture and the
mobile composition exceeded 11,000. Two canvas elements support the immersive
presentation. The remaining page expands into projects, services, and a dense
taxonomy of capabilities rather than ending after one WebGL scene.

A small “Visit Site” capsule measured approximately 97 by 33 pixels with an
effectively full radius. The service area repeats dozens of wide accordion-like
controls, approximately 405 by 68 pixels on desktop and 310 by 68 pixels in the
narrow capture.

### Interaction character

The small capsule uses a 150-millisecond transition with a common
`cubic-bezier(0.4, 0, 0.2, 1)` curve. Service controls change color over roughly
300 milliseconds. The repeated accordion behavior creates rhythm after the
high-impact scene and turns a long capability list into progressive disclosure.

The browser did not detect a reduced-motion media query in the delivered CSS,
and timed transitions remained under reduced-motion emulation. That observation
does not prove every WebGL path ignores the preference, but it is a gap to avoid
replicating.

### Feeling and transferable lesson

The experience feels like an immersive developer studio rather than a quiet
individual résumé. Saturated color and dimensional media establish authority
immediately; the extended text sequence then makes the spectacle credible.

### Replication note

Borrow the idea of pairing one memorable high-fidelity moment with sober
evidence afterward. Do not borrow the page length, 3D layer, or service volume
unless the portfolio's actual content and performance constraints justify them.
Any WebGL-led direction needs a reduced-motion and low-capability alternative.

## NK Studio

[NK Studio](https://www.nk.studio/) is the broadest studio reference. It uses a
cinematic, near-black page to turn case studies, impact, culture, services, and
news into a single brand world.

### Visual and structural anatomy

The base canvas is near black around `#070b0a`, with warm near-white around
`#fdfdf9` and DM Sans. The measured desktop home page extended beyond 22,000 CSS
pixels. This scale is structural: the home route behaves as a sequence of brand
chapters rather than as a short project index.

The opening language is “We empower brands to inspire people.” It proceeds
through projects such as Pomelo, untold, and Vista Energy, then impact metrics,
culture stories, services, a map, news, and a final call to action. Public route
discovery exposes a full studio architecture: work, impact, services, archive,
news, studio information, and deep case-study routes in more than one language.

The initial layer includes a percentage loader and a “Scroll to discover” cue.
Buttons commonly contain duplicated text or layers, consistent with clipped or
rolling label transitions. Large project media and section-level transitions
carry more of the experience than small decorative icons.

### Interaction character

The site uses scroll as a cinematic transport between chapters. Large media,
dark space, loader state, and repeated label layers imply choreographed reveals
and text replacement rather than a static long document. The available browser
pass confirmed the enormous scroll narrative and control families but did not
produce reliable per-transition timings for the WebGL and media choreography.

This reference is therefore strongest at the macro-interaction level: staged
entry, chapter sequencing, large-media focus, and a decisive final invitation.
Its exact cursor, loader duration, and case-study transitions should be
re-inspected live before implementation.

### Feeling and transferable lesson

NK feels like entering an agency's cinematic identity system. The darkness,
long form, and large work modules make the studio feel bigger than a list of
projects. Repeated metrics and culture sections also broaden the definition of
proof beyond visual output.

### Replication note

Borrow chapter-level pacing and the use of one strong action at the end of each
narrative unit. Avoid importing studio-scale content volume into a personal
portfolio. A personal adaptation would need fewer chapters and more intimate
voice while preserving the decisive transitions.

## Lorenzo Cabra

[Lorenzo Cabra's portfolio](https://lorenzocabra.xyz/) combines an extremely
minimal identity page with a deep, store-like archive of visual projects. It is
useful for separating a memorable front door from a much broader body of work.

### Visual and structural anatomy

The home content is compact: current time, Georgia, awards, services, social
links, a direct “Let's talk” action, and a route labeled “Store.” The public
route map reveals the scale hidden behind that entrance, with project pages for
Maison Margiela, Damir Doma, Zara, Yohji Yamamoto, Aesop, Acne Studios,
Jacquemus, Polestar, Nike, Tesla, and other brands.

The page is Framer-generated and declares both light and dark color-scheme
support. The delivered viewport metadata disables user scaling with
`maximum-scale=1` and `user-scalable=no`; that is an accessibility behavior to
remove in any replication.

The “Store” naming is not cosmetic. It reframes projects as collectible visual
objects and makes the archive feel more like browsing editions than reviewing
case-study cards.

### Interaction character

The home screen's restraint makes each route change carry unusual weight. Time
and location supply a live presence signal, while the broad store route supplies
discovery. Framer provides responsive and transition infrastructure, but exact
hover and route timings were not stable enough in the automated pass to record
as reusable measurements.

The macro-interaction is the contrast between modes: sparse identity card first,
rich archive second. That shift creates curiosity without a complex first-screen
animation.

### Feeling and transferable lesson

The portfolio feels like a fashion or art-edition index. The visitor encounters
a person and place first, then a surprisingly deep inventory. Luxury comes from
withholding, naming, and curation rather than ornamental UI.

### Replication note

Borrow the two-mode contrast, real-time presence detail, and alternative archive
vocabulary if they fit the owner's voice. Do not copy zoom-blocking viewport
metadata. Confirm the precise store interaction manually before treating it as
a motion reference.

## Jace Things

[Jace Things](https://ja.mt/) is the strongest stated preference and the most
coherent warm-tactile system in the reference set. Its emotional effect can be
traced to repeatable material, typographic, and motion decisions.

### Visual and structural anatomy

The light theme uses a warm paper background near `#faf6f2`, brown primary ink
near `#432818`, muted surface or rule color near `#dad0ca`, and secondary text
near `#73574a`. Inter Variable carries the interface, while TF Exposure Variable
adds a small editorial serif voice. The base size is 16 pixels and desktop
section headings are close to 20 pixels.

On desktop, the main column is approximately 510 to 550 pixels wide and centered
with generous side space. On a 390-pixel viewport, the content becomes a nearly
full-width 350-pixel column. This is narrow enough to feel like a notebook while
remaining large enough for side-by-side metadata and image clusters.

The custom Jace wordmark is an SVG, not plain text. Work rows pair concise type
with a stack of three miniature images. Individual stack cards measured roughly
57 by 32 pixels, with a warm white border around 2.8 pixels and a very small
shadow. Per-card rotation variables keep the stacks related but not identical.

The route system is richer than the home page suggests: work and words indexes,
projects including Lisse, Pi2Day, Browser Company, Bundles, app icons, Figma
resources, and essays. Visible home rows use role-based interactive wrappers,
while hidden semantic links and landmarks support indexing and navigation. A
real skip link and visible focus treatment are present.

### Interaction character

The image stack is the core tactile primitive. Stack cards transition over
350 milliseconds using a spring-like
`cubic-bezier(0.34, 1.4, 0.64, 1)`. A related body-polaroid curve uses a slightly
more elastic `cubic-bezier(0.34, 1.56, 0.64, 1)` over 300 milliseconds. Hover can
raise the scale to approximately 1.01 and nudge rotation. Pressing a work entry
compresses its polaroids to approximately 0.94.

Entrance motion is a 350-millisecond fade-and-blur sequence. Rows are staggered
by approximately 65 milliseconds. Polaroids inside a row are offset by roughly
half that interval and begin after an additional short delay, which makes the
stack assemble instead of appearing as one rigid object. Image blur placeholders
resolve over approximately 200 milliseconds.

Dividers fade over 350 milliseconds. Side resize handles reveal through a
200-millisecond ease-out opacity change. The active feedback is immediate enough
to feel physical even though the assembly entrance is more leisurely.

The public CSS contains reduced-motion handling, but the browser still reported
some running animations under emulation. Treat the site as evidence of a good
motion vocabulary, not as proof that every delivered path fully honors the
preference.

### Feeling and transferable lesson

The experience feels like leafing through a small, carefully printed portfolio.
Images behave as objects rather than rectangles in a grid. Brown ink and warm
paper remove the clinical tone common to minimalist product portfolios. The
motion is charming because it reinforces the material metaphor and stops.

The narrow column also creates conversational proximity. Projects do not feel
like corporate case-study cards; they feel like things a person is handing over
for inspection.

### Replication note

This is the best candidate for the new portfolio's emotional nucleus. Translate
the system rather than cloning its exact cards: establish one warm material
palette, one small editorial serif accent, one physical preview object, and one
spring family. Preserve the hierarchy in which press is faster and firmer than
entrance assembly. Keep real links, skip navigation, focus visibility, and a
fully tested reduced-motion mode.

## Hamza Alabou

[Hamza Alabou's portfolio](https://www.hamzaalabou.com/) combines a restrained
dark document with a persistent bottom tool dock. The result feels personal and
operational at the same time.

### Visual and structural anatomy

The base canvas is near `#111111`, with Inter around 14 pixels. Content is grouped
under work, experience, thoughts, photography, and toolbox rather than forced
into a single case-study pattern. An 80-pixel profile image can switch to NFT
art and exposes its state through `aria-pressed`.

On desktop, a fixed bottom dock measured approximately 466 by 40 pixels and sat
24 pixels above the viewport edge. Its translucent white surface is very faint,
around eight percent opacity, and its radius is effectively full. Copy-email and
coffee actions use compact capsules. Project thumbnails are small landscape
objects, approximately 160 by 90 pixels, with a zoom-in cursor and preview-modal
behavior.

The dock collects navigation, theme, and utility actions into a tool shelf. A
back-to-top action appears alongside the persistent system rather than as an
unrelated floating control.

### Interaction character

The initial page uses a 650-millisecond upward fade. Content groups arrive in
small increasing delays, beginning around 50 milliseconds and continuing in
roughly 40-millisecond increments. The dock follows later, around a
450-millisecond delay, so the document establishes itself before the persistent
tool layer arrives.

Dock icons use a 400-millisecond pop. Decorative bloom and moon elements extend
that sequence slightly. A hand-drawn circle animation runs for about 900
milliseconds after a later delay. These expressive moments are concentrated at
entry rather than repeated on every scroll.

Dock and button transitions use a crisp, spring-like
`cubic-bezier(0.23, 1, 0.32, 1)` over roughly 200 milliseconds. Social transforms
are quicker at around 160 milliseconds. The hierarchy is effective: slow entry,
quick tool response.

The site declares reduced-motion handling. It also supplies state semantics for
the profile switch, visible button structures, and separate theme behavior.

### Feeling and transferable lesson

The page feels like a designer's desktop: a calm document above a small tray of
frequently used tools. The mix of work, thoughts, photography, and toolbox makes
the person legible beyond a job title. The dock provides identity without
requiring a large logo or hero.

### Replication note

Borrow the hierarchy of personal content and the idea of one persistent tool
surface. If a dock is used, it should contain genuinely frequent actions and
adapt carefully to mobile safe areas. Avoid adding a dock solely as decoration;
its value comes from replacing scattered utilities.

## Athrix

[Athrix](https://www.athrix.me/) is the most explicit component-playground
reference. It combines a technical portfolio with the density and feedback of a
modern application shell.

### Visual and structural anatomy

The page uses a near-black background around `#0a0a0a`, Inter and Geist for the
interface, and Instrument Serif for contrast. Projects, achievements, designs,
proof of work, and pricing are treated as navigable content families. Tabs,
project cards, social buttons, a command-palette trigger, theme controls, and
fixed action groups make the page feel continuously operable.

The mobile page exceeded 4,200 CSS pixels. The delivered page includes numerous
SVG assets and several muted looping videos that did not autoplay in the audit
environment. Fixed controls sit near the bottom-right while a soft bottom fade
helps the mobile control layer separate from scrolling content.

The component language resembles a carefully customized utility-component
system: capsules, tabs, focus rings, muted glass surfaces, and small animated
badges. Rainbow, shine, and line-shadow keyframes create a more energetic layer
than the quiet editorial references.

### Interaction character

Social controls compress to approximately 0.99 over about 50 milliseconds. The
command-palette trigger can compress to roughly 0.95 and settles over a longer
300-millisecond response. Tabs transition color over approximately 500
milliseconds. Rotating accents use a four-second loop with a faster
700-millisecond hover variant; pulse loops run near two seconds.

The long-running decorative keyframes include rainbow, shine, and line-shadow
effects. In the browser audit, reduced-motion emulation removed the active
decorative animations, which is a good boundary between content state and
ambient effect. Controls retain detailed focus rings rather than relying on
color alone.

### Feeling and transferable lesson

Athrix feels like exploring a developer's component lab. There is always another
control, panel, badge, or route to try. The density communicates fluency with
contemporary front-end systems, though it is less meditative than Jace Things,
Jakub, or Gareth.

### Replication note

Borrow the command-palette utility, explicit focus system, and reduced-motion
boundary if those match the owner's workflow. Avoid importing every glowing or
looping effect. The new portfolio needs a defined novelty budget derived from
the chosen feeling, not the full component inventory of this reference.

## Gareth Ng

[Gareth Ng's portfolio](https://www.gareth.ng/) is the purest media-first
reference. It demonstrates how little interface is needed when the sequence of
screens is strong.

### Visual and structural anatomy

The page uses Geist Variable, a white canvas, black primary type, and muted text
around sixty-percent black. Navigation is extremely sparse: a name at the upper
left and “Screens” and “Writing” at the right. On compact screens, writing is
hidden at a breakpoint near 500 pixels, preserving a small header rather than
wrapping it.

The measured desktop document exceeded 8,400 CSS pixels; the mobile composition
was roughly 5,600. The page contained a sequence of still images and three muted,
autoplaying, looping videos. The media fills the narrative role that cards,
accordions, or project summaries play on other sites.

No CSS keyframes, active interface animations, or elaborate control families
were detected on the home page. The page behaves as a filmstrip or contact
sheet, with typography framing the sequence.

### Interaction character

Most motion is inside the work. Scrolling advances the visitor through a curated
media edit; the navigation does not animate merely to announce itself. The lack
of interface movement makes every embedded video more noticeable and prevents
motion competition.

The mobile adaptation removes secondary navigation before adding new chrome.
That is a form of responsive editing, not just resizing.

### Feeling and transferable lesson

The page feels confident, visual, and editorial. It trusts the visitor to read
the images and does not add explanatory UI around each frame. The long sequence
resembles a designer's reel translated into a web document.

### Replication note

Borrow the rule that showcased work can own the motion channel. Use typography
and whitespace as the gallery architecture. If context is needed for the
owner's projects, reveal it on demand or on detail routes instead of covering
every preview with persistent labels.

## Noé Chague

[Noé Chague's portfolio](https://noechague-site.vercel.app/) combines Jakub-like
design-engineering precision with more visibly playful artifact cards. It is a
useful bridge between quiet documentation and tactile personality.

### Visual and structural anatomy

The base canvas is near `#fcfcfc`, with Inter, dark text around `#202020`, and a
controlled electric-blue accent. The centered desktop column is approximately
660 pixels wide. Content is grouped into contributions, writing, events, and
elsewhere, making community and thinking first-class evidence.

Seven preview buttons appear as small white artifact cards. On desktop they
measured around 161 by 187 pixels; in the narrow layout they contracted to about
81 by 95 pixels. An eight-pixel radius, layered shadow, and small rotations make
them feel placed rather than rendered in a strict grid.

The route map includes hands-on UI studies such as animated one-time-password
input, draggable cards, and shared-layout tabs. The portfolio therefore links
its visual language to inspectable interaction experiments.

### Interaction character

Inline underline response uses a 200-millisecond ease-out transition. Focus is a
visible two-pixel outline with a small radius, consistent with the precise type
system. Some interactive links hide the native cursor to support a custom
pointer treatment; that behavior requires an equivalent touch and keyboard
signal in any adaptation.

Artifact cards settle under active and focus states through a custom, sampled
`linear()` easing lasting roughly 450 milliseconds. The curve behaves like a
spring without relying on a generic browser ease. Page sections enter over about
900 milliseconds with staggered delays that extend from the initial content to
later groups.

Under reduced-motion emulation, entrance durations and delays collapse to about
0.01 milliseconds. This preserves final state and document order while removing
the visible choreography.

### Feeling and transferable lesson

The site feels like a clean research notebook with a few physical specimens
pinned to it. Playfulness is localized in the artifact previews; typography and
content organization remain sober. That containment prevents personality from
reducing legibility.

### Replication note

Borrow the localized artifact metaphor, sampled spring response, and robust
reduced-motion collapse. Keep the custom cursor only if it communicates preview
state and is backed by ordinary cursor, focus, and touch behavior.

## Aniket Pawar

[Aniket Pawar's portfolio](https://www.aniketpawar.com/) presents work,
experiences, crafts, tools, and stats through a polished technical-document
language. It shares the quiet component lineage of Jakub and Noé but exposes
more résumé and utility structure.

### Visual and structural anatomy

The page uses a white base with Geist, Instrument Serif, and Geist Mono. A
centered reading column organizes projects, crafts, and experience. Navigation
uses grouped dropdown triggers rather than placing every route in a wide header.
A fixed scroll-to-top action supports the longer document.

Public routes include projects, crafts, experiences, uses, and stats. Craft
entries such as a CRUD dialog and a Founder's Letter turn small interface and
editorial ideas into standalone proof. The mixture of serif, sans, and mono
assigns different voices to narrative, interface, and metadata without relying
on color.

### Interaction character

The measured home build uses a section entrance around 600 milliseconds with
successive delays across the primary content groups. The exact sequence begins
after the first content and extends through later project and experience blocks.
Under reduced-motion emulation, some entrance animations were still reported by
the browser, so the delivered behavior should not be copied as an accessibility
reference without a fresh manual check.

Dropdown navigation, fixed return control, and small craft routes make the page
feel more application-like than a simple essay index, but the effects remain
subordinate to content. The serif and mono voices provide much of the perceived
state change.

### Feeling and transferable lesson

The portfolio feels like a polished technical résumé that has been decomposed
into useful components. It communicates range without the cinematic scale of NK
or Peter and without the ambient loops of Athrix.

### Replication note

Borrow the separate crafts taxonomy, typographic role assignment, and compact
utility navigation. Rebuild entrance motion with an explicit reduced-motion
contract rather than reproducing the observed delivery verbatim.

## Comparative conclusion

The references do not converge on a single layout. They converge on behavioral
coherence: each successful site chooses a world and makes its smallest controls
obey that world's physics.

Jace Things uses paper objects, Jakub uses finished documentation, Rauno uses a
map, Hamza uses a tool dock, Gareth uses a filmstrip, and NK uses cinematic
chapters. The future portfolio should choose one primary metaphor, then translate
borrowed details into it. That is the reliable path to reproducing the feeling
without reproducing another designer's identity.
