# Ledger — Mileage Log

**Internal design codename — not an approved app name.**

## North star

Accurate evidence that users can export.

## User moment

A freelancer finishes a trip and wants to record and eventually export the distance.

## First-screen hierarchy

Recording status → current/last trip → totals and export → billing options.

## Visual and layout grammar

Razor-sharp ruled surfaces, tabular figures, neutral graphite and distinctive lime marker. Dense, premium, factual.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Start/stop is unmistakable; location permission contextual; explain missing location and background behavior; exports explicit.

## Dark mode

Near-black graphite and controlled electric lime; no flickering gauges.

## Must not do

Auto-tracking without meaningful disclosure, unverified tax rules, flashy finance dashboards.

## Cheapest design verification

Test start/stop comprehension and export consistency against real journeys; investigate location constraints per OS.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
