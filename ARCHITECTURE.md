# Architecture

## Strategy

Start with one real Expo application and a small reusable pure TypeScript package. **Do not** create a generic app generator, shared database or global theme before repeated needs justify them.

```text
apps/starter/             Expo SDK 58, React Native 0.88
  app/                    Expo Router file-based navigation
  src/                    App-owned UI and presentation
packages/core/            Pure TypeScript logic and tests
docs/                     Product, security, SDLC and release playbooks
.github/workflows/        Automated checks
```

## Dependencies

- npm workspaces, Node 22 LTS compatible, TypeScript strict, Expo SDK 58.
- Platform dependency versions are reconciled with `npx expo install --fix` then locked. Do not assume generic React Native versions are compatible with an Expo SDK.
- Native builds: Expo prebuild/CNG and EAS Build only when needed. Avoid committing generated `ios/` or `android/` directories without explicit reason.
- Build profile and app identity belong to each app. Never reuse production bundle IDs.

## Data and privacy

Local-only by default; add SQLite when data requires durable structured querying. Store no secrets in AsyncStorage or client environment variables. If authentication or sensitive medical/child data is introduced, require a security/privacy design review, threat model and appropriate retention/deletion policy before implementation.

## Growth threshold for shared code

Promote code into `packages/` only after it is stable in at least two apps and the shared abstraction is simpler than duplication. Shared UI should be primitives/design contracts, not shared product branding. Split apps into independent repos if release isolation or permissions become a bigger concern than reuse.

## Recommended add-ons (intentionally not installed)

RevenueCat for paid features; consent-aware analytics after privacy policy and event taxonomy; crash reporting; i18n; notifications and widgets. Add each only after a specific app needs it, with separate configuration and tests.
