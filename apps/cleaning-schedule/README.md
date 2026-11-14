# Tempo Household — functional local-first MVP

> Internal working identity, not a trademark-cleared public name.

## Run

From the repository root after npm install:

    npm run cleaning-schedule:start

On a Mac with Xcode:

    npm run ios -w @foundry/cleaning-schedule

## Implemented

Editable chore cadence, due calculation, completion history and undo without streaks.

Each product is a separate Expo application with its own bundle identifier and offline SQLite-backed key/value store. No user account, backend, analytics, ads or paid features are configured.

## Explicitly deferred

Shared households, push alerts, accounts or habit-shaming mechanics.

## Release gates

- [ ] Confirm startup, persistence after restart, add/edit/remove and error states on iOS and Android.
- [ ] Test native date/time pickers, accessibility, large text, dark mode and smaller screens.
- [ ] Verify privacy, native permissions (if added), backups and any handling of sensitive records.
- [ ] Replace temporary .dev app identifiers, create original icon and screenshots, and verify store policies.
- [ ] Validate the core job with five representative users before building paid features.

Keep it a separate product, not a recolored shell of another app.
