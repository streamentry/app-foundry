# Craft Fair Sales Tally — Functional research MVP 017

**Audience:** Craft-market sellers

**User job:** Tally item sales without POS.

**App Store search hypothesis (not verified volume):** `craft fair sales tracker`.

**Category:** Small-business admin.

## Run independently

From the App Foundry repository root:

```sh
npm install
npm run idea:start -- booth-sales-tally
# Or: npm run ios -w @foundry/idea-booth-sales-tally
```

The app uses a product-specific data form and calculations in `packages/idea-engine/src/specs.ts`, offline SQLite-backed records, edit/delete, CSV export, and optional user-initiated JSON backup/restore. Its UI is a **shared research prototype engine**, not a final product's unique visual design.

## Release blockers

Verify actual user need and differentiation, design an original brand and screen flow, pass iOS/Android device accessibility tests, test export and restore, review category-specific privacy/safety concerns, and configure store signing and legal documents. Do not submit this prototype as-is.
