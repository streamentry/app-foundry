# App Foundry

A lean, experiment-led Expo / React Native monorepo for independently differentiated mobile utilities.

## Start the interactive design lab

Node >=22.13 and npm >=10 required. Xcode / Android Studio are needed for local device builds.

```sh
npm install
npm run doctor
npm run check
npm run start
# npm run ios    (iOS Simulator)
# npm run android (Android Emulator)
```

The starter app is a **design gallery**: select any of ten app concepts to see its own light/dark palette, typography, shape, information hierarchy and functioning preview interaction. It intentionally contains no production user data or telemetry.

## Folder map

```text
apps/starter/              Design gallery (Expo Router)
packages/core/             Shared pure product-independent logic
packages/design-system/    Ten authored app themes + foundation tokens + contrast tests
docs/design/               Product-specific design briefs and platform guidance
docs/templates/            Experiment + app design brief templates
.github/workflows/         CI checks
```

The app identities are internal *design directions*, not released product names. **Do not ship the starter** or merely re-skin it for separate listings. Each production app needs its own distinct workflow, copy, icon, bundle ID and store position.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run start` | Start Expo design gallery |
| `npm run ios` / `npm run android` | Run device simulator |
| `npm run check` | Types, unit/contrast tests, architecture |
| `npm run lint` | ESLint |
| `npm run doctor` | Expo dependency compatibility |
| `npm run format` / `npm run format:check` | Prettier |

## Product process

1. Write [an experiment brief](docs/templates/EXPERIMENT.md) and make the cheapest demand test.
2. Draft [an app-specific design brief](docs/templates/APP-DESIGN-BRIEF.md).
3. Ship the smallest distinct offline-first experience; use the shared design contract, not a shared visual template.
4. Measure acquisition, activation, retention, accessibility and net revenue. Improve or archive without sunk-cost thinking.

Engineering and quality: [AGENTS.md](AGENTS.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [DESIGN.md](DESIGN.md) · [Vision](VISION.md) · [Agentic SDLC](docs/SDLC.md) · [Security](docs/SECURITY.md) · [Release](docs/RELEASE.md).

**Bootstrap debt:** No reproducible lockfile yet (CI temporarily installs without one). No native build, screenshots or app-signing verification has been completed. Generate and commit `package-lock.json`, switch CI to `npm ci`, and perform device QA before production release.
