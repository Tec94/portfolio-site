# Interaction index

This index turns the site-by-site observations into a comparable vocabulary. It
is intended for later design work: a component can be selected for the feeling
it creates, then translated into the portfolio's chosen material and motion
system.

## Macro-interaction models

The largest interaction decision is the visitor's model of movement. These
models are not interchangeable skins; each determines navigation, loading,
responsive behavior, and accessibility obligations.

| Model | References | What the visitor believes | Feeling | Replication burden |
| --- | --- | --- | --- | --- |
| Narrow editorial document | Jace, Jakub, Noé, Aniket | “I am reading and handling a personal notebook.” | Intimate, precise, calm | Low spatial complexity; high typographic and detail burden |
| Media filmstrip | Gareth, Amaan | “I am watching a curated body of work unfold.” | Confident, visual, unforced | Media optimization, sequencing, captions, playback control |
| Identity front door plus archive | Lorenzo, Nachi | “I meet the designer, then choose how deep to browse.” | Selective, fashion-editorial, intriguing | Clear mode shift and archive findability |
| Spatial canvas | Rauno | “I am locating objects inside a designed world.” | Exploratory, crafted, instrument-like | Minimap, focus order, mobile model, fallback document |
| Cinematic chapters | NK, Peter | “I am moving through a directed presentation.” | Immersive, authoritative, large-scale | Loading, media, scroll choreography, motion alternatives |
| Persistent tool surface | Hamza, Athrix | “This page is also an instrument I can operate.” | Personal, responsive, technically fluent | Safe areas, collision handling, state semantics, restraint |

The future portfolio should select one primary model. A secondary model can be
used inside a bounded feature, such as a spatial project overview inside an
otherwise editorial site.

## Surface and typography systems

Surface choices determine whether minimalism feels warm, clinical, cinematic,
or unfinished. The references use a few recognizable combinations.

| System | References | Ingredients | Similar to | Resulting feeling |
| --- | --- | --- | --- | --- |
| Warm printed matter | Jace | Warm off-white, brown ink, muted rules, sans plus optical serif | Small art book, contact sheet, archival label | Human, collectible, quiet |
| Neutral component manual | Jakub, Noé, Aniket | Near-white, charcoal, one accent, Inter or Geist, occasional serif/mono | API docs with editorial finishing | Exact, trustworthy, inspectable |
| Dark tool desk | Hamza, Athrix | Near-black, pale type, translucent capsules, compact controls | Desktop dock, command palette, lab console | Operable, personal, technical |
| Dark cinema | NK | Near-black void, large white type, full-bleed media | Title sequence, brand film, gallery installation | Expansive, dramatic, premium |
| Saturated immersive field | Peter | Electric blue, white type, WebGL, long capability sequence | Digital agency reel, interactive exhibition | Energetic, high capability |
| White gallery | Gareth, Amaan | White space, black framing type, media-led rhythm | Exhibition wall, fashion lookbook, filmstrip | Confident, art-directed |

The key distinction is material, not merely color. Jace's warm background works
because borders, image stacks, shadows, serif voice, and spring response all
behave like handled paper. Changing only the background would not reproduce the
feeling.

## Component anatomy matrix

This matrix indexes the components that most strongly affect perceived quality.
“Response” records measured behavior when available and otherwise names the
observable interaction without inventing a duration.

| Component | Reference | Anatomy | Response | Feeling analogy |
| --- | --- | --- | --- | --- |
| Stacked project preview | Jace | Three tiny bordered images, individual rotation, small shadow | 350 ms spring-like fan; 0.94 press compression | A handful of polaroids |
| Body polaroid | Jace | Warm border, image, optional side handle | 300 ms elastic hover; about 1.01 scale | Lifting a print from a table |
| Project row | Jace | Text label, metadata, miniature stack, quiet divider | 350 ms fade/blur; row and card stagger | A catalog entry assembling itself |
| Project card | Jakub | 16 px radius, multiple faint shadows, minimal text | Shadow change over 200 ms ease-out | A precision-machined sample tile |
| Inline link | Jakub, Noé | Text underline, low-color hierarchy | Underline color over 200 ms; 2 px focus outline | Editorial annotation with product rigor |
| Subscribe capsule | Jakub | 112 by 48 px, full radius | Active scale about 0.97 over 200 ms | A quiet physical switch |
| Spatial frame | Rauno | Large positioned media object inside fixed canvas | 350 ms entrance; scroll changes location | An exhibit in a floor plan |
| Minimap | Rauno | Fixed 191 by 18 px track with multiple markers | 200 ms tracker/surface response | A viewport navigator in a design tool |
| Copy-email tool | Rauno | Compact action with copy cursor | Strong focus outline and immediate clipboard intent | A tool, not a marketing button |
| Bottom dock | Hamza | 466 by 40 px translucent capsule, grouped utilities | 200 ms spring-like responses; late entrance | A desktop tool shelf |
| Profile art switch | Hamza | 80 px avatar with two visual states | Toggle with `aria-pressed` | Turning over a personal token |
| Project thumbnail | Hamza | 160 by 90 px media object, zoom cursor | Opens focused preview modal | A slide on a light table |
| Artifact card | Noé | White rotated card, 8 px radius, layered shadow | 450 ms sampled spring settle | A pinned prototype specimen |
| Command trigger | Athrix | Capsule or button with shortcut semantics | About 0.95 press scale, 300 ms settle | Opening a power-user launcher |
| Animated badge | Athrix | Compact status surface with rainbow/shine loop | Multi-second ambient loop; stops in reduce mode | A live lab indicator |
| Media frame | Gareth | Large still or muted looping video | Motion remains inside asset; chrome stays still | A filmstrip frame |
| Service accordion | Peter | Repeated 405 by 68 px row on desktop | About 300 ms color response and disclosure | A capability index |
| Layered text button | NK | Duplicate label layers inside clipped control | Rolling or reveal transition; timing unverified | A title-card splice |
| Store entry | Lorenzo | Project treated as edition or item | Mode change from sparse identity to archive | Browsing a design bookstore |

