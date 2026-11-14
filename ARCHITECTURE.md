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


## 100 app research laboratory (stacked work)

The next 100 ideas are **independent app packages**, not additional released apps. `apps/ideas/<slug>` contains unique Expo identifiers, app entrypoints and manifests. Root workspaces now include `apps/ideas/*`. Each app's local records stay in its own iOS/Android sandbox; in `apps/idea-lab` they are namespaced by slug but still local to that single lab installation.

`packages/idea-engine` contains:
- 100 explicit product schemas and job-specific actions from `docs/ideas/ideas.json`
- 13 workflow models (counter, inventory, deadline, log, checklist, practice, etc.)
- pure domain validation and formula rules with automated tests
- a prototype renderer with accessible inputs and contextual actions
- CSV export and user-initiated JSON backup / paste restore
- dark/light palette research directions shared across categories

This saves development time but **cannot create 100 original product identities**. Each app must eventually own a bespoke first screen and differentiated flow, native QA and legal/store compliance. Do not publish these research screens as 100 store listings. The team must not confuse a compiled bundle with a release-ready iOS or Android app.
