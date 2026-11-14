# Canopy — Plant Watering

**Internal design codename — not an approved app name.**

## North star

Make plant care simple and seasonal.

## User moment

An owner notices three thirsty plants and wants to know which to water first.

## First-screen hierarchy

Needs attention today → plant identity and cue → log care → optional collection and patterns.

## Visual and layout grammar

Editorial botany, restrained leaf forms, paper greens, organic clipping and photographic identity. Keep critical text outside imagery.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

One clear logging tap, editable watering schedule based on conditions, no confident diagnosis by default.

## Dark mode

Forest surfaces with botanical green; never lose plant names in photos.

## Must not do

Pretending schedules are universally accurate, overdesigned leaf-shaped buttons, expensive AI for simple reminders.

## Cheapest design verification

Five users identify next plant in under five seconds and can correct an unsuitable reminder without friction.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
