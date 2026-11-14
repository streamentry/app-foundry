# Counter Close — Cash Drawer Count (idea 012)

**Status: bespoke offline-first release candidate, not yet store-ready.**

Counter Close is a receipt-inspired tool for a shop owner or cashier who counts physical cash at closing and compares it with a POS figure. It is not a full POS or accounting platform.

## One promise: count first, compare second, save a clear record

1. Pick USD, VND, SGD or EUR and optionally name the drawer.
2. Count actual notes and coins with large +/- controls or direct numeric input. Totals use **integer minor units**, not floating-point money arithmetic.
3. Review the total. Optionally add verified unlisted cash and an expected amount from POS.
4. See **Balanced / Over / Short**, calculated as counted minus expected.
5. Save a dated close. Reopen, correct or delete with confirmation. Different currencies never get added together.
6. Export CSV or a JSON backup. Restoring JSON validates every record and requires explicit replacement confirmation.

**Recovery:** Unfinished counts are autosaved locally. Old generic-prototype counts can be imported *only by user choice* as USD after presenting this assumption; old records stay untouched.

## Start and test

From the monorepo root with Node 22 and npm 10+:

    npm ci
    npm run idea:start -- cash-float-count
    npm run test -w @foundry/idea-cash-float-count
    npm run typecheck -w @foundry/idea-cash-float-count
    npm run bundle -w @foundry/idea-cash-float-count

Or use the platform-specific npm run ios/android commands with the same workspace.

The **standalone app** owns source components, domain logic, migration and sharing code. The Idea Lab retains a separate *generic* cash-count prototype so researchers can compare workflows.

## Currency presets

| Currency | Everyday note presets | Coin presets | Precision |
|---|---|---|---|
| USD | $100, $50, $20, $10, $5, $2, $1 | $1, 50¢, 25¢, 10¢, 5¢, 1¢ | 2 decimals |
| VND | 500,000 down to 100 đồng (12 notes) | None in main list | Whole đồng |
| SGD | S$100, S$50, S$10, S$5, S$2 | S$1, 50¢, 20¢, 10¢, 5¢ | 2 decimals |
| EUR | €200, €100, €50, €20, €10, €5 | €2, €1, 50¢, 20¢, 10¢, 5¢, 2¢, 1¢ | 2 decimals |

An **Other verified cash** field accommodates accepted banknotes and coins not in everyday presets. This list is not a legal-tender opinion; verify local tender rules and bank policy.

Official reference sources: [US currency](https://www.uscurrency.gov/denominations/index.html), [MAS notes](https://www.mas.gov.sg/currency/circulation-currency/circulation-currency-notes), [MAS coins](https://www.mas.gov.sg/currency/circulation-currency/circulation-currency-coins), [ECB notes](https://www.ecb.europa.eu/euro/banknotes/current/html/index.en.html), [ECB coins](https://www.ecb.europa.eu/euro/coins/html/index.en.html). Vietnam note denominations require final verification against an official Vietnamese-language SBV source before public release.

## Privacy and continuity

No account, backend, analytics, location permission, POS integration or automatic sync. Records are in device-local SQLite KV storage and **not application-encrypted**. The tool does not guarantee recoverable or audited data. Manual exports go only to a destination the user selects. Uninstalling or losing a device can destroy data if the user never exported a backup.

The earlier generic app's local key is not overwritten. Legacy fields had no currency; the opt-in upgrade treats them as USD and labels imported records for verification. Data in the separately installed **Idea Lab** remains in that app's OS sandbox and does not migrate automatically.

## Explicit non-goals

No payment taking, tax or accounting certification, multi-user approvals, automated deposits, remote cloud backup or subscription monetization. Real device QA and independent store compliance are not complete.

## Release gates and honest thresholds

Read the [design direction](../../../docs/design/apps/cash-float-count.md), [merchant trial plan](../../../docs/research/CASH_CLOSE_PILOT.md), and [native QA](../../../docs/ideas/QA.md). Before public submission: clear name/IP and privacy, test actual device persistence and export/restore, verify denominations, capture real usability feedback and prepare signed builds/assets.

**Decision threshold (hypothesis, not actual evidence):** 4 of 5 qualified merchants complete a simulated close without coaching, 3 opt to repeat it, and at least 2 demonstrate real payment or workflow-switching intent. If this fails, stop adding features until the workflow is improved.
