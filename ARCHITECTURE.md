# Architecture

The repository hosts **distinct products**, not a single repackaged app.

\`\`\`text
apps/starter/                  Expo design gallery; not a consumer product
apps/shift-calendar/           First usable shift scheduler
  app/                         Expo Router: home, edit, rotation, settings
  src/domain/                  Pure calendar/rotation/payroll-exclusion logic
  src/data/                    Local SQLite; atomic inserts and parameterized writes
  src/services/                Optional local reminders and CSV export
  src/ui/                      App-local Signal visual/interaction design
  tests/                       Pure Node TypeScript domain tests
packages/core/                 Pure shared code, if proven needed
packages/design-system/        Semantic themes and contract tests
docs/                          Product and design playbooks
.github/workflows/             CI
\`\`\`

## Boundaries

- React Native 0.88 + Expo SDK 58 + TypeScript strict + Expo Router, npm workspaces.
- \`apps/*\` owns product data model, navigation, brand identity, platform permissions, and release metadata.
- \`packages/design-system\` exports only semantic accessibility and brand tokens; screens are app-specific. Shared UI is allowed only after true reuse.
- SQLite is local, device-contained and has no remote API. One shift per starting calendar date. Date-only keys avoid day shifting due to UTC conversion.
- Rotation inserts use an exclusive transaction with \`INSERT OR IGNORE\` so manual edits and off days are never overwritten.
- Optional local notifications are user-approved and schedule a rolling 30-day window, maximum 32 pending. They are best effort, not guaranteed.
- CSV export uses OS share sheet. Notes are spreadsheet-formula escaped; no background uploads.
- No account, subscription, tracking, analytics, location, cloud sync or runtime-generated remote code.
- User actions and irreversible operations require confirmation; publishing/signing requires human approval.

See \`apps/shift-calendar/README.md\` and \`docs/design/apps/shift-calendar.md\`. Revisit architecture only after two independently successful apps show a repeated need.