## Motion hierarchy

The references feel polished when timing reflects interaction frequency. A
visitor tolerates more choreography once on entry than on every repeated hover.

### Immediate physical response

Immediate response confirms the hand, pointer, or key has affected an object.
It should change the smallest useful set of properties.

- Jace compresses polaroids on press while keeping the surrounding row stable.
- Jakub compresses a capsule slightly and changes quiet shadows or underlines.
- Athrix uses very small social-button compression and a stronger command
  trigger compression.
- Hamza's dock tools respond through a fast spring-like curve.

These are examples of **squash and stretch** in interface form. The deformation
is slight, directional, and immediately reversible. It makes the object feel
tactile without turning the response into a flourish.

### Object settling

Settling response communicates material. Rotation, translation, and scale
should resolve as one object rather than as unrelated CSS properties.

- Jace's image cards fan and return using overshooting cubic Bézier curves.
- Noé's artifact cards use a sampled `linear()` curve that resembles a damped
  spring.
- Hamza uses a crisp exponential-looking curve for dock elements.

This is closest to **follow-through and overlapping action**. Inner cards can
lag the parent row, and decorative pieces can arrive after the primary object.
The lag is useful only when it explains composition.

### Entrance choreography

Entrances establish tone and hierarchy, then disappear from the interaction
budget.

- Jace assembles rows and miniature cards through short nested staggers.
- Hamza introduces content groups, then brings in the dock after the document.
- Noé uses a longer page entrance but collapses it under reduced motion.
- Rauno fades spatial frames after the canvas is established.
- NK makes loading and “Scroll to discover” part of the cinematic threshold.

The animation principle is **staging**: each sequence tells the visitor where to
look and what layer controls the experience. Stagger without hierarchy becomes
latency.

### Ambient and showcased motion

Ambient loops should prove something that a still state cannot.

- Gareth keeps loops inside project media, so they demonstrate the work.
- Athrix uses ambient rainbow and shine effects as live-component signals.
- Peter and NK use canvas or large media as environment, not button decoration.
- Cuelume loops waveform-like visualizations to teach sound character.

The safe rule is not “never loop.” It is that a loop must own a clear channel:
work demonstration, environment, or live status. Multiple channels competing in
the same viewport weaken focus.

## Input-state grammar

Every interactive object needs a state story across pointer, keyboard, touch,
and preference modes. The best references make those stories related without
making them identical.

| State | Purpose | Strong references | Transferable behavior |
| --- | --- | --- | --- |
| Rest | Establish affordance without noise | Jakub, Gareth, Jace | Shape, underline, or object metaphor communicates clickability |
| Hover | Preview consequence on fine pointers | Jace, Jakub, Hamza | One small lift, underline, shadow, or cursor change |
| Focus visible | Preserve orientation for keyboard use | Rauno, Jakub, Noé, Athrix | High-contrast outline independent of hover color |
| Active or press | Confirm physical input | Jace, Jakub, Athrix | Brief compression without layout movement |
| Selected | Expose persistent state | Hamza, Athrix, Cuelume | `aria-pressed`, selected chip, switch, or tab indicator |
| Loading | Explain a real wait | NK, Nachi, Cuelume | Progress or sound only when work is actually pending |
| Complete | Resolve asynchronous intent | Cuelume | Visual state first, optional semantic sound second |
| Disabled | Explain unavailability | Cuelume demos and controls | Preserve label and state contrast; no misleading hover |

Custom cursors appear in Nachi, Noé, Hamza, and possibly other art-directed
sites. They should be treated as an enhancement for fine pointers. The native
cursor, label, focus state, and touch behavior must still communicate the same
action.

## Navigation patterns

Navigation affects personality before any project opens. The references range
from nearly invisible framing to persistent application controls.

### Sparse header

Gareth uses name plus two destinations. Lorenzo uses identity details and two
strong directions. This is similar to an exhibition label: it frames the work
without becoming a product navbar. It works only when the content sequence is
obvious and the archive is not difficult to search.

### Content taxonomy

Jakub, Noé, and Aniket divide work into writing, components, skills, crafts,
experience, and related bodies of evidence. This resembles documentation
navigation. It makes range credible and lets visitors choose the kind of proof
they value.

