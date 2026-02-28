# Tailwind CSS v4 in Expo

Tailwind v4 with react-native-css and NativeWind v5 for universal styling.

## Install

```bash
npx expo install tailwindcss@^4 nativewind@5.0.0-preview.2 react-native-css@0.0.0-nightly.5ce6396 @tailwindcss/postcss tailwind-merge clsx
```

```json
// package.json
{ "resolutions": { "lightningcss": "1.30.1" } }
```

## Config

**metro.config.js:**
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

module.exports = withNativewind(getDefaultConfig(__dirname), {
  inlineVariables: false,
  globalClassNamePolyfill: false,
});
```

**postcss.config.mjs:**
```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

**src/global.css:**
```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
```

## No Babel Config

Remove NativeWind from babel.config.js. Tailwind v4 + NativeWind v5 use PostCSS/Metro only.

## Component Wrappers

react-native-css requires `useCssElement` wrappers for `className`:

```tsx
import { useCssElement } from "react-native-css";

export const View = (props) => useCssElement(RNView, props, { className: "style" });
export const Text = (props) => useCssElement(RNText, props, { className: "style" });
// etc. for ScrollView, Pressable, TextInput...
```

## Usage

```tsx
import { View, Text, ScrollView } from "@/tw";

<ScrollView className="flex-1 bg-white">
  <View className="p-4 gap-4">
    <Text className="text-xl font-bold">Hello</Text>
  </View>
</ScrollView>
```

## Custom Theme

```css
@layer theme {
  @theme {
    --font-rounded: "SF Pro Rounded", sans-serif;
  }
}
```
