# Daylight — Elderly Routine

**Internal design codename — not an approved app name.**

## North star

Calm independence and dignity.

## User moment

An older adult wants to know what happens next without navigating a dense schedule.

## First-screen hierarchy

Now → next meaningful activity → done/skip → optional caregiver configuration. One major decision per view.

## Visual and layout grammar

Large humanist type, muted plum/cream, spacious simple cards; adult, respectful and predictable.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Generous targets, explicit action names, VoiceOver/TalkBack sequence, no disappearing controls; family controls separate.

## Dark mode

Quiet plum, high contrast and minimal glare.

## Must not do

Childlike infantilization, tiny affordances, hidden swipe actions, aggressive reminders.

## Cheapest design verification

Test with older adults using large text and voice assistance; observe whether they can find next item unaided.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
