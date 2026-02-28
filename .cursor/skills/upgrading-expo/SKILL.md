---
name: upgrading-expo
description: Guides through upgrading Expo SDK versions safely. Walks step-by-step upgrade process, identifies deprecated packages and replacements, cleans outdated config (babel, metro, postcss), handles cache clearing for managed and bare workflows. Use when upgrading Expo SDK, fixing dependency conflicts after upgrade, migrating from deprecated packages (expo-av to expo-audio/expo-video), or cleaning legacy configuration.
---

# Upgrading Expo

## References

- [references/new-architecture.md](references/new-architecture.md) — SDK 53+: New Architecture migration
- [references/react-19.md](references/react-19.md) — SDK 54+: React 19 (useContext → use, forwardRef removal)
- [references/react-compiler.md](references/react-compiler.md) — SDK 54+: React Compiler setup
- [references/native-tabs.md](references/native-tabs.md) — SDK 55+: Native tabs (Icon/Label/Badge via NativeTabs.Trigger.*)
- [references/expo-av-to-audio.md](references/expo-av-to-audio.md) — expo-av → expo-audio
- [references/expo-av-to-video.md](references/expo-av-to-video.md) — expo-av → expo-video

## Beta/Preview Releases

Beta versions use `.preview` suffix (e.g., `55.0.0-preview.2`), published under `@next`.

Check if latest is beta: https://exp.host/--/api/v2/versions (look for `-preview` in `expoVersion`)

```bash
npx expo install expo@next --fix  # install beta
```

## Step-by-Step Upgrade Process

1. Upgrade Expo and dependencies

```bash
npx expo install expo@latest
npx expo install --fix
```

2. Run diagnostics: `npx expo-doctor`

3. Clear caches and reinstall

```bash
npx expo export -p ios --clear
rm -rf node_modules .expo
watchman watch-del-all
```

## Breaking Changes Checklist

- Check for removed APIs in release notes
- Update import paths for moved modules
- Review native module changes requiring prebuild
- Test all camera, audio, and video features
- Verify navigation still works correctly

## Prebuild for Native Changes

If upgrading requires native changes:

```bash
npx expo prebuild --clean
```

Regenerates `ios` and `android`. Ensure project is not bare workflow before running.

## Clear Caches (Bare Workflow)

- iOS: `cd ios && pod install --repo-update`
- Xcode derived data: `npx expo run:ios --no-build-cache`
- Android: `cd android && ./gradlew clean`

## Housekeeping

- Review release notes at https://expo.dev/changelog
- SDK 54+: Ensure `react-native-worklets` is installed (required for react-native-reanimated)
- SDK 54+: Enable React Compiler via `"experiments": { "reactCompiler": true }` in app.json
- Delete `sdkVersion` from app.json (let Expo manage it)
- Remove implicit packages: `@babel/core`, `babel-preset-expo`, `expo-constants`
- Delete `babel.config.js` if it only contains `babel-preset-expo`
- Delete `metro.config.js` if it only has Expo defaults

## Deprecated Packages

| Old Package | Replacement |
|-------------|-------------|
| `expo-av` | `expo-audio` and `expo-video` |
| `expo-permissions` | Individual package permission APIs |
| `@expo/vector-icons` | `expo-symbols` (SF Symbols) |
| `AsyncStorage` | `expo-sqlite/localStorage/install` |
| `expo-app-loading` | `expo-splash-screen` |
| `expo-linear-gradient` | `experimental_backgroundImage` + CSS gradients in View |

When migrating deprecated packages, update all code usage before removing. For expo-av, consult references to convert Audio.Sound → useAudioPlayer, Audio.Recording → useAudioRecorder, Video → VideoView with useVideoPlayer.

## expo.install.exclude

Check package.json for excluded packages:

```json
{
  "expo": { "install": { "exclude": ["react-native-reanimated"] } }
}
```

Exclusions may be workarounds no longer needed after upgrading. Review each.

## Patches

Check `patches/` for outdated patches. Remove if no longer needed.

## Postcss

- SDK 53+: `autoprefixer` not needed. Remove from deps and postcss config plugins.
- Use `postcss.config.mjs` in SDK 53+.

## Metro

Remove redundant metro config:

- `resolver.unstable_enablePackageExports` — default in SDK 53+
- `experimentalImportSupport` — default in SDK 54+
- `EXPO_USE_FAST_RESOLVER=1` — removed in SDK 54+
- cjs/mjs extensions — default in SDK 50+
- Expo webpack deprecated — migrate to [Expo Router and Metro web](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## New Architecture

Enabled by default. `"newArchEnabled": true` in app.json no longer needed. Expo Go only supports New Architecture as of SDK 53+.
