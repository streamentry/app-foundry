# Hours Left — Retainer Hours Ledger (#097)

**Status: bespoke offline research candidate. NOT published, device-tested or market-validated.**

One job: track a prepaid client allowance, log actual work and additional hours, see precisely what remains, and send a transparent dated client statement.

## Features

- Independent client/project retainer periods, each with an explicit start/end date.
- Starting allowance in **whole hours and minutes**. No floating-point time arithmetic.
- Every delivered work session is a dated **debit** with required description; additional contracted hours are a separate **credit** with required explanation.
- Show remaining, actual work, additional hours, and overage clearly. Never sum unrelated clients into one misleading balance.
- Lock the original period and allowance after the first entry; extra hours are recorded separately rather than silently rewriting the original contract.
- Archive/reopen periods, correct or delete entries, and view full transaction history.
- Client-ready user-initiated text statements, CSV export, validated JSON backup and confirmation-gated restore.
- Opt-in import from the old generic #097 calculator as historical one-day archived snapshots. The old storage key is not deleted.
- Custom indigo and ivory light/dark responsive design distinct from the generic Idea Lab renderer.

## Run

At the repo root with Node 22 and npm 10+:

    npm ci
    npm run retainer:start
    npm run retainer:test
    npm run retainer:bundle

Native simulator variants: npm run retainer:ios or npm run retainer:android.

Code: src/domain.ts (pure ledger and validation), src/RetainerHoursApp.tsx (workflow), src/ui.tsx (design), src/legacy.ts (explicit import), src/share.ts (OS share sheet).

## Privacy, legal and safety

No login, backend, automatic time tracking, tracking SDK, notifications, invoicing, tax logic, payments, client authentication, or data upload. Every time entry is user-entered; the app does **not** verify hours or client authorization. A statement is not an invoice, signed approval or legal record.

Data is stored in the app's local SQLite KV store. It is NOT independently encrypted or automatically backed up; uninstall/device failure can delete records. Users must export backups regularly. Sharing is initiated explicitly by the user.

The old generic preview in Idea Lab is a separate OS app installation and is **not** automatically migratable across app sandboxes.

## Important business caveat

The original backlog assigned this idea **80/100**, below several 87/100 entries. Those ratings were hypotheses, NOT validated search or payment data. This candidate was selected for its founder-reachable ICP and concrete money-related reconciliation job. Competitors already offer similar capabilities.

See [Decision](../../../docs/ideas/DECISIONS/2026-11-15-retainer-hours.md), [Design](../../../docs/design/apps/freelance-retainer-hours.md) and [Pilot](../../../docs/research/RETAINER_HOURS_PILOT.md).

No App Store submission until CI passes, native device QA is completed, export/restore is tested and at least five real retainer users have performed an observed task.


## Ready-to-run five-person field test (still not run)

[Runbook](../../../docs/research/retainer-hours/README.md) · [Device installation](../../../docs/research/retainer-hours/INSTALL.md) · [Anonymous results](../../../docs/research/retainer-hours/results.json). The signed pilot-build configuration is in eas.json, but no distribution binary or eligible test-user contacts are available yet. Never treat green JS CI as tested real-device distribution.
