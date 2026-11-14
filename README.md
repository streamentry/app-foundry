# App Foundry

A lean, experiment-led React Native / Expo monorepo for **independent mobile utilities**.

## First product: Shift Calendar (MVP)

The first functional app is [Shift Calendar](apps/shift-calendar/README.md), a local-first shift scheduler with day/month calendar, customizable shifts, non-destructive repeating rotations, opt-in local reminders, CSV export and deletion controls.

\`\`\`sh
npm install
npm run doctor
npm run check
npm run bundle:shift
npm run shift:start
# npm run shift:ios
# npm run shift:android
\`\`\`

The earlier [design gallery](apps/starter/) remains available with \`npm run start\`.

## Monorepo map

- \`apps/shift-calendar/\` — functional first product (pre-release).
- \`apps/starter/\` — independent design identities gallery, **not** a product to publish.
- \`packages/design-system/\` — semantic themes and contrast test contracts, not a shared consumer UI.
- \`packages/core/\` — small, pure, reusable primitives.
- \`docs/\` — market experiments, app design briefs, security and agentic SDLC.

## Engineering loop

1. Write \`docs/templates/EXPERIMENT.md\`; validate target audience, demand and distribution.
2. Write \`docs/templates/APP-DESIGN-BRIEF.md\`; ensure distinct user flows, not palette-swapped clones.
3. Implement a reversible, offline-first MVP; test domain logic and visual/native behavior.
4. Run \`npm run check && npm run lint && npm run doctor\`; run \`npm run format:check\` after formatting baseline.
5. Review with target users, measure organic acquisition/activation and net revenue, improve or archive.

Read \`AGENTS.md\`, \`DESIGN.md\`, \`ARCHITECTURE.md\`, \`docs/SDLC.md\` and the app's README.

**Production blockers:** Generate and commit \`package-lock.json\`, change CI to \`npm ci\`, run native simulator/device QA, finalize brand/icon/privacy URL, configure signing and release pipeline. Nothing is automatically published.
