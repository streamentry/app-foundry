# Folio — Invoice Number Ledger (#011)

**Status: bespoke offline-first research app. Not a validated, legally compliant or published invoice tool.**

**Single task:** Keep track of the invoice reference numbers you deliberately reserve, actually issue elsewhere, void or record from existing documents. Folio does **not** create/send invoices, collect money, report tax or connect to accounting software.

## What has been implemented

- Multiple separately numbered series with permanent prefix, explicit starting number and decimal zero-padding.
- Reserve next reference; a reservation is **not** treated as an issued invoice.
- Resolve a reservation to issued (only after external issuance) or void (requires written reason). Issued and void references are never reused.
- Manually backfill already issued/void numbers from existing systems, requiring an explanation and rejecting duplicates.
- Highlight **unaccounted ranges** between the starting number and the highest number recorded locally, without guessing they are void.
- Read dated event history; archive and reopen series without deleting allocations.
- Export complete CSV event history and full validated JSON backup. Replacement restore requires confirmation.
- Purpose-built warm paper / sienna visual language with legible monospaced serials, light/dark mode and large controls.

Every change is saved in one local SQLite KV store, with serialized writes. No account, backend, automatic sync, tracking or remote uploads. Exports are user-triggered through OS sharing.

## Run

From the repository root with Node 22 and npm 10+:

    npm ci
    npm run invoice:start
    npm run invoice:test
    npm run invoice:bundle

For local platform simulators: npm run invoice:ios or npm run invoice:android.

The independent code is under apps/ideas/invoice-number-ledger/src; pure domain tests under tests/domain.test.mjs. Idea Lab retains its separate generic prototype and cannot automatically migrate data from a different installed app sandbox. Existing generic data is not overwritten.

## Example and number semantics

Create prefix **INV-2026-**, start **215**, padding **4**. Reserve **INV-2026-0215**, then mark it issued only after actual issuance. Reserve **INV-2026-0216**, void it with a reason. Backfill external invoice 220 with a source note. Folio shows numbers **217–219 unaccounted locally**, not automatically void. The next allocation will be 221.

Annual reset is **not automatic**: use a new series with a different prefix when an accounting policy requires it. Starting at 215 does not mean numbers 1–214 existed. A separate invoicing device or service can still allocate duplicates without Folio knowing: this app offers no multi-device guarantees.

## Privacy, integrity and legal limitations

- The UI does not delete individual issued/void events. However, local data and user-initiated JSON restores are **not cryptographically tamper-proof or legally certified audit evidence**.
- No automatic backup. Uninstalling/losing a device can remove history. User/client labels are not application-encrypted beyond OS safeguards.
- This app does **not** issue a legally valid invoice or meet e-invoicing, tax, credit-note or other jurisdictional requirements. Keep your official accounting/issuance system as the source of truth.
- CSV neutralizes spreadsheet formula prefixes; JSON import rejects orphan, duplicate and invalid state-transition records.

## Release gates

[Design](../../../docs/design/apps/invoice-number-ledger.md) · [Research pilot](../../../docs/research/INVOICE_NUMBER_PILOT.md) · [Decision](../../../docs/ideas/DECISIONS/2026-11-15-invoice-number.md) · [Native QA](../../../docs/ideas/QA.md).

Passing TypeScript, unit tests, lint, Expo compatibility and iOS/Android JavaScript bundle exports is **not** a signed native build or a real user study. Physical-device QA, real invoice-numbering user observations, official legal review, name clearance, privacy/support URLs, signed distribution builds and store assets remain uncompleted.

**Stop if users already have reliable numbering in their issuer, or if manual double-entry makes the process worse.**
