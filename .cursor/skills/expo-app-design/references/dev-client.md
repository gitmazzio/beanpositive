# Expo Dev Client

Development builds and TestFlight distribution. Only needed when Expo Go doesn't support your native requirements.

## When Dev Client Is Needed

- Local Expo modules (custom native code)
- Apple targets (widgets, app clips, extensions)
- Third-party native modules not in Expo Go

**Try Expo Go first** with `npx expo start`.

## eas.json

```json
{
  "build": {
    "development": {
      "autoIncrement": true,
      "developmentClient": true
    }
  }
}
```

## Build for TestFlight

```bash
eas build -p ios --profile development --submit
```

## Build Locally

```bash
eas build -p ios --profile development --local
eas build -p android --profile development --local
```

## Using the Dev Client

```bash
npx expo start --dev-client
```

Scan QR or enter Metro URL in the dev client.

## Troubleshooting

```bash
eas credentials                    # Signing issues
eas build -p ios --profile development --clear-cache
eas build:list
```
