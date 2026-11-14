# Architecture

## Strategy

Build focused consumer apps, not a generic factory. `app-foundry` shares engineering contracts, accessibility and semantics—not a single brand appearance.

```text
apps/starter/                 Expo SDK 58, Expo Router visual design lab
  app/                       File-based routes for gallery + per-app preview
  src/components/            Gallery-only visual compositions
packages/core/               Pure domain-agnostic logic, unit tests
packages/design-system/      Platform-agnostic named palettes, distinct themes, tests
docs/design/                 App-specific visual/interaction briefs
.github/workflows/           Typecheck, test, lint and Expo validation
```

## Dependency boundaries

- npm workspaces and TypeScript strict; React Native 0.88 and Expo SDK 58.
- `packages/design-system` has **no React Native dependency**: it exports semantic color/typography/shape/density profiles and the common accessibility contract. This makes tokens testable without device tooling.
- Screen compositions in `apps/starter/src/components/ThemeHero.tsx` are **design prototypes**, not a reusable consumer UI kit; real apps own their screens and business logic.
- Product UI ownership stays within `apps/<product>`. Move UI components into a shared package only when repeated real product use proves the abstraction won't homogenize design.
- Start offline-first with no remote account. Add SQLite, payment processing, notifications, synchronization or server components after specific user needs and privacy reviews.
- Each app owns bundle IDs, legal brand identity, platform entitlements, accessibility tests and store assets. Don't reuse one app listing or republish indistinguishable shells.

## Native edge

Expo and React Native are sufficient for most trackers/calendars. Widgets, high-frequency background location, native iOS controls or Apple-specific effects may warrant app-local native modules or SwiftUI; do not reimplement native behavior in a fragile cross-platform imitation.

## ADR

See [docs/DECISIONS.md](docs/DECISIONS.md). Prioritize package alignment and a lockfile before production builds.
