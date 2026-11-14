# Signal — Shift Calendar

**Internal design codename — not an approved app name.**

## North star

Instant certainty for someone between shifts.

## User moment

A nurse opens the app mid-shift to check tomorrow's start and whether a weekend is free.

## First-screen hierarchy

Today/next shift → next seven days → schedule entry → overtime/pay details. Keep the 'next shift' answer above the fold.

## Visual and layout grammar

Crisp cobalt accents, editorial time rails, compact layout, hard 8–10pt corners, tabular digits and restrained grid lines.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Tap a day to view clearly labeled shift types. Add a repeating pattern only after one shift succeeds. Fast offline day switching.

## Dark mode

Dark navy and reduced-glare light cobalt; avoid luminous calendar heatmaps.

## Must not do

Micro calendar text, unexplained shift colors, anything that resembles a generic productivity planner.

## Cheapest design verification

Ask five rotating workers to find their next free Saturday and tomorrow's start; measure errors before adding payroll.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
