# Shift Calendar (Signal design) — MVP

A usable, offline-first rotation calendar for people who work nonstandard hours. **Signal** is an *internal* visual design codename, not a cleared public product name.

## Run

From repository root after installing dependencies:

    npm install
    npm run doctor
    npm run check
    npm run shift:start
    npm run shift:ios
    npm run shift:android
    npm run bundle:shift

Or run from \`apps/shift-calendar\` with \`npm run start\`. Local iOS requires Xcode/Simulator and Android requires Android Studio/emulator.

## Working MVP scope

- One local shift per START date; Day, Evening, Night and Day Off.
- Personalizable start/end times in 24-hour HH:mm, optional notes (max 160 characters).
- Overnight shifts attributed to the start date.
- Week strip and month calendar; upcoming or currently active shift; monthly scheduled hours and count.
- Three repeating rotation presets (4 on/4 off, 2 days + 2 nights + 4 off, 2–2–3), configurable shift hours, 28/56/84-day fill.
- **Non-destructive** rotation import: any existing day entry is preserved, including Day Off.
- Local SQLite database, atomic pattern inserts, opt-in local reminders (one hour before shifts), CSV export and confirmation-gated deletion.
- Dark/light visual treatments from \`@foundry/design-system\`; accessible labels and 44pt+ primary actions.

## Explicit non-goals / limitations

- Not a time clock, wage calculator, overtime/tax advisor, staff rostering backend, or substitute for employer schedules.
- No login, cloud sync, multi-device backup/import, calendar synchronization, widget, subscriptions or analytics. Do not advertise these features.
- Reminders are best effort; only next 30 days (max 32 pending) are scheduled when the app opens or data changes. Power-saving, permissions and timezone changes may affect delivery.
- Dates are local calendar days. Nominal hours don't subtract breaks or correctly represent payroll time through DST changes.
- Language: English-first. Internationalization and week-start customization are future work.
- No final app icon, store screenshots, privacy URL, legal clearance, IAP listing or production signing yet.
- No complete native device QA has been performed via the GitHub connector alone.

## Acceptance tests

1. Save a Night shift 23:00–07:00; it remains active at 03:00 on the next calendar day.
2. Navigate across a year boundary; calendar dates stay correct.
3. Fill rotation over a manually entered Day Off; existing entry stays intact.
4. Edit and delete a shift; restarting app retains edits.
5. Turn reminders on only after user action, then edit a future shift; scheduled reminders refresh.
6. Export CSV containing quotes and formula-like note; result is safely escaped.
7. Dark/light, large text, screen reader, smallest supported phone/tablet, offline and airplane mode validated on device.

Run \`npm run check\` for domain and contract checks; follow [design quality gate](../../docs/design/QUALITY-GATE.md) for device verification.

## First-user feedback hypothesis

A rotating worker can answer **"When is my next shift?"** in less than five seconds and fill two weeks of shifts without overwriting corrections. Test with five target users before adding monetization.
