# Clarity Medication Log — functional local-first MVP

> Internal working identity, not a trademark-cleared public name.

## Run

From the repository root after npm install:

    npm run medication-checklist:start

On a Mac with Xcode:

    npm run ios -w @foundry/medication-checklist

## Implemented

One daily time per medicine, explicit log-as-taken status, reversible entry and editing.

Each product is a separate Expo application with its own bundle identifier and offline SQLite-backed key/value store. No user account, backend, analytics, ads or paid features are configured.

## Explicitly deferred

Local alerts, multiple doses per day, medical efficacy and family syncing. This is not a clinical or emergency tool.

## Release gates

- [ ] Confirm startup, persistence after restart, add/edit/remove and error states on iOS and Android.
- [ ] Test native date/time pickers, accessibility, large text, dark mode and smaller screens.
- [ ] Verify privacy, native permissions (if added), backups and any handling of sensitive records.
- [ ] Replace temporary .dev app identifiers, create original icon and screenshots, and verify store policies.
- [ ] Validate the core job with five representative users before building paid features.

Keep it a separate product, not a recolored shell of another app.
