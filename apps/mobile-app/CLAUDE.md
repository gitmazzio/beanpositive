# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Bean Positive** mobile app - an Expo (React Native) application built with Expo Router, Supabase authentication, and OneSignal push notifications. The app is part of a Turborepo monorepo containing a web app and shared packages.

## Common Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run web version
npm run web

# Run tests with Jest
npm test

# Generate native iOS/Android projects (required before running on device)
npm run prebuild

# Build iOS for production with EAS
npm run build:ios
```

## Architecture

### Routing (Expo Router)
- File-based routing in `app/` directory
- Route groups: `(authenticated)` and `(not_authenticated)` determine auth state
- Protected routes use `<Stack.Protected guard={condition} />` for route guarding

### Authentication Flow
- **AuthProvider** (`providers/AuthProvider.tsx`): Central authentication context
  - Handles Supabase email/password, Google OAuth, and Apple Sign-In
  - Token refresh mechanism with configurable threshold (5 min before expiry)
  - OneSignal integration for push notifications on login/logout
- **Protected Routes**: Automatically redirect based on auth state

### State Management
- **React Query** (`@tanstack/react-query`): Server state and API calls
- **React Context**: Auth state (AuthProvider), pocket data (PocketContext), pending deep links
- **AsyncStorage**: Local persistence for onboarding state and preferences

### Key Integrations
- **Supabase**: Auth and database (see `services/supabase.ts`)
- **OneSignal**: Push notifications (`services/onesignal.ts`)
- **Sentry**: Error tracking (enabled in production only)
- **Firebase**: Configured but not actively used in current implementation

### Component Structure
- `components/commons/`: Reusable UI components (Button, Calendar, etc.)
- `components/authenticated/`: Feature-specific components (profile sections)
- `components/pocket/`: Pocket/bean tracking visualization components
- `components/svg/`: Custom SVG icons and graphics

### Custom Hooks
- `useAuth()`: Access authentication state and methods
- `useNotifications()`: Push notification handling
- `useLocation()`: Location services
- `usePocketContext()`: Bean/pocket data access
- `useNotificationPermissionFlow()`: Permission request flow

## Deep Linking

The app supports deep links via `constants/deepLinks.ts`. Deep links are handled through:
- `RootDeepLinkHandler`: Processes incoming deep links
- `PendingDeepLinkContext`: Stores deep links that arrive before auth completes

## Important Configuration Files

- `app.json`: Expo configuration (scheme: `beanpositive`, bundleId: `com.beanpositive.app`)
- `package.json`: Dependencies and scripts
- `services/GoogleService-Info.plist`: iOS Google services config
- `services/google-services.json`: Android Google services config

## Native Modules

The app uses native modules requiring build configuration:
- Apple Sign-In (expo-apple-authentication)
- Google OAuth (expo-auth-session)
- OneSignal (react-native-onesignal)
- Location (expo-location)
- Notifications (expo-notifications)

Run `npm run prebuild` after adding new native dependencies.
