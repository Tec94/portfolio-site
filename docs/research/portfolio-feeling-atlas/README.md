# Portfolio feeling atlas

This atlas records how the reference portfolios look, move, respond, and
organize attention. It is research, not a redesign specification. The working
hypothesis is that the preferred direction will use the warm, tactile restraint
of [Jace Things](https://ja.mt/) as its center of gravity, then borrow selected
behaviors from the other references after the owner's reactions are recorded.

## Research contract

The contract for this pass was a durable, source-backed account of all thirteen
portfolio references and Cuelume. It covers visual language, information
architecture, component anatomy, small and large interactions, responsive and
accessibility behavior, implementation clues, cross-site similarities, and a
replication-oriented synthesis. It intentionally makes no changes to the live
portfolio.

## How to read the evidence

Every concrete observation in this atlas belongs to one of four evidence
classes. This prevents a measured duration or a creator's stated intent from
being confused with an interpretation of the resulting feeling.

- **Measured** means inspected in the rendered DOM, computed CSS, browser
  animation API, responsive viewport, or public source markup.
- **Published** means stated by the designer, studio, project page, interview,
  or library documentation.
- **Inferred** means a design interpretation based on measured or published
  evidence. It is a hypothesis to test, not a claim about authorial intent.
- **Partial** means the public page could not be fully exercised in the
  automated browser or an interaction depended on unavailable device input,
  WebGL state, media playback, or a loading sequence.

The browser pass used desktop and narrow mobile viewports, hover, focus, press,
visible fixed and sticky layers, current animations, reduced-motion emulation,
media inventory, font and color extraction, and a public route crawl. Exa and
Firecrawl supplied page discovery, creator statements, primary text, and source
markup. The [evidence ledger](./evidence-ledger.md) records limits and provenance.

## The four feeling families

The references resolve into four useful families. Individual sites can belong
to more than one, but each family creates a different kind of confidence.

### Warm tactile editorial

This family treats a portfolio as a small, handled object rather than a neutral
database. [Jace Things](https://ja.mt/) is the clearest example: warm paper,
compact serif accents, tiny stacked photographs, restrained spring motion, and
press compression. Hamza Alabou's bottom dock and Noé Chague's tilted artifact
cards add related physical metaphors.

The feeling comes from material cues that are small enough to remain calm:
paper-colored surfaces, thin borders, miniature scale changes, rotation, and
shadows that imply objects resting on a surface. It feels personal without
becoming scrapbook-like.

### Quiet design-engineering documentation

This family makes precision itself the portfolio. Jakub Krehel, Noé Chague, and
Aniket Pawar use narrow reading columns, restrained palettes, systematic focus
states, component-like rows, and writing about interface craft. Their homepages
feel closer to beautifully typeset reference manuals than marketing pages.

The confidence is cumulative. No single animation needs to impress because
every radius, underline, shadow, control state, and line length suggests that
the author can finish a product.

### Spatial and cinematic spectacle

Rauno Freiberg, NK Studio, and Peter Csipkay use the viewport as a stage. Rauno
turns the page into a large spatial canvas with a minimap. NK builds a very long,
dark studio narrative. Peter uses saturated color, WebGL, and an extended
capability sequence. These sites create strong authorship through scale and
orientation rather than through dense conventional navigation.

The lesson is not simply to add large animation. Each system needs a spatial
model the visitor can understand: map and viewport, cinematic chapter sequence,
or immersive scene followed by legible content.

### Media-first archive

Gareth Ng, Lorenzo Cabra, Amaan, and parts of Nachi's positioning let work carry
the interface. Gareth is the most restrained example: spare navigation and a
long sequence of still and moving screens. Lorenzo splits a minimal identity
page from a broad store-like project archive. Amaan uses an extended brand and
motion catalog.

The resulting feeling is editorial confidence. Chrome recedes, typography acts
as framing, and motion usually lives inside the work rather than around every
link.

## Shared design grammar

Across very different aesthetics, the strongest references use a common
grammar. These are portable principles rather than components to copy.

- Content is the interface. The first screen begins demonstrating taste instead
  of explaining that taste in generic hero copy.
- High-frequency interactions are quiet. Hover, focus, and press usually change
  one or two properties and finish quickly.
- Large motion is reserved for orientation, storytelling, or a meaningful
  change of state.
- Physical metaphors are internally consistent. A polaroid compresses, a card
  settles, a dock behaves like a tool shelf, and a spatial canvas exposes a map.
- Metadata such as role, year, scope, and status gives projects the texture of
  an archive rather than a collection of promotional cards.
- Typography supplies most of the hierarchy. Color accents are sparse enough to
  preserve meaning.
- The site's own controls are evidence of craft. Focus rings, touch adaptation,
  reduced-motion handling, and loading behavior are part of the portfolio.

## Working synthesis for the rebuild

The current synthesis is deliberately provisional until the owner annotates
the references. Jace Things is the strongest candidate for the primary feeling:
warm, compact, tactile, and quietly playful. Jakub and Noé provide the best
precision layer; Gareth provides media restraint; Hamza provides a personal,
tool-like navigation metaphor; Rauno provides spatial ambition that should be
borrowed selectively. Cuelume can add a sparse audio layer to state changes.

The synthesis should not become a collage. A future design needs one material
world, one motion grammar, and one navigation model. Borrowed behaviors should
be translated into that world rather than reproduced with their original skin.

## Owner annotation worksheet

The next session should record reactions before any implementation begins. Free
text is more useful here than an invented rating scale.

For every site, answer:

- What moment, route, or component made the site feel right?
- What should the portfolio keep from it?
- What should the portfolio avoid from it?
- Was the appeal visual, behavioral, structural, emotional, or a combination?
- Did any motion feel excessive, slow, decorative, or disorienting?
- Where would sound strengthen the action, and where would it become noise?

For Jace Things in particular, identify whether the appeal comes primarily from
the warm material palette, miniature image stacks, narrow editorial structure,
typographic voice, restrained spring response, or the combination. That answer
will determine whether it is a surface reference or the foundation of the new
interaction model.

## Research artifacts

The research is divided by job so later design decisions can cite the smallest
relevant artifact.

- [Site dissections](./sites.md) records the anatomy and feeling of every
  portfolio.
- [Interaction index](./interaction-index.md) turns observed behaviors into a
  comparable component and motion vocabulary.
- [Sound design](./sound-design.md) maps Cuelume cues to meaningful portfolio
  events and records unresolved owner choices.
- [Evidence ledger](./evidence-ledger.md) records sources, inspection coverage,
  confidence, and limitations.
- [Browser audit helper](../../../scripts/audit-reference-portfolio.js) retains
  the repeatable public-page inspection used in this pass.

## Next steps

The next step is the owner's annotation pass. After those reactions are
captured, the research can be converted into a single design direction,
interaction principles, and a scoped implementation plan for the existing
portfolio checkout.
