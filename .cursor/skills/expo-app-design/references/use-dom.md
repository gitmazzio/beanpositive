# Expo DOM Components

Run web code in a webview on native; render as-is on web. Use for web-only libraries (recharts, syntax highlighters, etc.).

## When to Use

- Web-only libraries (charts, editors, highlighters)
- Migrating web code to native
- iframes, canvas, WebGL

## When NOT to Use

- Simple UI → use React Native
- Performance-critical → native components
- Layout routes → `_layout` cannot be DOM components

## Basic DOM Component

```tsx
// components/WebChart.tsx
"use dom";

export default function WebChart({ data, dom }: { data: number[]; dom: import("expo/dom").DOMProps }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Chart</h2>
      <ul>{data.map((v, i) => <li key={i}>{v}</li>)}</ul>
    </div>
  );
}
```

## Rules

1. `'use dom';` at top of file
2. Single default export per file
3. Serializable props only (strings, numbers, objects, arrays)
4. Include CSS in component file (isolated context)
5. Type `dom: import("expo/dom").DOMProps` in props

## dom Prop Options

```tsx
<WebChart dom={{ scrollEnabled: false }} />
<WebChart dom={{ contentInsetAdjustmentBehavior: "never" }} />
<WebChart dom={{ style: { width: 300, height: 400 } }} />
```

## Exposing Native to Webview

Pass async functions as props:

```tsx
// Native parent
<DOMComponent
  showAlert={async (msg) => Alert.alert("From Web", msg)}
  saveData={async (data) => { /* native storage */ return { success: true }; }}
/>
```

## Router Hooks in DOM

`useLocalSearchParams`, `usePathname`, etc. don't work in DOM. Pass from native parent:

```tsx
// app/[id].tsx
const { id } = useLocalSearchParams();
return <DOMComponent id={id} />;
```

## Using Web Libraries

```tsx
"use dom";

import { LineChart, Line, XAxis, YAxis } from "recharts";

export default function Chart({ data, dom }) {
  return (
    <LineChart width={400} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
```
