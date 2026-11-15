# Native QA gates for 100 idea research prototypes

## Automated (PR CI)

- [ ] 100 unique slugs and bundle identifiers; no duplicates of original 10 apps.
- [ ] Valid form fields for all 100, mandatory fields, date/time choice validation and formula-specific constraints.
- [ ] Formula correctness: cash count, rounding, commission, cost sharing, cut length and time.
- [ ] CSV spreadsheet injection escaping and input limits; JSON backup import rejects wrong app/schema/duplicate records.
- [ ] Basic light/dark text contrast on all authored palettes.
- [ ] Strict TypeScript, ESLint, Expo dependency compatibility.
- [ ] Idea Lab and four representative native JS bundle exports, plus existing ten apps.

## Manual on-device tests (mandatory before public release)

- [ ] First launch with zero data and airplane mode; no false sample record.
- [ ] Create/edit/delete in each flow, close the app, restart and verify persistence.
- [ ] Native date/time pickers; correct calendar day across time zones and DST boundaries.
- [ ] A calculator with invalid numbers shows error and never saves bad data.
- [ ] Confirmation-gated delete all and replacement restore; no cross-app data corruption.
- [ ] CSV opens without formula execution and reflects selected app data.
- [ ] JSON export, paste restore and verify records from the same app; cross-app backups rejected.
- [ ] App Store Privacy labels and legal copy match actual SDK behavior.
- [ ] VoiceOver/TalkBack, 200% text, large phones, 320pt, tablet, RTL text, keyboard, dark mode.
- [ ] All buttons accessible at 44pt iOS / 48dp Android; correct screen-reader roles.
- [ ] Background/resume/OS termination, partial failures, date rollover and low storage space.

## Representative flow matrix

| Flow | Candidate | Critical QA |
|---|---|---|
| Calculator | Cash Drawer Count | Denominations, arithmetic, decimals blocked |
| Calculator | Timesheet Rounding Audit | Overnight shift and rounding discrepancy, not payroll advice |
| Checklist | Driver Pre-Trip Checklist | Editable checklist, never certified safety inspection |
| Counter | Knitting Project Rows | Increment/decrement and persistence |
| Inventory | Reorder Point Notebook | Negative stock prevented and threshold |
| Calendar | Family Document Expiry | Day boundary, past/future date sorting |
| Ledger | Freelancer Deposit Tracker | Signed amounts and CSV precision |
| Flashcards | Spelling Practice Cards | Reveal and mark practiced |
| Session | Study Session Log | Start/stop draft timer, manual override |
| Journal | Repair Job Ledger | Notes and audit trail limits |
| Progress | Cash Savings Jar | Target progress and goal editing |
| Register | Invoice Number Ledger | Duplicate invoice numbers rejected |
| Measure | Utility Meter Readings | Reading integrity and unit label |

## Exit condition

No store submission until one app demonstrates a differentiated, complete task that five representative users can perform reliably and a human signs off the native QA and release documents. A successful JS bundle is not a native build.

## Cash Close first-product production gates

- [ ] Physical USD, VND, SGD and EUR denomination counts cross-checked against real bundles.
- [ ] Blind count → enter expected POS cash → save → reopen exact variance across relaunch.
- [ ] Change-currency confirmation never reinterprets earlier counted money.
- [ ] Save failure and storage-full state preserves local draft and never claims saved history.
- [ ] Old generic prototype imported **only** with user approval of USD interpretation; old data untouched; duplicate import idempotent.
- [ ] CSV opened in spreadsheet without formula execution; JSON export and paste restore repeatably tested.
- [ ] Large-font, small phone, landscape tablet, dark mode, TalkBack and VoiceOver with cash in hand.
- [ ] Five shop owners demonstrate a complete close without coaching. Timing and mistakes recorded, not guessed.
- [ ] Trademark/name checks, original icon and screenshots, privacy policy URL and signing completed.

## Hours Left #097 — mandatory native QA and commercial release gate

- [ ] Test whole-minute arithmetic, negative balances, topups, start/end dates, zero and invalid durations.
- [ ] Ensure editing an agreement after work exists cannot silently change its allowance or date range.
- [ ] Create/rename/archive/delete a period; confirm removal of dependent entries after explicit warning.
- [ ] Test large/complex portfolios, offline persistence, app termination and low-storage write errors.
- [ ] Export CSV with potentially dangerous formula text; open in spreadsheet and verify neutralization.
- [ ] Export JSON, corrupt schema/IDs/orphan rows and verify restore rejects it without mutating original data.
- [ ] Import old generic calculator snapshots only by choice, with original historical records untouched.
- [ ] Test client statement text export, sharing only through an explicit OS share-sheet action.
- [ ] Test iOS/Android physical devices: 320pt, 200% dynamic type, TalkBack/VoiceOver, dark mode, long client names and tablet.
- [ ] Interview five real prepaid-hour freelancers; record an actual *relative* improvement against spreadsheets/timers.
- [ ] Obtain at least two costly commitments; otherwise stop independent App Store development.
- [ ] Verify name/trademark, privacy policy, support route, screenshots, store category and signed native builds.

The client ledger is **not a timer, invoice, contract approval, legal evidence or sync service**.


## Operational pilot artifact for Hours Left #097

The [five-person usability and demand test](../research/retainer-hours/README.md) specifies real-user consent, counterbalanced tasks, signed-device access limitations, and observed truth-based results. The separate npm run retainer:pilot:test checks the **decision evaluator code**, not human adoption. A score of NOT_EVALUABLE is the expected state until the actual test has been run.
