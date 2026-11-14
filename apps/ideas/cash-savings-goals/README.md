# Cash Savings Jar — Functional research MVP 088

**Audience:** Cash savers

**User job:** Log deposits toward goal.

**App Store search hypothesis (not verified volume):** `savings goal tracker offline`.

**Category:** Personal admin & money.

## Run independently

From the App Foundry repository root:

```sh
npm install
npm run idea:start -- cash-savings-goals
# Or: npm run ios -w @foundry/idea-cash-savings-goals
```

The app uses a product-specific data form and calculations in `packages/idea-engine/src/specs.ts`, offline SQLite-backed records, edit/delete, CSV export, and optional user-initiated JSON backup/restore. Its UI is a **shared research prototype engine**, not a final product's unique visual design.

## Release blockers

Verify actual user need and differentiation, design an original brand and screen flow, pass iOS/Android device accessibility tests, test export and restore, review category-specific privacy/safety concerns, and configure store signing and legal documents. Do not submit this prototype as-is.
