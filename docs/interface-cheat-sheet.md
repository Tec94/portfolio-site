# Interface cheat sheet

Use this checklist when you design, implement, or review interface details in
the portfolio. It collects practical guidance for visual quality, motion,
typography, color, accessibility, layout, and interface writing.

Source: [Interfaces.dev cheat sheet](https://interfaces.dev/cheat-sheet).

## User interface

Apply these rules to improve visual consistency and perceived quality.

- Use **concentric border radius** on nested elements.
- Align for **optical alignment**, not geometric alignment.
- Give images a `1px` outline, offset by `-1px`: black at `8%` opacity in light
  mode, white at `8%` in dark mode.

## Animation

Use motion to communicate interaction and state without adding unnecessary
distraction.

- Never use `transition: all`; name the **exact properties** that change
  instead.
- Slightly scale down buttons to a value between `0.95` and `0.98` when
  **pressed** with `transition: scale 200ms ease-out`.
- **Cross-fade** icons when they swap. The entering icon scales `0.25` → `1`,
  opacity `0` → `1`, and blur `4px` → `0px`. The exiting icon reverses the same
  animation.
- Use CSS transitions for interactions because they **can be interrupted**.
  Use keyframes for sequences that only run once.
- **Disable all transitions** when changing the theme from light to dark and
  vice versa.
- Use `will-change` only for properties that are actually changing:
  `transform`, `opacity`, and `filter`.
- When an **element shifts randomly** by 1–2px during animation, especially in
  Safari on iOS, add `will-change: transform` to the element.
- When animating an entrance, stagger elements by group or by individual
  elements.
- **Don't animate** high-frequency interactions, such as the color change of an
  item on hover in a list.

## Typography

Use typography to preserve readability, stable layout, and clear hierarchy.

- Always use `.woff2` on the web, never `.ttf` or `.otf`.
- Use `font-variant-numeric: tabular-nums` on **every value that changes** and
  in **tables**: timers, counters, prices, and data columns. Skip it if you
  already use a monospace font.
- Cap long-form text at **60–75 characters** per line.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on descriptions;
  use neither in long-form text.
- Use `overflow-wrap: break-word` where **long words, links, or IDs** can
  escape; use `white-space: nowrap` on labels and badges.
- Set `-webkit-font-smoothing: antialiased` and
  `-moz-osx-font-smoothing: grayscale` once on the root, never per component.
- Store copy in **natural case** and control the presentation with
  `text-transform`.
- Use **smart punctuation**: curly quotes, an en dash for ranges, an em dash
  for asides, and the single ellipsis character.
- Use `text-underline-position: from-font` with
  `text-decoration-skip-ink: auto` so underlines clear the descenders.
- Make the full value of **truncated text** reachable in a tooltip or an
  expanded view.

## Colors

Use semantic color decisions that remain clear across themes and rendered
contexts.

- Give **every step** in a color palette a purpose: page background, component
  hover, border, solid fill, or body text. Don't add steps that nothing uses.
- Components should use **semantic tokens** such as
  `--color-text-secondary`, never primitives such as `--blue-500`. The
  primitive is the raw value; the token is how the value is used.
- Never name a token for its **appearance or its first use**:
  `--color-accent-solid`, not `--color-blue-button` or
  `--color-sidebar-gray`.
- Reserve `accent` **for the brand color** so `primary` never means both the
  brand and the main body text.
- **Don't reuse a token from another role** just because it has the right
  color. When that role's color changes, your element changes with it, so add a
  token for the new role instead.
- Measure contrast against the background the element **actually renders on**,
  not the page background.
- A dark-mode palette **is not** the light palette reversed.
- Pick **one theme-switching mechanism**: `prefers-color-scheme` or a `.dark`
  class, and use it for every token.
- You can define a gradient's **interpolation space**: use `in oklab` for even
  brightness, `in oklch` for more vivid middle tones, or neither to fall back
  to sRGB with a classic muted midpoint.

## Accessibility

Treat semantic HTML, focus behavior, motion preferences, and status feedback as
part of the interface contract.

- Use semantically correct native elements: `<button>` for buttons and `<a>`
  for links. Never use a plain `<div>` when a native element works.
- Style `:focus-visible`; don't use `outline: none` without a replacement.
- Only use `tabindex="0"` and `tabindex="-1"`; positive values break the
  natural tab order.
- Give **icon-only buttons** a descriptive `aria-label`, and never put
  `aria-hidden="true"` on a focusable element.
- Write alt text by purpose: `alt="Search"` on a search button, not
  `alt="magnifying glass"`. Decorative images get `alt=""`.
- Give **every input** a real `<label>`, `type`, and `inputmode`.
- **Never block paste**; people paste passwords and one-time codes.
- A tooltip on a **disabled control** never opens for keyboard or touch. Put the
  explanation in visible text next to it, or use `aria-disabled="true"` to keep
  the control focusable.
- Keep submit enabled until the request starts, then validate on submit with
  `aria-invalid="true"`, `aria-describedby` pointing at the error, and focus on
  the first invalid field.
- Use at least a `24x24px` hit area, `44x44px` on touch, and `40x40px` on
  desktop where possible. Make sure **extended hit areas never overlap**.
- Use `pointer-events: none` on **decorative elements** such as glows and
  gradients so they never swallow clicks meant for a control.
- Put hover styling behind `@media (hover: hover)`. On touch, `:hover` sticks
  after a tap and looks selected.
- **Wrap motion** in `@media (prefers-reduced-motion: no-preference)` so it
  only plays for people who haven't asked to reduce it.
- Use `role="status"` for routine updates and `role="alert"` only for urgent
  errors.
- For status changes, add an icon, a label, or an underline. Status changes
  should **never use color alone**.
- Make sure the **skip-to-content link** is the first focusable element, and add
  `scroll-margin-top` on anchored headings.

## Layout

Use spacing and sizing rules that preserve hierarchy across screen sizes.

- The gap between groups is **at least twice** the gap inside one: `8px` within,
  `16px` or more between.
- Use **logical properties** such as `margin-inline-start` and
  `padding-inline-end` instead of left and right.
- Don't use **fixed widths or heights** on text containers.

## Writing

Use clear, consistent copy that tells people what an action does and where a
link goes.

- Start button labels with a **verb**: “Save draft” or “Delete project”, never
  “OK!” or a bare “Yes”.
- **Repeat the consequence** in confirmation buttons: “Delete project” next to
  “Cancel”.
- Pick **one word per flow** and keep it for every step: “Continue” or “Next”,
  never both.
- **Describe the destination** in link text: “Read docs”, never “Click here”.
- Capitalize buttons, headings, and labels the same way everywhere. Sentence
  case is the safer default.
- Label toggles with the state they turn on: “Send read receipts”, never
  “Disable read receipts”.
- **Orient the reader** in empty states and offer one next action instead of
  “No results”.
- Address the reader as **“you”**, not “the user”.
