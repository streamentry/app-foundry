# Shift Calendar v0.1 — manual acceptance and release gate

## Automated

- TypeScript strict compile for all workspaces
- Domain tests: leap years, Monday-first month grid, overnight time, active next shift, non-destructive rotation, invalid clock inputs, CSV formula injection
- ESLint and Expo SDK dependency compatibility

## iOS/Android device QA required before publishing

1. On a clean install, home is empty and readable, with no sample shifts silently inserted.
2. Add Day shift and Night shift; verify local SQLite data persists after force-close and app restart.
3. Add a Night shift on Saturday (23:00–07:00) and confirm the next day remains independent.
4. Rotate 2 days/2 nights/4 off across a year boundary; manually edit one day, rerun rotation and confirm edit is preserved.
5. Navigate week/month on small screen and tablet. Test 200% text scaling, VoiceOver/TalkBack, dark mode, RTL localization expansion.
6. Enable local reminders, verify native permission dialog and schedule; edit/delete a future shift and ensure obsolete reminders are cancelled.
7. Revoke notifications at OS level; verify UI does not falsely promise delivery. Reopen app after 30 days; verify new reminders are refreshed.
8. Export to CSV using iOS/Android share sheet. Confirm correct escaping of notes containing commas, quotes, leading =, +, - and @.
9. Delete All Shifts via destructive confirmation, restart and verify empty roster. Ensure unrelated notifications are not cancelled.
10. Check actual timezone changes, DST crossings, orientation, offline mode, keyboard overlap and safe areas.

## Explicit unfinished work

- Production bundle IDs, unique app icon and localized screenshots, legal/privacy review, App Store Connect metadata and genuine customer demand evidence
- Signed builds on device, automated E2E tests, accessibility and localization fixes discovered by field testing
- Committed npm lockfile and strict \`npm ci\` CI
