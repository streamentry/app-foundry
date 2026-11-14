# Gift Ideas and History — Functional research MVP 085

**Audience:** Families

**User job:** Remember gifts and recipients.

**App Store search hypothesis (not verified volume):** `gift tracker app`.

**Category:** Personal admin & money.

## Run independently

From the App Foundry repository root:

```sh
npm install
npm run idea:start -- gift-history
# Or: npm run ios -w @foundry/idea-gift-history
```

The app uses a product-specific data form and calculations in `packages/idea-engine/src/specs.ts`, offline SQLite-backed records, edit/delete, CSV export, and optional user-initiated JSON backup/restore. Its UI is a **shared research prototype engine**, not a final product's unique visual design.

## Release blockers

Verify actual user need and differentiation, design an original brand and screen flow, pass iOS/Android device accessibility tests, test export and restore, review category-specific privacy/safety concerns, and configure store signing and legal documents. Do not submit this prototype as-is.
