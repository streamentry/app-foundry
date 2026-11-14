# Architecture decision log

## 0001 — Expo + npm workspaces (2026-11-14)

Small distinct apps need efficient maintenance, reliable updates and low operational overhead. Use Expo SDK 58, React Native 0.88, React 19.3, strict TypeScript, Expo Router and npm workspaces. Keep shared code pure where possible, local-first by default. A reproducible lockfile is pending before production release.

## 0002 — Independent brands over one UI template (2026-11-14)

**Decision:** A pure TypeScript `packages/design-system` holds ten app-specific semantic design profiles and a small shared foundation. The starter is a design gallery, not a consumer app template. Navigation follows native conventions; app-specific content and interactions stay within each app.

**Why:** A generic visual template saves design time but risks poor audience fit, App Store clone/spam rejection and weak positioning. A shared system should make accessible, maintainable distinct products cheaper—not erase their individuality.

**Alternative:** One universal brand theme with selectable accent colors. Rejected: inadequate differentiation. Full bespoke components in every app remain an option when justified by real use.

**Revisit:** If maintaining the design package costs more than sharing it saves, if visual directions converge, or platform-specific native UI materially improves the product.