### Persistent dock

Hamza centralizes frequent utilities in a fixed capsule. Athrix distributes a
similar application feeling across command, theme, and floating controls. This
resembles an operating-system dock or creator tool. It earns its space when it
reduces navigation distance and centralizes persistent state.

### Spatial locator

Rauno's minimap is both status and navigation. It resembles the viewport
overview in a canvas editor or game map. A spatial layout without a locator
would turn discovery into disorientation.

### Scroll chapter cue

NK and Peter use large scenes and long vertical sequences. A loader or “scroll
to discover” cue establishes that the viewport is a stage and that movement is
the primary control. This pattern must resolve quickly into visible progress and
ordinary access to content.

## Responsive transformations

The strongest mobile adaptations edit the interaction model rather than merely
shrinking it.

- Jace keeps the notebook measure nearly full-width and preserves the miniature
  object scale, so the tactile metaphor survives.
- Gareth removes a secondary writing link around 500 pixels to keep the header
  sparse.
- Hamza's persistent tool model requires safe-area and thumb-reach adaptation;
  the fixed desktop dimensions should not be copied literally.
- Rauno preserves the large spatial canvas on mobile, which makes its locator
  and reachability constraints more pronounced.
- Jakub and Noé maintain legible narrow columns and reduce artifact dimensions
  while preserving their proportion and shadow language.
- Peter's service controls contract in width while keeping a touch-appropriate
  row height.
- Amaan relies on Framer's desktop, tablet, and compact regimes to reflow a
  media-dense catalog.

A future responsive contract should specify what disappears, what changes
interaction, and what remains materially identical. Breakpoint values should be
derived from actual content collision, not copied from a reference.

## Accessibility and preference findings

Accessibility is part of the feeling because broken orientation or unexpected
motion makes even a beautiful interface feel unreliable.

### Strong patterns

Several references expose useful foundations. Jace includes a real skip link
and focus treatment. Jakub and Noé use crisp two-pixel focus outlines. Rauno's
copy and map controls receive unusually visible outlines. Hamza gives the avatar
switch an `aria-pressed` state. Athrix maintains focus rings and stops detected
decorative loops in reduced-motion mode. Noé collapses page entrances to a
near-zero duration under the preference.

### Gaps and cautions

The audit also found behaviors not to reproduce blindly. Lorenzo's viewport
metadata disables zoom. Peter exposed no detected reduced-motion CSS query on
the home page. Jace and Aniket still reported some animations in the emulated
reduced-motion state. Rauno's behavior differed between captures. Nachi's loader
did not complete in the automated browser.

These are scoped observations, not comprehensive accessibility audits. They are
enough to require independent reduced-motion, keyboard, touch, zoom, media, and
loading acceptance criteria in the future build.

## Replication-ready interaction recipes

These recipes preserve the underlying feeling while avoiding direct visual
copying. Exact values are included only where measured; final values should be
calibrated against the owner's content and the chosen system.

### Tactile project preview

Use a small cluster of real project frames, each with its own subtle rotation,
border, and shadow. Treat the group as one link. On fine-pointer hover, separate
the frames just enough to improve recognition. On press, compress the images
together without moving the text or surrounding layout. Give keyboard focus to
the link as a whole and expose the project title in its accessible name.

This combines Jace's polaroid physics with Jakub's focus discipline. It should
feel like selecting a physical sample, not like triggering a card hover preset.

### Quiet content row

Use title, short role or scope metadata, year or status, and an optional media
preview. Keep the resting background close to the page surface. Reveal
clickability through an underline, slight surface separation, or preview change.
Preserve a large contiguous target without wrapping unrelated nested controls.

This combines Jace's catalog rows, Jakub's documentation rhythm, and Amaan's
project metadata.

### Persistent utility tray

Group only actions that remain useful across routes: navigation overview,
theme, interface sound, copy contact, or search. Keep the tray visually quieter
than project content. On mobile, adapt to safe-area insets and avoid covering the
last content block. Announce toggle states semantically.

This translates Hamza's dock and Athrix's utility controls into a less dense,
warm editorial world.

### Media-first project sequence

Let stills and short muted videos carry the visual narrative. Keep captions
available without permanently overlaying the work. Autoplay only media that is
muted and nonessential, provide controls where timing conveys meaning, pause
offscreen work, and supply a static reduced-motion or data-saving path.

This preserves Gareth's restraint while meeting the performance and control
needs implied by Amaan, Peter, and NK.

### Optional project atlas

Expose a small overview that represents the visitor's position among projects.
Use it only if project arrangement has a meaningful spatial order. The ordinary
document and route list remain available, and focus order follows reading order
rather than visual coordinates.

This borrows Rauno's orientation principle without requiring the entire site to
be a fixed oversized canvas.

## Selection rule for the next phase

A component should enter the rebuild only if removing it would break the chosen
feeling, content task, or accessibility contract. Similarity to a reference is
not sufficient by itself. The owner's annotation pass will decide which feeling
is primary; implementation can then select the smallest coherent component set
that proves it.
