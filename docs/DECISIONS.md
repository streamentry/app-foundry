# Architecture decision log

## 0001 — Expo and npm workspaces (2026-11-14)

**Context:** A portfolio of differentiated mobile utilities needs cheap maintenance, automated quality checks and low overhead.

**Decision:** Expo SDK 58, React Native 0.88, React 19.3, TypeScript strict, Expo Router and npm workspaces. Keep logic per app and share pure logic only after use in multiple products. No telemetry or backend in the starter.

**Alternatives:** Flutter (more consistent custom rendering), SwiftUI (best iOS integration but limited Android reuse), pnpm (efficient dependency storage but adds workspace configuration).

**Known bootstrap debt:** No npm registry access in authoring environment; create lockfile locally, confirm Expo dependency matrix, run simulators and tighten CI to `npm ci`.

**Revisit:** When native iOS requirements dominate or shared infrastructure becomes costly.
