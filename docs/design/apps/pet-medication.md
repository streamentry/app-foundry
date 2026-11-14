# Companion — Pet Medication

**Internal design codename — not an approved app name.**

## North star

Treatments never get assigned to the wrong animal.

## User moment

An owner of two pets needs to check treatment due today.

## First-screen hierarchy

Pet identity → treatment name/time → recorded status → history. Color/icon never the only pet identifier.

## Visual and layout grammar

Friendly amber and ink, a pet badge for quick context, tactile cards, composed utility—not a game.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Explicit pet selection, confirmation before logging, recurring intervals, manual corrections with an audit trail.

## Dark mode

Chocolate/graphite surfaces and softer warm amber.

## Must not do

Overcute animal faces, accidental pet switching, medical advice beyond scope.

## Cheapest design verification

Ask multi-pet families to log two different treatments, then verify histories for mix-ups.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
