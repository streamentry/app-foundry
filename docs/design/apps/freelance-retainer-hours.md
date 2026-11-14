# Hours Left — Product Design Contract

**Working name:** Hours Left (not trademark cleared).
**Product:** Retainer Hours Ledger (#097), built for solo freelance developers and consultants.
**Unique job:** reconcile prepaid client hours against delivered work and explicit allowance additions.

## Design: editorial ledger × measurement strip

Unlike the jade receipt-led Cash Close design, Hours Left uses **indigo ink and warm ivory**, strong editorial headings, a single horizontal time-consumption strip, and monospaced exact durations. No gamification, animated income counters, cluttered charts, gradients or generic fintech dashboards.

| Role | Light | Dark |
|---|---|---|
| Canvas | #F7F6F0 | #101923 |
| Surface | #FFFFFF | #1C2936 |
| Main text | #1A2835 | #F3F5FB |
| Muted text | #506273 | #C3D1E0 |
| Rule | #CAD2D7 | #4D6071 |
| Primary | #32349C | #BDB7FF |
| On primary | #FFFFFF | #191632 |
| Balance strip | #E9EAFB | #30345A |
| On strip | #202779 | #F5F3FF |
| Caution | #F4E3CA | #584631 |
| On caution | #50351D | #FFF0D8 |

Seven essential foreground/background pairs score at least 4.5:1 using WCAG contrast calculations. This does not replace real VoiceOver/TalkBack and 200% dynamic-type QA.

## UX grammar

1. **Retainers:** one card per client and period, with hours remaining, used and status. No false cross-client sum.
2. **Create:** explicit client/project, calendar period, and *zero* as the initial duration default. Users must deliberately enter a positive allowance.
3. **Work debit:** deliberate date, whole minutes, required description; never invent default 30 minutes.
4. **Allowance credit:** explicit dated additional time with a reason. App records but does not claim verified authorization.
5. **Read:** each entry is a distinct line; historical totals calculated from stored entries, not hand-edited summary numbers.
6. **Share:** text client statement and CSV; restore JSON only after full validation and explicit replacement confirmation.

The duration strip visually clamps at 100% when a period is overdrawn, but the exact **negative balance/overage** remains legible in text. Archive prevents adding new time. Period and allowance freeze after an entry; create another period instead of silently shifting contract dates.

## Trust and failure modes

All periods and entries reside in one versioned local store. Operations are serialized and persisted before confirming success. Imported old calculator data is archived as a one-day *snapshot*, never represented as a real monthly contract. Incompatible saved formats block editing rather than being overwritten. JSON import rejects orphan entries, duplicate IDs, invalid dates and wrong app backups. CSV neutralizes spreadsheet formulas.

No background timer, notifications, server, cloud backup, sync or accounting approval exists. App Store release and user validation are still blocked; [pilot protocol](../../research/RETAINER_HOURS_PILOT.md) defines the evidence gate.
