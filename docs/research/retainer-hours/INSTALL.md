# Physical-device setup for the five-person Hours Left pilot

**Build status: NOT BUILT OR SIGNED.** The CI JavaScript exports are not installable IPA/APK files.

This repository uses Expo SDK 58. Expo's public App Store iPhone Expo Go is not a compatible testing route for SDK 58. On iPhone, use a signed native distribution build with registered test devices or TestFlight. Android can use a matched Expo Go build or a signed internal APK.

Official documentation:
- Expo SDK / Go mismatch: https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/
- Internal distribution: https://docs.expo.dev/build/internal-distribution/
- Build monorepos: https://docs.expo.dev/build-reference/build-with-monorepos/
- Build setup: https://docs.expo.dev/build/setup/

## Fastest observed session: researcher's Android phone

At repo root:

    npm ci
    npm run retainer:start

Install a **compatible Android Expo Go** from https://expo.dev/go (select SDK 58), and scan the QR code while on the same Wi-Fi. Current Google Play Expo Go may lag the SDK. Expo CLI runs on the researcher's laptop and must remain active. If Android Go is incompatible, use the signed APK route below.

Do not ask remote participants to run a dev server unless they are comfortable with development tools. For nontechnical participants, lending a pre-installed test device or using an internal distribution build is much better.

## Shareable Android pilot APK

The app directory now contains an internal-only build profile in eas.json. It prepares *configuration*, not a cloud account or binary. Actual build commands require the user's Expo login, potential cloud quotas and Android signing approval.

    npm ci
    cd apps/ideas/freelance-retainer-hours
    npx eas-cli@latest login
    npx eas-cli@latest init
    npx eas-cli@latest build --platform android --profile pilot

EAS initialization links this app to the actual Expo project and can update app config. Review the changed app.json before committing. EAS prompts about signing, or uses existing credentials. If successful, share the actual build link with opted-in pilot participants only. The internal profile creates a directly installable Android APK rather than store AAB.

**Neither the Expo account nor the APK exists yet in this repo.** Do not invent an installation link.

## Shareable iOS pilot build

A **paid Apple Developer Program team**, app signing credentials and test-device registration are required for ad hoc distribution.

    cd apps/ideas/freelance-retainer-hours
    npx eas-cli@latest device:create
    npx eas-cli@latest build --platform ios --profile pilot

Register every consenting test device **before** the build; iOS ad hoc profiles allow only the listed devices. TestFlight is an alternative and needs Apple setup. Building an IPA or adding unknown devices cannot be done simply by checking in eas.json.

## Before giving a phone to someone

- Confirm app launches, date selection works, save persists after force-close, sharing produces a real text statement.
- Confirm an empty state contains no invented client records. Use fictional scenario data only.
- Confirm content is legible on the target device; test app has no login or analytics.
- After a tester finishes, delete the fictional period or reset app storage before the next person. Never leave one test subject's annotations accessible to the next.
- Don't require real invoices, client contact info, passwords, or secrets.
- Keep a research device on the same timezone throughout to avoid confusing calendar dates.

**Stop if you cannot provide the app on a tester's device:** test access is a real release prerequisite, not a reason to record imaginary user tests. The repository and pilot evaluator cannot create consenting human participants.
