# Shift Calendar store listing draft

**Status: owner approved the name, icon, and candidate ID. Store records, identifier availability, screenshots, and final listing metadata are not yet confirmed.**

## Identity proposal

- Publisher/site: Tini Apps
- Approved store name: **Tini Shift Calendar** (19 characters)
- Approved bundle/package ID: `app.runlumi.tiniapps.shiftcalendar` (availability not checked)
- Approved icon: [`assets/icon.png`](assets/icon.png); Android uses a derived adaptive foreground.
- Support: `app@cjs.vn`
- Privacy: <https://tiniapps.runlumi.app/privacy/>
- Support page: <https://tiniapps.runlumi.app/support/>
- Category: Productivity (candidate)

The stores already contain several products called “Shift Calendar,” including
[App Store](https://apps.apple.com/us/app/shift-calendar-schedule/id994771057)
and [Google Play](https://play.google.com/store/apps/details?id=ShiftCalendar.Package)
listings. “Tini Shift Calendar” is a more distinctive candidate, but this quick
search is not trademark clearance or confirmation that the name and identifier
are available in the developer accounts.

## App Store fields

- Name: Tini Shift Calendar
- Subtitle: Rotating schedules, made clear (30 characters)
- Promotional text: Leave blank for first release.
- Category: Productivity (candidate)
- Privacy policy URL: <https://tiniapps.runlumi.app/privacy/>
- Support URL: <https://tiniapps.runlumi.app/support/>
- Screenshots: capture from the approved production build after iOS device QA.
- Age rating: answer the current App Store Connect questionnaire.

## Google Play fields

- App name: Tini Shift Calendar
- Short description: “See your next shift, plan rotations and keep your schedule on your device.” (74 of 80 characters)
- Full description:

  Shift Calendar helps people with rotating hours plan day, evening, night, and
  day-off shifts in a personal calendar.

  - See today’s and upcoming shifts in week and month views.
  - Fill repeating rotations without replacing shifts or days off already entered.
  - Set optional local reminders. Delivery is best effort.
  - Export your roster as CSV when you choose.

  Your schedule stays on your device. The app has no account, cloud sync,
  advertising, or analytics. It is not a time clock, payroll calculator,
  employer roster, or cloud backup.

- Privacy policy: <https://tiniapps.runlumi.app/privacy/>
- Support email: `app@cjs.vn`
- Support website: <https://tiniapps.runlumi.app/support/>
- Screenshots: capture from the approved production build after Android device QA.
- Data safety and content rating: complete in Play Console from the final binary and SDK inventory.

## Release gates still open

- Create the store app records and confirm the approved bundle/package ID is available in both consoles. No authenticated console state or identifier availability has been read back in this task.
- Production signing, signed builds, and store submission profiles. No valid Apple signing identity is installed in the current keychain, and no Android upload keystore is present in this workspace. No EAS CLI or Expo account is configured.
- Required iOS and Android functional, accessibility, notification, export, and deletion QA on devices.
- Store screenshots from the production app and final App Store Connect / Play Console metadata.
- Legal review of the privacy notice for intended markets. It currently describes app behavior but does not certify compliance with every applicable law.
- User reports the Google Play personal-account closed-test requirement does not apply; account type has not been independently verified.

## Local build evidence (updated 2026-11-18)

- iOS Release simulator build compiled with Xcode 27.2 and rendered the empty-roster screen on iOS 26.5. See [QA evidence](qa/ios26.5-clean-install.png).
- Android 16 (API 36) Pixel 7 emulator smoke on 2026-11-18 installed the debug app, saved a Day shift, and confirmed it remained after force-stop/relaunch. Screenshots are recorded in [QA.md](QA.md).
- Android `bundleRelease` produced a target-API-36 AAB, but Gradle signed it with the debug keystore. It must not be submitted to Play.
- No physical-device QA was done. The emulator smoke does not cover rotations, notifications, CSV export, deletion, large text, TalkBack, RTL, offline behavior, timezone/DST changes, or production signing.
