# Folio (#011) — Distinct Invoice Reference Ledger Design

**Working name:** Folio (not trademark-cleared). Not an invoice maker, tax tool or official e-invoice register.  
**User:** Freelancers/micro-businesses who manually reconcile invoice references across multiple document workflows.  
**Job:** Explain which reference was reserved, issued, voided or simply not recorded here.

## Design hypothesis

A reference is a **lifecycle**, not merely an incrementing counter. A unique number can be reserved, then either marked externally issued or deliberately voided. Invoices already issued must never be marked reserved again. Missing records must not be relabeled void automatically.

Existing invoicing products already manage reference numbering; the unproven niche is an operator who coordinates references outside such software. The design must make this narrower task more accurate than an Excel notebook.

## Style: letterpress register + quiet paper

Unlike Counter Close's green receipt and Hours Left's indigo allowance strip, Folio uses **warm ivory, sienna stamped numbers, black ink, thin accounting rules, compact status marks and understated reference slips**. Its main information hierarchy is a huge monospaced full reference number, not a chart or a familiar generic list of tiles.

| Meaning | Light | Dark |
|---|---|---|
| Page | #FAF6EF | #181713 |
| Card | #FFFFFF | #28241E |
| Reference slip | #FFFDF9 | #2D2921 |
| Text | #272522 | #FFF7ED |
| Secondary | #63594E | #D2C4B5 |
| Rule | #D9CEC2 | #645548 |
| Sienna action | #973C28 | #F3BA8A |
| On action | #FFFFFF | #302019 |
| Context | #F6E6CC | #45372B |
| On context | #50351E | #FFEDD9 |

Essential text contrast passes **at least 4.5:1 in both modes by calculation**, covered by regression tests. Real-device accessibility and 200%-size text QA remain required.

## Essential user journey

1. **Numbering books:** Each series displays next available full code, issued/reserved/void counts and locally unaccounted numbers.
2. **Create series:** Name, immutable prefix ending in hyphen, starting ordinal from actual books, and padding width. No guessed historical records and no automatic yearly roll-over.
3. **Inside a book:** Prominent press-stamped next serial and explicit "Reserve next", separate manual external import, gap ranges and status-filtered search.
4. **One reference:** Visible status, client alias and immutable-looking event chronology. A reserved number may be marked issued after external issuance, or voided with mandatory explanation. Neither can be recycled.
5. **External record:** Full numeric suffix, actual recorded date, externally determined status and required provenance note. Duplicate and out-of-series values are rejected.
6. **Data:** Manual full CSV and JSON backup/restore; full-ledger validation and destructive confirmation.

All major actions have generous targets (at least 46–53pt); status is communicated in text, never color alone. No fake audit-seal graphics, blockchain claims, auto-nudges, badges or animations.

## Engineering and failure invariants

- A single serialized local store.change must atomically derive and append each reservation; no speculative unsaved number may be presented as persisted.
- Strict foreign keys, schema IDs, unique prefixes and event IDs, valid dates, positive counters and reserved-only transitions. Never mutate/delete an issued/void event in the UI.
- Gap computation calculates *ranges*, not a loop over all missing numbers.
- Archiving blocks new allocations and status changes; reopening preserves history and next number.
- A failed write is observable and can be retried. Unreadable stored history blocks mutation.
- CSV prevents spreadsheet formula execution; JSON restore validates everything before confirming replacement.
- A second device or accounting system is NOT coordinated. No authentication, telemetry or automated data transfer.

**Legal boundary:** E-invoices, credit notes and invoice corrections are jurisdiction-dependent. Folio itself can never certify the validity or uniqueness of an issued invoice. [Research](../../research/INVOICE_NUMBER_PILOT.md) precedes any public product claim.
