# Math Mistake Notebook — Functional research MVP 079

**Audience:** Exam students

**User job:** Revisit common solved mistakes.

**App Store search hypothesis (not verified volume):** `math error log notebook`.

**Category:** Learning & education.

## Run independently

From the App Foundry repository root:

```sh
npm install
npm run idea:start -- math-error-notebook
# Or: npm run ios -w @foundry/idea-math-error-notebook
```

The app uses a product-specific data form and calculations in `packages/idea-engine/src/specs.ts`, offline SQLite-backed records, edit/delete, CSV export, and optional user-initiated JSON backup/restore. Its UI is a **shared research prototype engine**, not a final product's unique visual design.

## Release blockers

Verify actual user need and differentiation, design an original brand and screen flow, pass iOS/Android device accessibility tests, test export and restore, review category-specific privacy/safety concerns, and configure store signing and legal documents. Do not submit this prototype as-is.
