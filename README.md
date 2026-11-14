# App Foundry

**Ten independent offline-first mobile utilities, one engineering foundation.**

Expo SDK 58 + React Native + TypeScript with app-specific branding and screens. The internal design gallery remains in apps/starter.

## Run

Requirements: Node 22+, npm 10+, iOS Xcode/Simulator or Android Studio for native runtime.

    npm install
    npm run check
    npm run lint
    npm run doctor
    npm run plant-watering:start

## Products

| Directory | Product |
| --- | --- |
| apps/shift-calendar | Signal: rotating shifts and work schedules |
| apps/countdown-widget | Orbit Countdown |
| apps/medication-checklist | Clarity Medication Log |
| apps/baby-feeding-log | Nest Baby Log |
| apps/plant-watering | Canopy Plant Care |
| apps/pet-medication | Companion Pet Care |
| apps/mileage-log | Ledger Mileage |
| apps/warranty-tracker | Archive Warranty |
| apps/cleaning-schedule | Tempo Household |
| apps/elderly-routine | Daylight Routine |

Run any product with npm run <app-slug>:start, e.g. npm run mileage-log:start, or with npm run ios -w @foundry/<app-slug>.

## Testing

    npm run check
    npm run lint
    npm run doctor
    npm run bundle:portfolio

The CI pipeline also bundles Shift Calendar. Bundling is **not a signed native build** and does not verify actual device functionality.

Read docs/PORTFOLIO.md, AGENTS.md, DESIGN.md, ARCHITECTURE.md, docs/SDLC.md, and the relevant app README.

## Shared foundations

- packages/design-system: unique semantic identities and contrast tests.
- packages/mobile-kit: date utilities, serial local SQLite KV persistence, accessible input primitives.
- packages/core: earlier domain-independent primitives.

Each app owns its user workflows and design composition, not just a color skin.

**Unfinished:** generated dependency lockfile and npm ci, real iOS/Android device QA, accessible interaction review, original branding, store registration and privacy disclosures. Do not publish yet.
