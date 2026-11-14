# Travel Health Document List — Functional research MVP 094

**Audience:** Traveling families

**User job:** Inventory required travel health documents without advice.

**App Store search hypothesis (not verified volume):** `travel vaccine document checklist`.

**Category:** Additional specialist wedges.

## Run independently

From the App Foundry repository root:

```sh
npm install
npm run idea:start -- travel-medical-documents
# Or: npm run ios -w @foundry/idea-travel-medical-documents
```

The app uses a product-specific data form and calculations in `packages/idea-engine/src/specs.ts`, offline SQLite-backed records, edit/delete, CSV export, and optional user-initiated JSON backup/restore. Its UI is a **shared research prototype engine**, not a final product's unique visual design.

## Release blockers

Verify actual user need and differentiation, design an original brand and screen flow, pass iOS/Android device accessibility tests, test export and restore, review category-specific privacy/safety concerns, and configure store signing and legal documents. Do not submit this prototype as-is.
