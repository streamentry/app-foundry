# Ledger Mileage — functional local-first MVP

> Internal working identity, not a trademark-cleared public name.

## Run

From the repository root after npm install:

    npm run mileage-log:start

On a Mac with Xcode:

    npm run ios -w @foundry/mileage-log

## Implemented

Manual trip and purpose logs in km or miles, lifetime totals, edits and safe CSV export.

Each product is a separate Expo application with its own bundle identifier and offline SQLite-backed key/value store. No user account, backend, analytics, ads or paid features are configured.

## Explicitly deferred

GPS/location permission, background tracking, billing, payroll or tax recommendations.

## Release gates

- [ ] Confirm startup, persistence after restart, add/edit/remove and error states on iOS and Android.
- [ ] Test native date/time pickers, accessibility, large text, dark mode and smaller screens.
- [ ] Verify privacy, native permissions (if added), backups and any handling of sensitive records.
- [ ] Replace temporary .dev app identifiers, create original icon and screenshots, and verify store policies.
- [ ] Validate the core job with five representative users before building paid features.

Keep it a separate product, not a recolored shell of another app.
