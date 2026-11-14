# Archive — Warranty Tracker

**Internal design codename — not an approved app name.**

## North star

Find a receipt at the moment it matters.

## User moment

A customer has a broken appliance and needs proof of purchase immediately.

## First-screen hierarchy

Search & recent documents → item details / coverage dates → receipt image → contact/support details.

## Visual and layout grammar

Cream paper, sharp terracotta annotation, elegant serif heading, ticket-like documents with reference numbers.

Use the semantic colors and contrast-tested palette in `packages/design-system/src/index.ts`; never hardcode colors inside consumer screen components. Use appropriate native navigation and adaptive layout, while retaining this app's distinct content composition.

## Core interaction

Camera or manual entry, editable OCR results, secure local storage, clear expiring-soon state.

## Dark mode

Ink-brown notebook rather than faux recycled-paper textures.

## Must not do

Overstyled fake paper that slows reading, silent cloud upload, unverified warranty assertions.

## Cheapest design verification

Give five users a product name and ask them to retrieve the correct purchase date and receipt within 15 seconds.

## Release gate

Complete [the design QA checklist](../QUALITY-GATE.md) with real screenshots, accessibility settings, localizations and evidence from representative users. Brand, icon, store listing and purchase experience must be independently cleared before shipping.
