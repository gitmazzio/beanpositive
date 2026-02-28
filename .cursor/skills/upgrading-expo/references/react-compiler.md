# React Compiler

React Compiler is stable in Expo SDK 54+. It automatically memoizes components and hooks, eliminating manual `useMemo`, `useCallback`, and `React.memo`.

## Enabling

Add to `app.json`:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

## What It Does

- Automatically memoizes components and values
- Eliminates unnecessary re-renders
- Removes need for manual `useMemo` and `useCallback`
- Works with existing code without modifications

## Cleanup After Enabling

```tsx
// Before (manual memoization)
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a), [a]);
const MemoizedComponent = React.memo(MyComponent);

// After (React Compiler handles it)
const value = computeExpensive(a, b);
const callback = () => doSomething(a);
// Just use MyComponent directly
```

## Requirements

- Expo SDK 54+
- New Architecture enabled (default)

## Troubleshooting

1. Ensure New Architecture is enabled
2. Clear Metro cache: `npx expo start --clear`
3. Check for incompatible patterns (rare)
