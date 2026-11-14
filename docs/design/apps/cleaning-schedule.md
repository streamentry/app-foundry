# Tempo — Cleaning Schedule

**Internal design codename — not an approved app name.**

## North star

Make one small household win feel achievable.

## User moment

Someone has ten minutes before work and needs the next manageable task.

## First-screen hierarchy

Next actionable chore → today's progress → recurring schedule → household assignment.

## Visual and layout grammar

Fresh sky blues, upbeat hierarchy, clear progress bar and disciplined task rows. Personality through rhythm, not cartoon confetti.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Instant completion and undo; defer a task without punishment; shared responsibilities clearly attributed.

## Dark mode

Deep blue surfaces with legible soft cyan; no neon noise.

## Must not do

Shaming badges, gamified streak compulsion, hiding overdue tasks under bright colors.

## Cheapest design verification

Ask a household to pick a chore and record completion in under ten seconds; measure return after a skipped day.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
