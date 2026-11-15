# Build status — 100 future apps

**Status as of 2026-11-14: functional research MVP code, NOT 100 finished App Store apps.**

## What actually exists

- Exactly **100 separate Expo iOS/Android project packages** in \`apps/ideas/<slug>\`, with unique app identifiers.
- Exactly **100 hand-authored problem-specific form recipes** in \`packages/idea-engine/src/specs.ts\` derived from [ideas.json](ideas.json).
- **13 workflow modes:** calculator, checklist, handoff, register, journal, ledger, inventory, timeline, measure, counter, session, flashcard and savings progress.
- Specialized local formulas, including time rounding, denomination cash counting, commissions, missing stock, reorder quantity, area, capacity, cut-list waste, cost sharing and savings progress.
- Local SQLite-backed create/edit/delete and relevant actions (counter adjustment, checklist completion, answer reveal, editable dates).
- CSV export and manual JSON backup and restore, with explicit replacement confirmation.
- Light/dark category research palettes, basic accessibility labels and large hit targets.
- **Idea Lab** (single Expo app) to search all 100 and test their actual workflows without installing separate builds.

The common renderer is deliberately a *prototype*. Each app requires a **bespoke information architecture, branding, UX and UI** before store publication.

## Run

\`\`\`sh
npm install
npm run check
npm run idea:lab
npm run idea:start -- cash-float-count
npm run idea:verify
npm run idea:smoke
\`\`\`

Single app examples:

\`\`\`sh
npm run ios -w @foundry/idea-cash-float-count
npm run android -w @foundry/idea-knitting-row-counter
npm run ios -w @foundry/idea-school-paperwork
\`\`\`

All app names, app IDs and icons are internal, temporary and not trademark-cleared.

## Explicitly missing

- Individually polished native designs, icons, screenshots, onboarding, localization, polished analytics and accessibility verification.
- Device-level QA of all 100; CI only bundles a representative subset.
- Native widgets, camera capture, OCR, GPS, automatic notifications, signed builds and App Store/Play publishing.
- Payment/RevenueCat, backend, authentication, synchronized collaboration and auto-backups.
- Distribution/keyword validation, real competition research and user willingness-to-pay evidence.
- Data import via platform file picker; JSON restore currently uses manual paste with schema validation and confirmation.
- A committed lockfile now makes clean installs reproducible with `npm ci`. Release QA, signing, and native device testing remain outstanding.

## Security and safety boundaries

Sensitive family, health, pet, financial, or emergency notes can be recorded locally but are not encrypted by the application beyond OS facilities; there is no clinical compliance review. A reminder or checklist is **not** a safety-critical alert system, a certified inspection or an accounting tool. User-selected export destinations control third-party sharing.

## Technical debt and next design decisions

1. Verify clean `npm ci` installs in CI, then test real native builds on iOS and Android.
2. Fix data lifecycle faults, define schema migrations, and test recoverability; exported CSV is not importable.
3. Review app-specific function/accuracy and competitive differentiation. Many ideas still need core category features (camera, actual widgets, evidence attachments).
4. Pick at most 1–2 genuinely validated apps to elevate from research prototype to publishable consumer experience.
5. Add a distinctive design brief, privacy/legal disclosure, support contact and acquisition hypothesis for each promoted app. **Do not publish the other 98 simply because they compile.**

## App Store 4.3

A shared rendering engine and different keywords do **not** constitute 100 independent app designs. See [Apple's App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) before submitting anything. Distinct usefulness, quality and user demand are required.

## Promoted candidate: Counter Close / Cash Drawer Count (012)

The **standalone** `apps/ideas/cash-float-count` now has its own task-specific counting workflow rather than the shared idea renderer. Features include USD/VND/SGD/EUR denomination presets, integer minor-unit totals, blind counting before POS comparison, local draft recovery, append/edit/delete history, CSV and JSON backup, and opt-in migration from the earlier USD-like prototype. Its research entry in Idea Lab remains the **generic** shared renderer—launch the independent app to test the bespoke experience. No real-merchant acceptance test or store release has been completed.

See [the product README](../../apps/ideas/cash-float-count/README.md) and [design direction](../design/apps/cash-float-count.md).

## Second promoted research app: Hours Left (#097)

The standalone [Retainer Hours Ledger](../../apps/ideas/freelance-retainer-hours/README.md) has its own typed UI, client periods, integer-minute work debits and allowance credits, historical statements, confirmation-gated local JSON backup/restore, CSV export and deliberate archived import from the old calculator. It is independent of the shared idea renderer. TypeScript, domain tests, Android/iOS JS bundles and contrast checks run via CI. **Merchant validation, signed native builds, real-device testing and store assets remain undone.** See [research decision](DECISIONS/2026-11-15-retainer-hours.md).

## Third promoted research app: Folio Invoice Number Ledger (#011)

The standalone [Invoice Number Ledger](../../apps/ideas/invoice-number-ledger/README.md) now replaces the shared research renderer for independent device runs. This distinct product has separated series, atomic next-number reservation, reserved→issued/void transitions, external record import with a mandatory source note, gap-range calculations, immutable-looking local event history and validated user-directed exports. No backend or automatic e-invoice features are introduced.

**Not proven:** commercial demand, jurisdiction-specific invoice numbering compliance, signed native builds, real device/accessibility behavior, correct cross-device allocation (NOT supported), store assets or organic search opportunity. See [the decision](DECISIONS/2026-11-15-invoice-number.md) and [the five-user falsification protocol](../research/INVOICE_NUMBER_PILOT.md).
