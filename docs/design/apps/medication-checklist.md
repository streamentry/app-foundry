# Clarity — Medication Checklist

**Internal design codename — not an approved app name.**

## North star

Make records unambiguous; never pretend to be clinical advice.

## User moment

An older adult sees the next medicine and wants to mark it taken; adult child may later verify history.

## First-screen hierarchy

Medication identity/dose/time → status and action → history → optional sharing. Include explicit 'Not logged' vs 'Taken'.

## Visual and layout grammar

High-contrast deep teal, quiet clinical white, large system type, rounded but serious task surfaces.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Explicit confirm and reversible undo. Date/time history with timezone. Notification is never proof medication was taken.

## Dark mode

Dark sea-green with bright but soft teal status. Every state has text, not only color.

## Must not do

Medical outcome promises, ambiguous green 'success' tick, hiding dosage, trivialized care language.

## Cheapest design verification

Ask users to identify whether a dose was *actually logged* vs simply reminded; test errors with large text.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
