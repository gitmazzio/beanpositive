# Building Native UI with Expo

UI guidelines following Apple HIG. Navigation, styling, components, animations.

## Route Structure

Routes in `app/` directory. Never co-locate components in app directory.

```
app/
  _layout.tsx — <NativeTabs /> or Stack
  (index,search)/
    _layout.tsx — <Stack />
    index.tsx
    search.tsx
```

## Link and Navigation

```tsx
import { Link } from 'expo-router';

<Link href="/path" />
<Link href="/path" asChild>
  <Pressable>...</Pressable>
</Link>

// Context menu
<Link href="/settings" asChild>
  <Link.Trigger>
    <Pressable><Card /></Pressable>
  </Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={handleShare} />
    <Link.MenuAction title="Delete" icon="trash" destructive onPress={handleDelete} />
  </Link.Menu>
</Link>

// Preview
<Link href="/settings">
  <Link.Trigger><Pressable><Card /></Pressable></Link.Trigger>
  <Link.Preview />
</Link>
```

## Stack

```tsx
import { Stack } from 'expo-router/stack';

<Stack.Screen options={{ title: "Home" }} />
<Stack.Screen name="modal" options={{ presentation: "modal" }} />
<Stack.Screen
  name="sheet"
  options={{
    presentation: "formSheet",
    sheetGrabberVisible: true,
    sheetAllowedDetents: [0.5, 1.0],
    contentStyle: { backgroundColor: "transparent" },
  }}
/>
```

## NativeTabs (SDK 55+)

```tsx
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

<NativeTabs>
  <NativeTabs.Trigger name="(index)">
    <Icon sf="list.dash" />
    <Label>Items</Label>
  </NativeTabs.Trigger>
  <NativeTabs.Trigger name="(search)" role="search" />
</NativeTabs>
```

## Styling Rules

- Use `boxShadow` style prop, not shadow/elevation
- Prefer flex gap over margin/padding
- `{ borderCurve: 'continuous' }` for rounded corners
- `contentInsetAdjustmentBehavior="automatic"` on ScrollView/FlatList
- First child of route in Stack: ScrollView with contentInsetAdjustmentBehavior
- Add `selectable` to Text with important data
- Use `headerSearchBarOptions` for search in headers

## Shared Group Layout

```tsx
// app/(index,search)/_layout.tsx
const screen = segment.match(/\((.*)\)/)?.[1]!;
return (
  <Stack screenOptions={{
    headerTransparent: true,
    headerLargeTitle: true,
    headerTitleStyle: { color: PlatformColor("label") },
  }}>
    <Stack.Screen name={screen} options={{ title: titles[screen] }} />
    <Stack.Screen name="i/[id]" options={{ headerLargeTitle: false }} />
  </Stack>
);
```
