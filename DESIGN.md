# DESIGN — A coherent foundation, ten unmistakable identities

**Foundry is not a visual brand.** It is a quality contract. Every consumer app must have its own audience research, product architecture, visual grammar, icon, microcopy, and interaction model.

## Shared foundation (non-negotiable)

- **Jobs first:** one clear primary action in the first screen; empty, success, error and offline states get proper design.
- **Navigation:** respect iOS system navigation/controls and Android Material conventions. Apple Liquid Glass belongs primarily to navigation and control chrome, **not** as blurred decoration behind content. Do not imitate glass using hard-to-read overlays.
- **Accessibility:** scale fonts, semantic labels, visible focus, text not conveyed only by color, adequate contrast, 44pt iOS / 48dp Android targets, comfortable RTL adaptations, and reduced motion.
- **Adaptivity:** small iPhones, larger tablets, landscape, dark mode, large-text users, keyboard and safe areas.
- **Privacy:** ask only for capabilities the user needs, at the time needed. No deceptive urgency or compulsory streaks.
- **Truth:** no fake health efficacy, finance accuracy claims, notification promises or purchase functionality in demo screens.

## Differentiation contract

Each app must vary in **at least four of six dimensions**: (1) information hierarchy; (2) screen composition; (3) typography; (4) shape and density; (5) illustration/imagery style; (6) motion and interaction. **Palette swaps alone do not count.** A shared component may carry behavior and accessibility, but not a distinctive consumer identity.

The 10 design directions, their day/night palettes, interaction DNA, and code tokens live in `packages/design-system/src/index.ts`. They are concepts, not app names or approved trademarks. Open the gallery at `apps/starter` and browse one direction per app. The detailed briefs live in [docs/design/INDEX.md](docs/design/INDEX.md).

## What is current in 2026 (and what is timeless)

Apple's recent Liquid Glass guidance distinguishes floating controls from branded content; Android Material 3 offers adaptive, accessible semantic colors and familiar component behavior. Neither platform requires every app to look identical. "Trending" decoration should never outrank use-case clarity, performance or readability. See [sources and platform rules](docs/design/PLATFORMS-2026.md).

## New app design flow

1. Validate a job and specific audience; fill in [APP-DESIGN-BRIEF.md](docs/templates/APP-DESIGN-BRIEF.md).
2. Pick or create a genuinely different visual direction; explain why its information architecture suits the target user.
3. Define semantic light/dark colors, type, spacing, shape, content behavior, motion and **anti-patterns**.
4. Run contrast/theme tests and on-device screen-reader, low-vision, smaller-phone and tablet QA.
5. Check screenshots for resemblance to incumbents, not just local brand consistency.
6. Measure successful task completion and comprehension before polishing decoration.

**Stop condition:** if two apps can swap palettes and still look or behave nearly identical, redesign before release.


## Idea Lab is not a consumer design system

The 100 new `apps/ideas/*` packages currently use a **shared research UX renderer** with category-based color tokens and workflow-specific composition. This enables real user testing of a specific job; it does **not** meet the standard of distinct production brands for each app.

Before promoting an idea to a consumer release:
1. Write a bespoke design brief using `docs/templates/APP-DESIGN-BRIEF.md`.
2. Replace the generic renderer with a first-screen experience optimized for its specific user task.
3. Validate novelty against competing screenshots and App Store Guideline 4.3.
4. Verify accessibility, dark mode, platform conventions, user delight and the full data lifecycle on real devices.

A palette swap or changing the app name is never an acceptable differentiation strategy.

## Promoted proof-of-work: Counter Close

[Counter Close design contract](docs/design/apps/cash-float-count.md) is the first idea-portfolio application to replace the shared research renderer with a bespoke first-screen experience. Its distinctive contribution is **physical-count-first, POS-compare-second** cash reconciliation with mono-aligned receipt records. Engineering completion is not proof of merchant demand or a clearance to publish.

## Second independent product — Hours Left

[Hours Left design](docs/design/apps/freelance-retainer-hours.md) is a dedicated prepaid-hour reconciliation experience. It uses warm-ivory/indigo editorial typography, an exact time-consumption strip and dated debit/credit ledger. This is deliberately distinct from Counter Close's receipt-first physical cash counting. A color swap alone would not be distinct.
