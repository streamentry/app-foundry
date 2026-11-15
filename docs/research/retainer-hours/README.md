# Hours Left — five-person field pilot

**Current status (2026-11-15): NOT STARTED.** No real people were recruited, interviewed, or observed. No signed mobile distribution build exists.

This kit makes the existing [pilot plan](../RETAINER_HOURS_PILOT.md) executable without pretending that automated unit tests are real-user validation.

## Run order

1. Recruit 10–15 real users of prepaid-hour retainers, starting with opt-in founder contacts. [Screener](SCREENER.md) and [outreach templates](OUTREACH.md).
2. Resolve how they will access the actual app: [device and distribution](INSTALL.md). On physical iOS, public Expo Go does not work with the SDK 58 project.
3. Watch five **qualified** users, individually, using their existing tool and Hours Left. Read the [moderator protocol](MODERATOR.md). Show the participant only the assigned [task card](TASK_CARDS.md), not the answer key.
4. Enter anonymous, true observations into [results.json](results.json). Never store names, emails, contracts, private clients, screenshots or recordings in Git.
5. At repository root run these two commands:

       npm run retainer:pilot
       npm run retainer:pilot:test

The first command currently reports **NOT_EVALUABLE** because every participant slot is empty. It must stay that way until actual users are observed.

## Precommitted decision thresholds

The tool requires five fully observed qualified participants: 4/5 correct without guidance, 3/5 voluntarily requesting second use, and 2/5 completing a concrete switching/payment commitment. It additionally requires an observed advantage over existing tools (median within-person speed improvement of at least 15%, or at least two additional correct answers with the app). These are practical small-study rules, **not statistical proof** or established product metrics.

- GO_TO_LONGER_TRIAL: run a longer genuine adoption experiment, not a public launch.
- STOP_OR_NARROW: challenge the premise and distribution; don't add another feature by default.
- NOT_EVALUABLE: missing or incomplete human evidence. Do not infer success.

## Scope limits

No participant contact list or opt-in consent was supplied. Don't scrape contact details, send unsolicited messages, or claim someone agreed to a session. Research here is enabled but **human-dependent**. The outstanding release gate remains [Issue #17](https://github.com/streamentry/app-foundry/issues/17).
