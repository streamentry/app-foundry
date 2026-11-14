# Nest — Baby Feeding Log

**Internal design codename — not an approved app name.**

## North star

Log one action with one thumb, even when tired.

## User moment

A parent feeds a baby at night with one hand and little attention to spare.

## First-screen hierarchy

Feed/diaper action → last occurrence → short history → trends. No dashboard before first log.

## Visual and layout grammar

Warm blush/cream, soft rounded controls, ample empty space, approachable typography; no gender-coded palettes.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Single tap from app open, undo visible, optional timer, no mandatory setup. Night mode should avoid bright flashes.

## Dark mode

Low-glare aubergine with soft coral accents for bedtime use.

## Must not do

Pink-vs-blue baby stereotypes, animations that interrupt feeding, performance scores for parents.

## Cheapest design verification

Measure logging time and errors in a one-hand simulation with low light, then test with real parents.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
