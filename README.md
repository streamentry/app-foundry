# App Foundry

A lean, experiment-led Expo / React Native monorepo for independently differentiated mobile utilities.

## Quick start

Requires Node >=22.13, npm >=10, and device tooling for iOS/Android.

```sh
npm install
npm run doctor
npm run check
npm run start
```

For iOS Simulator use `npm run ios`; for Android Emulator `npm run android`. The demo screen is in `apps/starter/app/index.tsx`.

**Bootstrap note:** Installation and native verification could not be executed in the authoring environment because npm registry access was unavailable. CI starts with `npm install --package-lock=false`. Generate and commit `package-lock.json` locally and switch CI to `npm ci` before calling the foundation production-ready.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run start` | Start Expo |
| `npm run ios` / `npm run android` | Simulator or emulator |
| `npm run check` | Types, tests and architecture contract |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier (run after formatting scaffold) |
| `npm run doctor` | Expo dependency compatibility check |

## Operating model

1. Write an experiment using `docs/templates/EXPERIMENT.md` before building.
2. Find a differentiated user job with a realistic organic distribution hypothesis.
3. Ship the smallest offline-first experience, measure real behavior and preserve user privacy.
4. Continue, improve or retire based on declared evidence thresholds.

See [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), [VISION.md](VISION.md), [ARCHITECTURE.md](ARCHITECTURE.md), [docs/SDLC.md](docs/SDLC.md), [docs/SECURITY.md](docs/SECURITY.md), and [docs/RELEASE.md](docs/RELEASE.md).

Do not release the generic starter as a consumer app. Each production app needs its own bundle ID, UX, identity, data policy, store listing, signing and device QA.
