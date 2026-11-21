# Shift Calendar v0.1 — manual acceptance and release gate

## Automated

- TypeScript strict compile for all workspaces
- Domain tests: leap years, Monday-first month grid, overnight time, active next shift, non-destructive rotation, invalid clock inputs, CSV formula injection
- ESLint and Expo SDK dependency compatibility

## Local simulator and emulator smoke evidence (2026-11-16, 2026-11-18)

- Xcode 27.2 built the Release configuration for an iOS 26.5 iPhone 17 Pro simulator with bundle ID `app.runlumi.tiniapps.shiftcalendar`.
- The embedded-bundle app launched on a fresh simulator install and showed the empty-roster screen. Screenshot: [iOS 26.5 clean install](qa/ios26.5-clean-install.png).
- Android 16 (API 36) Pixel 7 emulator smoke (2026-11-18): `expo run:android` built and installed the debug app. The clean roster opened, the shift editor opened, a Day shift saved, and the saved shift remained after force-stop and relaunch. Screenshots: [clean roster](qa/android-api36-debug-install.png), [shift editor](qa/android-api36-add-shift-screen.png), and [saved shift after relaunch](qa/android-api36-day-shift-relaunch.png). This is limited emulator evidence, not a store-signed build or physical-device acceptance.
- Android `bundleRelease` completed and produced an AAB targeting API 36, but the generated bundle uses the debug signing configuration. It is **not uploadable to Google Play**.
- This smoke check did not cover schedule edits, rotations, notifications, CSV sharing, deletion, accessibility settings, RTL, offline behavior, or timezone changes.
- No physical Android device is attached. These simulator/build checks are not owner signoff or store readiness.

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

- Store account sign-in, app record creation, bundle/package identifier availability, production signing, screenshots, and final store metadata
- Manual iOS and Android functional/accessibility QA, user feedback, and legal review for intended markets
