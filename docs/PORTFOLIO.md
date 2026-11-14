# App Foundry — MVP implementation ledger

Ten distinct mobile utilities (including the original Shift Calendar). All are pre-release.

| App | Working user job | Engineering | Deferred risk |
| --- | --- | --- | --- |
| Shift Calendar | Shift edits and rotations, local reminders and CSV | Local SQLite | Backup/import, production native QA |
| Orbit Countdown | Create, edit, remove and rank date countdowns; hero shows next moment and days remaining. | Local SQLite KV | Native iOS/Android widgets, timelines and notifications. This MVP is an on-device countdown app, not a working home-screen widget. |
| Clarity Medication Log | One daily time per medicine, explicit log-as-taken status, reversible entry and editing. | Local SQLite KV | Local alerts, multiple doses per day, medical efficacy and family syncing. This is not a clinical or emergency tool. |
| Nest Baby Log | One-tap feeding/diaper event log with optional note, last occurrence, recent 24-hour history and deletion. | Local SQLite KV | Older-log browser, baby profiles, backups, data export and clinical advice. |
| Canopy Plant Care | Plants with configurable cadence, due/overdue lists, watering history, edits and removals. | Local SQLite KV | Notifications, photo identification, expert care diagnosis or weather-aware suggestions. |
| Companion Pet Care | Treatment schedules per pet, recurrence, explicit confirmation of being given, undo and edits. | Local SQLite KV | Veterinary dosing advice, multi-user sync, notifications or vet records. |
| Ledger Mileage | Manual trip and purpose logs in km or miles, lifetime totals, edits and safe CSV export. | Local SQLite KV | GPS/location permission, background tracking, billing, payroll or tax recommendations. |
| Archive Warranty | Purchase details, coverage months, estimated expiration and edit/delete. | Local SQLite KV | Receipt photos, OCR, automated claims, backup and notifications. |
| Tempo Household | Editable chore cadence, due calculation, completion history and undo without streaks. | Local SQLite KV | Shared households, push alerts, accounts or habit-shaming mechanics. |
| Daylight Routine | Large-type daily routines, chronological next activity, completion and undo. | Local SQLite KV | Caregiver surveillance, medical care, cloud sync and reminders. |

## Common limitations

- No cloud backup, account system, telemetry or public store builds.
- Device builds and usability testing are required before claims of production readiness.
- Health, baby, pet and elder-care tools are recordkeeping utilities, not clinical decision support.
- The Countdown app has no operational home-screen widget yet; implement with Expo Widgets and a native development build before marketing widgets.
- Mileage is manual only; do not claim GPS or tax compliance.

## Strategy

Start a few apps with real users and measure actual organic demand. Do not publish ten undifferentiated low-functionality listings at once.
