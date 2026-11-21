# Shift Calendar · Privacy and data behavior (pre-release)

**Status:** Internal data-behavior reference. A factual public notice is live at <https://tiniapps.runlumi.app/privacy/>. It is not legal clearance for every target market or a completed store submission review.

Before using it as final store policy, confirm the production SDK inventory, store disclosures, intended markets, and applicable privacy obligations with the responsible legal/business owner. Public privacy and support contact: `app@cjs.vn`.

## Data stored

- Calendar entries: start date, shift type, optional work hours, and an optional 160-character personal note.
- Reminder preference.
- Records are stored in the app's on-device SQLite database; no server, login, advertising SDK, tracking, analytics or personal account is configured.

## Optional notifications

- Tapping Enable Reminders requests operating-system notification permission.
- The app schedules local reminders one hour before upcoming shifts in the next 30 days, limited to 32 pending notifications.
- Notifications contain shift kind, date and start time, never personal notes. No push token is collected or sent to a backend.
- Best-effort delivery only. Users can revoke permission in system settings or turn reminders off in the app.

## Sharing and deletion

- CSV export is initiated by the user and handed to the platform share sheet. Third-party storage or sharing is chosen by the user.
- Delete All Shifts is confirmation-gated and removes roster records on-device; exported files outside the app are not deleted.
- Uninstalling deletes app-local records unless the OS preserves them in a device backup. Do not promise absolute device-wide erasure.

## Security boundaries

No app-managed account or encrypted field storage is included. Device encryption and OS access controls apply. Do not store secrets or sensitive medical notes in a shift note. Any future cloud sync requires an explicit privacy and security design review.
