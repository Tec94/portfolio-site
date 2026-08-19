# Sound design with Cuelume

> **Decision status:** The owner selected Cuelume at 22 percent, enabled sound
> by default with a persistent mute preference, the Zen typing set, Whisper for
> expansion, and normalized paper sounds for media and page transitions.

[Cuelume](https://cuelume-site.pages.dev/) can add a material response layer to
the portfolio, but only if sound remains semantic and sparse. The goal is not to
sonify the page. It is to let a few meaningful actions acquire the same tactile
confirmation that scale, shadow, and motion already provide.

## Library anatomy

Cuelume is an ESM-only Web Audio library with no runtime dependencies. Its
public documentation exposes seventeen generated cues, a delegated binding
system, direct playback, global volume, and global enable state. The library is
designed to avoid a folder of audio assets and is safe to import in an
SSR-capable application.

The documented API includes:

```ts
bind(root?)
play(name?, { volume? })
setVolume(value)
setEnabled(value)
```

`bind()` is idempotent and uses delegation, so dynamically added elements can
participate without being rebound one by one. Attribute-driven defaults map
hover to `pointerenter`, press to `pointerdown`, release to `pointerup`, and
toggle to `click`. Touch input resolves hover-style bindings through tap rather
than pretending a persistent hover state exists.

Fresh browser sessions block Web Audio until the visitor performs a qualifying
gesture. The portfolio therefore cannot promise an arrival cue before the audio
context has been unlocked. Audio initialization belongs inside the first real
interaction or an explicit sound preference control.

## Cue inventory

The library exposes the following cue names. Their names communicate the
intended semantic family, but final selection must be made by listening on the
target devices; this research does not infer an acoustic envelope that was not
published or auditioned.

| Cue | Published semantic signal | Candidate portfolio event |
| --- | --- | --- |
| `chime` | General bright notification | Deliberate preview reveal, if auditioned as subtle enough |
| `sparkle` | Light decorative confirmation | Rare delight moment after discovering a hidden detail |
| `droplet` | Small discrete contact | Optional alternative for a tactile media preview |
| `bloom` | Expansion or reveal | Opening a project atlas or an expanded artifact |
| `whisper` | Quiet low-priority signal | Gentle contextual reveal, subject to audibility testing |
| `tick` | Small navigation or step | Moving between discrete preview items |
| `press` | Input-down confirmation | Pointer or key activation on a tactile control |
| `release` | Input-up confirmation | Completing the same press cycle |
| `toggle` | Binary preference change | Theme, interface sound, or view-mode switch |
| `success` | Successful operation | Contact copy or completed asynchronous request |
| `error` | Failed operation | Failed copy or recoverable request error |
| `page` | Page or document change | Client-side project transition after audio unlock |
| `loading` | Work in progress | A real asynchronous wait with visible loading state |
| `ready` | Pending work is usable | Completion of the same loading state |
| `pulse` | Repeating or live state | Only a visible ongoing process that needs attention |
| `scan` | Search or inspection | Search or command-palette query activation |
| `arrival` | Destination entered | First meaningful route arrival after audio unlock |

The candidate column is an audition list, not a mandate. A visual state must
remain complete without its cue.

## Semantic event map

Sound should attach to the event the visitor understands, not to an arbitrary
DOM event. The same semantic event can be triggered by pointer, keyboard, touch,
or assistive technology without producing multiple overlapping cues.

| Portfolio event | Visual response | Candidate sound | Guard condition |
| --- | --- | --- | --- |
| Project preview becomes intentionally active | Stack fans or media resolves | `tick`, `droplet`, or no sound | Fine-pointer entry or explicit focus movement; do not retrigger during pointer jitter |
| Tactile button goes down | Small scale compression | `press` | One cue for the input cycle |
| Tactile button commits | Scale returns and action fires | `release` or action-specific result | Do not layer release and success unless both remain perceptually distinct in testing |
| Preference changes | Switch or selected state updates | `toggle` | State actually changed |
| Contact value copied | Label changes to confirmation | `success` | Clipboard operation resolved successfully |
| Copy fails | Error message appears | `error` | Recoverable failure is visible and announced |
| Project route changes | Shared context or page transition | `page` | Client navigation completed and audio already unlocked |
| Search opens | Command or search surface appears | `scan` | Open state changed from false to true |
| Real data or media wait starts | Visible progress begins | `loading` | Delay is real, not an artificial animation |
| Waiting content becomes usable | Progress resolves to content | `ready` | Paired loading state completed |
| Hidden craft detail is discovered | Local flourish resolves | `sparkle` or no sound | Rare, user-initiated, and nonessential |

Passive scroll, automatic marquees, pointer movement across text links, and
ambient background animation should remain silent. Sound on every hover would
turn the page into a sample pad and erase the calm editorial feeling.

## Interaction pairing with the visual system

The strongest pairing is causal: audio, motion, and visual state begin from the
same semantic transition. The sound should not trail a control because a CSS
timeout happens to have finished.

### Tactile project stack

When a project stack becomes active, the images can separate through the chosen
spring and a very small navigation cue can mark the newly active item. Repeated
pointer entry caused by card overlap must coalesce into the same semantic state.
Press and release sounds, if retained after audition, belong to the whole project
link rather than each image.

This pairing translates Jace's physical polaroid response into audio without
making the images sound like literal paper. The sound confirms selection; the
visual metaphor carries the material identity.

### Utility tray

A persistent tray can expose the sound preference alongside theme, search, and
contact. Toggling sound is the clearest place to play a demonstration cue because
the visitor has explicitly requested audio. The control needs visible text or an
accessible label, selected state, and stored preference.

The implemented preference begins enabled and keeps a durable mute control.
Browser audio unlock still requires a qualifying visitor gesture, so the site
does not promise an unsolicited arrival cue on initial load.

### Project navigation

A route cue can bridge a client-side transition when the visual context changes
substantially. It should fire once, after navigation has committed, and should
not compete with project video audio. Back and forward navigation should use the
same semantic path so browser history does not feel broken.

### Async outcomes

`loading`, `ready`, `success`, and `error` belong only to actual system states.
Each needs a visible equivalent and, where applicable, a live-region or status
message. Sound is redundant confirmation, never the only error or progress
channel.

## Control and preference contract

The portfolio needs an adapter around Cuelume so library calls cannot spread
through presentational components. The adapter owns preference, audio-context
readiness, event coalescing, and semantic names.

A future adapter should expose portfolio events such as:

```ts
type PortfolioSoundEvent =
  | 'preview-active'
  | 'control-press'
  | 'control-release'
  | 'preference-changed'
  | 'contact-copied'
  | 'operation-failed'
  | 'project-arrived'
  | 'search-opened'
  | 'loading-started'
  | 'loading-finished';
```

Components emit these names. The adapter maps them to Cuelume cues after the
owner chooses a sound palette. This keeps the site free to change libraries or
mute one class of events without rewriting component behavior.

The preference layer must account for:

- Explicit enabled or muted state controlled by the visitor.
- Global volume controlled in one place.
- Browser audio-context readiness after a qualifying user gesture.
- Per-event coalescing so pointer jitter, repeated key events, or nested elements
  do not produce a burst of identical cues.
- Page visibility and route state so background tabs remain quiet.
- Media playback so interface cues do not unexpectedly mix with project audio.
- Server rendering, where no audio context exists.

No fixed rate or timing threshold is specified here. It should be derived by
auditioning the selected cue's audible envelope and verifying that one ordinary
interaction produces one intelligible response.

## Accessibility boundaries

Audio preference and reduced-motion preference are related but not equivalent.
A person can want less visual motion and still benefit from sound confirmation,
or want full motion with no audio. The controls should remain independent unless
the visitor explicitly chooses a combined quiet mode.

Every sonic event needs a visual or semantic equivalent. Error and success
states must be announced in text where assistive technology requires it. No cue
should be necessary to navigate, discover hidden content, or understand whether
an operation completed.

The design also needs to tolerate devices that are muted, lack usable audio,
deny autoplay, change output mid-session, or suspend the audio context. Failure
to play a cue should never fail the underlying action.

## Performance and loading boundaries

Cuelume's generated Web Audio approach avoids a network request per sound and is
documented as a small, dependency-free package. That makes it compatible with a
media-rich portfolio, but the audio context and library should still initialize
only in the client environment.

Avoid preloading fabricated progress or delaying a route to make a cue audible.
The interface action owns the schedule. Sound participates only when ready and
drops out silently when it cannot meet that schedule.

## Audition protocol

Future cue changes should be auditioned in context rather than selected by name.
The audition should compare the same interaction with sound off and on,
using speakers and headphones, pointer and keyboard, repeated navigation, and a
quiet reduced-motion mode.

For each mapped event, record:

- Whether the cue makes the consequence clearer.
- Whether it supports the warm tactile material or introduces a synthetic tone.
- Whether repetition becomes tiring during ordinary browsing.
- Whether another cue in the same interaction creates perceptual overlap.
- Whether the event should remain silent.

Only the cues that survive those questions should enter implementation. The
library's full inventory is a palette, not an acceptance criterion.
