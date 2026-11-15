# Moderator only — tasks, answer key, data integrity

Do **not** share this document or its expected answers with participants before they finish both scenarios.

## Correct answers

- A: 12h30 (750 min) + 2h00 (120) − 11h15 (675) − 4h00 (240) = **-45 minutes (45 minutes OVER)**.
- B: 18h30 (1110 min) + 1h45 (105) − 12h20 (740) − 6h50 (410) = **+65 minutes (1h05 REMAINING)**.

A response of just "over" without the exact number is not correct. Store signed integer answers the person actually gave, even when wrong.

## Balanced assignment

| Slot | First method | Baseline scenario | Hours Left scenario |
|---|---|---|---|
| P01 | Current method | A | B |
| P02 | Hours Left | B | A |
| P03 | Current method | B | A |
| P04 | Hours Left | A | B |
| P05 | Current method | A | B |

The static assignments are already in results.json. This alternates order and tasks to mitigate learning effects, but task difficulty and familiarity still bias the tiny sample.

## Observation protocol (15–20 min)

1. 0–3 min: qualify participant, obtain explicit consent; document actual baseline tool before demo.
2. 3–8 min: show the first assigned scenario only, start timer when they read it, stop once they report signed minutes and show the corresponding ledger. Do not coach.
3. 8–13 min: give the other scenario and method. Record the same outcome and whether the app was completed without hints. Ask for a client statement only during the app attempt.
4. 13–16 min: ask which workflow is objectively faster, what they already have today, and what duplicative entry the new app would force them to do.
5. 16–20 min: offer, without pressure, a second real test or import of non-sensitive real logs. Only an actually scheduled trial, real data import or actual payment counts as a hard commitment. Verbal praise does not.

## Fill results.json honestly

- observedAt: real ISO UTC timestamp at session (not a sample timestamp).
- qualified: true only if you witnessed genuine prepaid-hour work and consent.
- baselineTool: name/category of their actual method only, without identifiers.
- baselineSeconds and appSeconds: full positive integer elapsed seconds measured under each task.
- baselineResultMinutes and appResultMinutes: signed answers **they reported**, not the correct answers from this document.
- appUnassisted: true only if no interface coaching was given.
- statementGenerated: true only if they actually generated a shareable summary.
- secondUseRequested: true only if they voluntarily requested/reconfirmed a real second use.
- commitment: none, verbal_only, trial_scheduled, imported_real_data, or paid.
- evidenceNote: non-identifying factual confirmation, required for the last three commitment types.
- notes: only anonymized task friction; no name, email, private client, rate, invoice or recordings.

If a session fails because of a crash, do not edit it into success. If installation fails, track setup friction without fabricating a completed observation. If a qualified participant abandons, record the actual attempt and inability to complete rather than replacing them with a better performer.

## Evaluate without cherry-picking

Run npm run retainer:pilot from the repo root. The evaluator calculates correctness from the assigned scenario, rejects incompatible evidence and only makes a decision after five complete real sessions. The GO outcome means "eligible for a longer user test", **not** a verified business or an app-store release.
