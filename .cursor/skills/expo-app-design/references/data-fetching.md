# Native Data Fetching

Network requests, React Query, caching, offline support, Expo Router loaders.

## Preferences

- Prefer `fetch` over axios
- Use React Query for caching and complex state
- Store tokens in `expo-secure-store`, not AsyncStorage

## Basic Fetch

```tsx
const response = await fetch(url);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return response.json();
```

## React Query Setup

```tsx
// app/_layout.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2 },
  },
});

<QueryClientProvider client={queryClient}>
  <Stack />
</QueryClientProvider>
```

## Queries and Mutations

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});

const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
});
```

## Auth Fetch Wrapper

```tsx
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};
```

## Environment Variables

- Client URLs: `EXPO_PUBLIC_` prefix in .env
- Server secrets: non-prefixed (API routes only)
- Restart dev server after .env changes

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

## Offline (NetInfo + React Query)

```tsx
import { onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected ?? true);
  });
});
```

## Request Cancellation

```tsx
const controller = new AbortController();
fetch(url, { signal: controller.signal });
return () => controller.abort();
```

## Common Mistakes

- Wrong: `fetch(url).then(r => r.json())` (no error handling)
- Right: Check `response.ok` before parsing
- Wrong: AsyncStorage for tokens
- Right: SecureStore for sensitive data
