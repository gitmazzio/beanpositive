---
name: expo-app-design
description: Build robust, productivity apps with Expo. Domain-specific knowledge for mobile apps using Expo and React Native. Covers UI guidelines (Apple HIG), Expo Router navigation (stacks, tabs, modals, sheets), native controls, API routes with EAS Hosting, data fetching (React Query, loaders), Tailwind CSS v4 with NativeWind v5, and DOM components for web code. Use when building Expo apps, adding navigation, styling, animations, API routes, data fetching, or integrating web libraries.
---

# Expo App Design

Build robust, productivity apps with Expo. Follow Apple Human Interface Guidelines, use Expo Router for navigation, and leverage the right patterns for API routes, data fetching, and styling.

## References

| Area | Reference | When to consult |
|------|-----------|-----------------|
| UI & navigation | [references/building-native-ui.md](references/building-native-ui.md) | Components, styling, Stack/Tabs, Link, forms, animations |
| API routes | [references/api-routes.md](references/api-routes.md) | Server-side endpoints, EAS Hosting, secrets |
| Data fetching | [references/data-fetching.md](references/data-fetching.md) | fetch, React Query, loaders, offline, auth |
| Dev client | [references/dev-client.md](references/dev-client.md) | Custom builds, TestFlight |
| Tailwind | [references/tailwind-setup.md](references/tailwind-setup.md) | Tailwind v4, NativeWind v5 |
| DOM components | [references/use-dom.md](references/use-dom.md) | Web code in webview, recharts, syntax highlighters |

## Core Principles

### Try Expo Go First

**Always try Expo Go before creating custom builds.** Most apps work in Expo Go.

- Run `npx expo start` and scan with Expo Go
- Use `npx expo run:ios` or `eas build` only when required: local Expo modules, Apple targets (widgets, clips), third-party native modules not in Expo Go

### Library Preferences

- `expo-audio` and `expo-video`, not `expo-av`
- `expo-image` with `source="sf:name"` for SF Symbols
- `react-native-safe-area-context` for safe areas
- `process.env.EXPO_OS` not `Platform.OS`
- `React.use` not `React.useContext`
- `expo-glass-effect` for liquid glass
- Never use removed RN modules: Picker, WebView, SafeAreaView, AsyncStorage
- Never use legacy `expo-permissions`

### Code Style

- kebab-case for file names
- Path aliases in tsconfig, prefer aliases over relative imports
- Routes in `app/` only; do not co-locate components in app directory
- Ensure a route matches "/" (may be inside a group)

## Quick Decision Tree

```
Building Expo app?
├── UI / navigation / styling?     → references/building-native-ui.md
├── Server API with secrets?       → references/api-routes.md
├── Fetching data / caching?       → references/data-fetching.md
├── Custom native build?           → references/dev-client.md
├── Tailwind in RN?                → references/tailwind-setup.md
└── Web library (charts, etc.)?    → references/use-dom.md
```

## Key Patterns

### Navigation (Expo Router)

- Use `Link` from `expo-router` with `asChild` for custom components
- Define stacks in `_layout.tsx` with Stack from `expo-router/stack`
- Set titles via `Stack.Screen options={{ title: "..." }}`
- Use `presentation: "modal"` or `presentation: "formSheet"` for modals/sheets
- Add context menus with `Link.Trigger` and `Link.Menu`

### Styling

- Use CSS `boxShadow` style prop, not legacy shadow/elevation
- Prefer flex gap over margin/padding
- Use `contentInsetAdjustmentBehavior="automatic"` on ScrollView/FlatList
- Wrap root in ScrollView for responsiveness
- Use `useWindowDimensions` over `Dimensions.get()`
- Add `selectable` to Text with important data

### API Routes

- File suffix `+api.ts` in `app/api/`
- Export GET, POST, PUT, DELETE as named functions
- Use `process.env` for secrets (never in client)
- Deploy with `eas deploy` (Cloudflare Workers runtime)

### Data Fetching

- Prefer `fetch` over axios
- Use React Query for caching and mutations
- Store tokens in `expo-secure-store`
- Use `EXPO_PUBLIC_` prefix for client-side env vars only

## Additional Resources

For exhaustive patterns, examples, and edge cases, read the reference files linked above.
