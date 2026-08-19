# Running ALTER as a native app (Capacitor)

The app is 100% client-side (zustand + `localStorage`, no API routes,
no server actions), so it static-exports cleanly and needs no server at
runtime — a good fit for wrapping as a real installable app with
[Capacitor](https://capacitorjs.com).

This repo already has:
- `next.config.ts` set to `output: "export"` (produces `out/`)
- `capacitor.config.ts` (`appId: com.altersimulation.app`, `webDir: out`)
- `android/` — a real Android Studio/Gradle project
- `ios/` — a real Xcode project

**Both native projects were generated in this sandbox (no Xcode/Android
Studio needed just to scaffold them), but building/running them needs
tools this cloud environment doesn't have** — Xcode requires macOS, and
the Android SDK/emulator needs a full local install. Everything below
runs on your own machine.

## Android (works on Mac/Windows/Linux)

Prerequisite: [Android Studio](https://developer.android.com/studio)
installed (it bundles the SDK and an emulator).

```bash
git clone <this repo>, checkout this branch
npm install
npm run cap:android   # builds the static export, syncs it into android/, opens Android Studio
```

In Android Studio: let Gradle sync finish, pick a virtual device (or
create one via Device Manager), hit **Run**. ALTER launches as a real
app — icon, splash, no browser chrome.

## iOS (needs a Mac)

Prerequisites: Xcode + CocoaPods (`sudo gem install cocoapods` if you
don't have it).

```bash
npm install
npm run cap:ios        # builds the static export, syncs it into ios/, opens Xcode
cd ios/App && pod install && cd ../..   # first time only
```

In Xcode: pick a Simulator (e.g. iPhone 16) from the device dropdown,
hit **Run** (▶).

## Iterating

Every time you change app code, re-sync before testing on device/simulator:

```bash
npm run cap:sync   # or npm run cap:ios / npm run cap:android to also reopen the IDE
```

For faster iteration than a full rebuild-and-copy each time, Capacitor
supports live-reload against a running `next dev` server — set
`server.url` in `capacitor.config.ts` to your machine's LAN IP (e.g.
`http://192.168.1.23:3000`) and `server.cleartext: true`, run `npm run
dev`, then `npx cap run android` / `ios`. Remove that `server` block
before building a real release (it should load the bundled static
files, not depend on a dev server being up).

## Before shipping to the App Store / Play Store

Not done yet, in order:
1. Real app icon + splash screen (`assets/icons`, `assets/images` are
   currently empty placeholders — see `npx @capacitor/assets generate`
   once real artwork exists).
2. Bundle identifier / signing — `com.altersimulation.app` is a
   placeholder; register a real one in App Store Connect / Play
   Console and update `capacitor.config.ts`'s `appId` (changing it
   after the first submission is painful, so lock it in early).
3. Push notifications, in-app purchases (`services/payments`), and
   real auth (`services/auth`) are still stub interfaces — see
   `docs/database/schema.md` and the service files themselves for what
   swapping in real providers looks like.
4. Privacy policy + App Store / Play Store listing content.
