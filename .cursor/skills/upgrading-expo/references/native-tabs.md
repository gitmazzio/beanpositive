# Native Tabs Migration (SDK 55)

In SDK 55, `Label`, `Icon`, `Badge`, and `VectorIcon` are accessed as static properties on `NativeTabs.Trigger` rather than separate imports.

## Import Changes

```tsx
// SDK 53/54
import {
  NativeTabs,
  Icon,
  Label,
  Badge,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

// SDK 55+
import { NativeTabs } from "expo-router/unstable-native-tabs";
```

## Component Changes

| SDK 53/54         | SDK 55+                    |
|-------------------|----------------------------|
| `<Label>`         | `<NativeTabs.Trigger.Label>` |
| `<Icon>`          | `<NativeTabs.Trigger.Icon>`  |
| `<Badge>`         | `<NativeTabs.Trigger.Badge>` |
| `<VectorIcon>`    | `<NativeTabs.Trigger.VectorIcon>` |

## Example

### Before (SDK 53/54)

```tsx
import { NativeTabs, Icon, Label, Badge } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
        <Label>Home</Label>
        <Icon sf="house.fill" />
        <Badge>3</Badge>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### After (SDK 55+)

```tsx
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Badge>3</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

## Migration Checklist

1. Remove `Icon`, `Label`, `Badge`, `VectorIcon` from imports
2. Keep only `NativeTabs` import
3. Replace `<Label>` with `<NativeTabs.Trigger.Label>`
4. Replace `<Icon>` with `<NativeTabs.Trigger.Icon>`
5. Replace `<Badge>` with `<NativeTabs.Trigger.Badge>`

Docs: https://docs.expo.dev/versions/v55.0.0/sdk/router-native-tabs/
