# App Foundry Architecture

Ten independent Expo app packages coexist under apps/*. The earlier Shift Calendar uses its own relational SQLite tables and local notifications; the other nine use a small shared SQLite-backed key-value hook.

## Layers

- apps/<slug>/app/index.tsx — distinctive, product-specific screen and interactive workflow.
- apps/<slug>/src/domain.ts — pure validation, recurring cadence, date math and record logic; Node tests.
- packages/mobile-kit/src/dates.ts — local date-only arithmetic, safe CSV cell escaping.
- packages/mobile-kit/src/store.ts — serialized asynchronous writes to app-private SQLite KV store.
- packages/mobile-kit/src/ui.tsx — semantic buttons, date/time pickers and accessible inputs.
- packages/design-system — semantic light/dark visual identity, not a generic interchangeable layout.

## Privacy, safety and constraints

Each app's OS sandbox and bundle ID are separate; no backend or account. Data cannot automatically follow users to other devices, and recordkeeping-sensitive apps require a documented recovery and privacy policy before publication. Medical, pet and elderly apps make no diagnostic or clinical claims; do not market local reminders as guaranteed safety alarms. No production signing, payment or GPS configured.

Only create more shared abstraction when repeated real product needs justify it. See docs/PORTFOLIO.md and docs/RELEASE.md.
