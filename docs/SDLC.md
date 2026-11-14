# Evidence-driven agentic software delivery

## 0. Opportunity before implementation

Identify the user, their job, search demand, incumbent, switching reason, distribution and a cheap falsification test. Write `docs/templates/EXPERIMENT.md` and a stop condition before building.

## 1. Independent product and design brief

Define one real first-screen action. Write `docs/templates/APP-DESIGN-BRIEF.md`: distinct information architecture, hierarchy, visual grammar, accessibility, brand originality and platform differences. Adversarially review both market and visual differentiation. A palette swap is not a product.

## 2. Implement (scoped agent)

Use branch and acceptance tests; no speculative cloud dependencies. Use `packages/design-system` for semantic contracts, app-local screens for product-specific identity. Pure logic stays testable separately from UI. No unapproved tracking or permissions.

## 3. Adversarial review (independent pass)

Attempt to find functional regressions, accessibility failures, copycat similarity, privacy issues, platform inconsistencies, dependency risk and misleading medical/financial language. Human owns high-consequence tradeoffs.

## 4. Verification

Types, tests including color checks, lint, Expo compatibility, native simulator/device interactions, VoiceOver/TalkBack, reduced motion, large fonts, dark mode, 320pt phone/tablet, offline. Observed results, screenshots and unknowns belong in PR.

## 5. Release (explicit human authorization)

Signing, individual bundle IDs, privacy labels, store metadata, age rating, purchases and restore flows, incident/rollback. Do not publish an interchangeable cloned shell.

## 6. Feedback and kill criteria

Track impressions → views → installs → activated users → paid users → net revenue after fees. Observe 7/30/60-day cohorts where sample permits. Continue, improve or stop based on thresholds declared beforehand.

Planner, builder, reviewer and verifier are separate roles or passes, not a mandate for an expensive multi-agent framework. No claimed test evidence without actual execution.
