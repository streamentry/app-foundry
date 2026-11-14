# Repair Job Ledger — Functional research MVP 010

**Audience:** Repair technicians

**User job:** Record work, parts and follow-up.

**App Store search hypothesis (not verified volume):** `repair job tracker`.

**Category:** Work & field operations.

## Run independently

From the App Foundry repository root:

```sh
npm install
npm run idea:start -- service-warranty-jobs
# Or: npm run ios -w @foundry/idea-service-warranty-jobs
```

The app uses a product-specific data form and calculations in `packages/idea-engine/src/specs.ts`, offline SQLite-backed records, edit/delete, CSV export, and optional user-initiated JSON backup/restore. Its UI is a **shared research prototype engine**, not a final product's unique visual design.

## Release blockers

Verify actual user need and differentiation, design an original brand and screen flow, pass iOS/Android device accessibility tests, test export and restore, review category-specific privacy/safety concerns, and configure store signing and legal documents. Do not submit this prototype as-is.
