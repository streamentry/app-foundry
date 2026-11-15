# Decision — Invoice Number Ledger (#011) as App Foundry's third bespoke candidate

**Date:** November 15, 2026. **Status:** engineering experiment, unvalidated market.

## Recommendation and tradeoff

Choose Invoice Number Ledger (#011) from the existing 100-idea backlog. It shares the provisional **87/100** top score with Cash Drawer Count, Contract Renewal Calendar and Math Mistake Notebook. Cash Drawer and Retainer Hours already have bespoke builds. The numerical score is a subjective prior, **not independently measured search volume, competitive intensity or revenue**.

The concrete job is to avoid duplicate or unexplained invoice reference numbers during manual document issuance. Unlike another full invoice-maker, build a tiny **stateful reference record**: reserve → issued/void, external backfill with provenance and visible unaccounted gaps. This can be built offline and tested by a founder without paying for an API or experienced sales team.

## Steelman against building

If users already invoice with QuickBooks, Xero or another issuer, those systems know the actual issued numbers. Maintaining Folio separately creates an additional human task and may raise rather than lower errors. There is already a dedicated [SeriesTrack](https://apps.apple.com/us/app/seriestrack-app/id6756826033) iOS tracker. Offline single-device storage is unsuitable for multi-user invoice allocation. And invoice numbering / e-invoicing requirements vary by country.

This objection is strong enough that **the default after building is to STOP**, unless real manual-issuer users show that Folio improves their current process. Do not infer demand from code shipped.

## Carrying assumptions

1. A reachable segment of solo manual issuers experiences meaningful duplicate/unaccounted reference problems more than once a year.
2. A second mobile ledger is faster, simpler and safer than their spreadsheet and official document workflow.
3. At least two users will make a costly switching or payment commitment and a plausible ASO query exists.

## Minimal falsification

Ten to fifteen targeted conversations yielding five qualified independent manual issuers; compare unaided correct sequence tasks against existing tools; require at least 4/5 task success, 3/5 voluntary repeat use and 2/5 costly commitments. Stop for negative usability, no manual numbering niche, no acquisition route, regulatory problems or missing data-integrity guarantees.

## Not in scope

No legal invoice issuing, cross-device coordination, cloud sync, automatic annual reset, e-invoicing API, invoice PDFs, financial reporting, subscriptions or app-store publication. Human verification of jurisdiction rules, actual store name, business demand and signed native-device QA happens only if the initial experiment passes.

Read [Folio research](../../research/INVOICE_NUMBER_PILOT.md), [Folio design](../../design/apps/invoice-number-ledger.md) and [product README](../../../apps/ideas/invoice-number-ledger/README.md).
