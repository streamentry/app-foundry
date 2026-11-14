# Counter Close — Bespoke design contract

**Product:** Cash Drawer Count / idea 012. Working name “Counter Close”; not trademark-cleared.
**Users:** Shop owners and cashiers who count bills and coins at the end of a day.
**Version:** 0.2 prototype ready for focused native-device testing, not a production release.

## Core task and unconventional wedge

The real job is not bookkeeping. The user holds physical money and wants a correct count with minimal mental switching. The app puts physical counting before any POS expectation, intentionally reducing a possible anchor on the answer. That benefit is a **hypothesis** to verify with merchants.

## Material language: tactile receipt × quiet industrial

Not a standard fintech dashboard. Design cues come from counter receipt paper, dated register reports and high-contrast hardware buttons.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| Canvas | #F4F3EB | #111B17 | Warm paper, deep jade |
| Panel | #FFFFFF | #1D2D25 | Touchable controls |
| Receipt | #FFFEF8 | #20332A | Close record |
| Text | #1B3028 | #F5F4E9 | Key figures |
| Secondary | #495F53 | #C4D2C5 | Instructions |
| Primary | #234D36 | #DAF4A0 | Actions, active tab |
| On primary | #FFFFFF | #1A2D22 | Button label |
| Highlight | #D9EDB4 | #344832 | Counted amount, variance |
| On highlight | #213B2B | #F1FFE2 | Variance text |
| Border | #C8D4C7 | #496150 | Subtle rule |

Typography: system sans for touch controls; platform monospaced face for denominations and monetary amounts. Keep numeric alignment consistent and avoid decorative fonts when reading cash.

Spacing and geometry: 10–16px rounded input surfaces, 4px squared-off receipt, dashed receipt dividers. Minimum 48px decrement/increment targets and readable quantity fields. Minimal motion and no streaks, gamification, arbitrary icons or clutter.

## Intentional screen sequence

1. **Count**: large live total, visible currency, one denomination per horizontal row. Plus, minus, or whole number input.
2. **Review**: counted amount first; other verified tender; POS expectation and clear over/short delta appear only now.
3. **Save**: explicit confirmation; app persists the record before showing a receipt.
4. **History**: individually dated and labeled records, never aggregate unlike currencies.
5. **Control**: edit, delete with confirmation, export CSV or JSON backup, restore with strict validation.

An edited record keeps its original currency. Switching currency during an unfinished count clears quantities only after confirmation.

## Data-lifecycle and errors

- A distinct draft key autosaves in the OS sandbox; a complete count has its own versioned collection.
- Each saved row stores counts by denomination ID and money as integer minor units.
- Old generic prototype records contain denominations but not currency; import requires an explicit **USD** acceptance and does not delete older storage.
- Unsupported denominations, negative quantities, overlong notes, unsafe values and mismatched JSON backups are rejected before storage.
- Important information never relies on red/green alone: status labels explicitly read Balanced, Over, Short or Not compared.
- A share sheet is opened only after an intentional export action.

## Boundaries and remaining verification

A saved receipt is not a financial audit or signed POS certificate. Localization, actual native accessibility, 200% type, smallest screen, RTL, platform date picker, backup recovery and physical counting ergonomics require QA on devices. Do not submit this version without that review.

**Differentiation** must come from its physical counting UX and transparent reconciliation, not from a palette swap. Do not copy a POS vendor's protected trade dress or UX.
