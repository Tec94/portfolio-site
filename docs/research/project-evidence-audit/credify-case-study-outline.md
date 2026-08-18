# Credify case-study outline

This is a proposed first case-study structure based only on verified public
evidence from the Stage 6 audit. It is not approved content and must not be
routed or indexed until the owner resolves the naming, role, and evidence
questions.

## Draft frontmatter

The final MDX frontmatter must use the approved project name and owner-confirmed
role. Unsupported outcome and performance claims remain absent.

```yaml
slug: credify
title: Credify # Resolve the live Credily name before publication.
summary: A location-aware credit-card rewards prototype built during HackUTA 7.
year: 2025
role: Product and front-end engineer # Owner confirmation required.
duration: October 4-5, 2025
categories:
  - Product engineering
  - Financial technology
  - Hackathon
technologies:
  - React
  - TypeScript
  - Vite
  - Express
  - PostgreSQL
  - Plaid
  - Gemini
  - Mapbox
  - Auth0
publicationState: draft
links:
  live: https://hack-uta.vercel.app/
  repository: https://github.com/Tec94/hack-uta
  devpost: https://devpost.com/software/credify-zck3je
```

## Story spine

The case study should present a focused product story rather than repeat the
repository README.

### Context

Frame the project as a HackUTA 7 prototype for helping people choose a rewards
card based on location and spending context. Explain the 24-hour team setting
and identify the exact user problem without using unsupported market numbers.

### Responsibility

Describe Jack Cao's owner-confirmed scope. Public commits currently support:

- Initial interface construction and theme alignment.
- Plaid setup and bank-card integration testing.
- Nearby map pins and location interaction.
- Notification feedback and onboarding progression.
- Mobile optimization and deployment work.

Separate individual work from team work. Credit the other contributors in the
final case study.

### Product flow

Show the shortest understandable journey through the product:

1. Start from the rewards problem and onboarding choice.
2. Link or select cards.
3. Establish location or merchant context.
4. Present a card recommendation and reason.
5. Continue into budget or spending insight.

Each step needs a real image or short recording from the corresponding product
state.

### Decisions

Explain decisions that the repository and owner interview can support:

- Why the recommendation is contextual instead of a static card catalog.
- How bank linking and manual card selection coexist.
- How map proximity, notification timing, and mobile layout shape the flow.
- How the team split the Vite client, Express API, database, and integrations.
- What was deliberately mocked, simplified, or deferred for the hackathon.

### Implementation

Describe the verified architecture without calling the demo production-ready.
Cover the React client, Express routes, PostgreSQL card and user-card records,
Plaid Link exchange, Gemini endpoints, Mapbox interface, and Auth0 client.

Document tradeoffs that need owner confirmation, including environment setup,
backend deployment status, card-catalog provenance, and whether the live build
still exercises the end-to-end integrations.

### Outcome

State only the verified outcome: the team shipped and submitted a functioning
HackUTA 7 prototype with a public deployment and repository. Add quantitative
results only when the owner supplies a reproducible source.

### Reflection

Use the owner interview to capture what changed under time pressure, what Jack
would rebuild, and which product decision had the largest effect. Avoid a
generic lessons list.

## Media sequence

The media should move from product promise to system behavior and then to
implementation evidence.

1. Art-directed landing or product overview.
2. Onboarding and card selection.
3. Plaid Link or bank-card success state.
4. Nearby map and recommendation notification.
5. Budget or Gemini insight.
6. Mobile state or short interaction recording.
7. Small architecture or team-credit diagram, if it clarifies ownership.

The current landing capture can serve as a reference, not the final hero. The
other states must come from a repaired live build, local repository run, or
owner-provided archive.

## Owner interview questions

These answers are required before the outline becomes MDX.

- Is the public name Credify or Credily, and why do the sources differ?
- Which flows did Jack design, which did he implement, and which were shared?
- Did the live demo use real Plaid sandbox data, seeded data, or both?
- Which Gemini recommendations were implemented end to end?
- What failed or was cut during the hackathon?
- Is there a saved demo, pitch deck, judging feedback, or team photo?
- Is there reproducible evidence for any card, category, latency, accuracy, or
  transaction count?
- Which screen best represents the project as selected work?

## Next steps

After the owner approves the project, name, role, and media packet, convert this
outline into the first case-study MDX draft. Keep it unpublished until its
claims and media are reviewed in the first Stage 9 project run.
