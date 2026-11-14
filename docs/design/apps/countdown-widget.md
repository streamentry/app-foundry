# Orbit — Countdown Widget

**Internal design codename — not an approved app name.**

## North star

Emotional anticipation without dopamine bait.

## User moment

Someone glances at a home-screen widget while planning a reunion.

## First-screen hierarchy

One important date → exact days/hours → other dates → editable settings. The event, not a dashboard, is the product.

## Visual and layout grammar

Large elegant serif number inside a precise quiet circle; violet/lilac atmosphere, generous space and minimal copy.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Widget-first personalization; date selection and time zones clear. Gentle transition at midnight; support calendar language.

## Dark mode

Deep violet and breathable pale lavender, no noisy star fields.

## Must not do

Sticker spam, fake urgency, unreadable glass, manipulative streak mechanics.

## Cheapest design verification

Ask users if they can identify the event and time remaining in under two seconds on a widget and on lock screen.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
