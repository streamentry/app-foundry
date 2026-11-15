# App Foundry

**Ten independent offline-first mobile utilities, one engineering foundation.**

Expo SDK 58 + React Native + TypeScript with app-specific branding and screens. The internal design gallery remains in apps/starter.

## Run

Requirements: Node 22+, npm 10+, iOS Xcode/Simulator or Android Studio for native runtime.

    npm ci
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

**Dependency installs:** Commit `package-lock.json` and use `npm ci` in CI and for a clean local checkout. **Still unfinished:** real iOS/Android device QA, accessible interaction review, original branding, store registration and privacy disclosures. Do not publish yet.


## 100 additional working research prototypes

The [100 idea backlog](docs/ideas/README.md) now has **100 separately launchable offline Expo research apps** under `apps/ideas/<slug>/`. These reuse a typed workflow engine (13 workflow types, targeted formula rules), rather than 100 bespoke production UIs. They are **not 100 release-ready consumer products**.

```sh
npm install
npm run idea:lab                         # browse and test all 100 in one app
npm run idea:start -- cash-float-count  # launch standalone app by slug
npm run idea:verify                      # validate all 100 manifests
npm run idea:smoke                       # representative iOS + Android JS bundles
```

Read [implementation status](docs/ideas/BUILD.md) and [device QA checklist](docs/ideas/QA.md). Store release requires original individual UX and design, not just this working prototype.

## First promoted research candidate — Counter Close

Cash Drawer Count (idea 012) now has a **bespoke standalone counting workflow**, separate from the generic Idea Lab renderer. It supports four currency presets, physical bill/coin counts, optional POS over/short reconciliation, local draft recovery, receipt history, and deliberate CSV/JSON backup. This is a **technical release candidate, not a validated or published app**.

    npm run cash:start
    npm run cash:test
    npm run cash:bundle

Read the [product README](apps/ideas/cash-float-count/README.md), [receipt-led design](docs/design/apps/cash-float-count.md), and [merchant research test](docs/research/CASH_CLOSE_PILOT.md).

## Second promoted research app: Hours Left

[Hours Left / Retainer Hours Ledger #097](apps/ideas/freelance-retainer-hours/README.md) is a standalone, **minute-exact prepaid-client-hours ledger** with its own information architecture and visual identity. It is not a generic Idea Lab screen, a timer, an invoice generator, or proof of market demand.

    npm run retainer:start
    npm run retainer:test
    npm run retainer:bundle

[Design](docs/design/apps/freelance-retainer-hours.md) · [Decision](docs/ideas/DECISIONS/2026-11-15-retainer-hours.md) · [Pilot](docs/research/RETAINER_HOURS_PILOT.md).


## Real-user retainer pilot (no participants observed yet)

The [five-person Hours Left study kit](docs/research/retainer-hours/README.md) includes consent-first recruitment scripts, a task-card pair, a moderator answer key, counterbalanced assignment and a result evaluator that cannot claim success with missing data. The default result is NOT_EVALUABLE. Physical iPhone testing with SDK 58 needs a signed build, not public iPhone Expo Go.

    npm run retainer:pilot
    npm run retainer:pilot:test

## Third independent research app: Folio invoice references

[Invoice Number Ledger #011](apps/ideas/invoice-number-ledger/README.md) is a standalone offline reference lifecycle experience, not a generic Idea Lab app or an invoice creator. It tracks reserved / issued / void status, explicit external backfill and locally unaccounted ranges, with a user-initiated CSV/JSON export.

    npm run invoice:start
    npm run invoice:test
    npm run invoice:bundle

[Design](docs/design/apps/invoice-number-ledger.md) · [Decision](docs/ideas/DECISIONS/2026-11-15-invoice-number.md) · [Pilot](docs/research/INVOICE_NUMBER_PILOT.md). This remains an **unvalidated** opportunity, not permission to release or charge users.
