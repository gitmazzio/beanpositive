# Expo API Routes

Server-side API routes with EAS Hosting (Cloudflare Workers).

## When to Use

- Server-side secrets (API keys, DB credentials)
- Third-party API proxies (hide keys)
- Webhook endpoints
- Rate limiting
- Heavy computation

## When NOT to Use

- Public data → direct fetch
- Real-time → WebSockets/Supabase
- Simple CRUD → Firebase/Supabase/Convex
- File uploads → presigned URLs
- Auth only → Clerk/Auth0/Firebase Auth

## File Structure

```
app/api/
  hello+api.ts       → GET /api/hello
  users+api.ts       → /api/users
  users/[id]+api.ts  → /api/users/:id
```

## Basic Route

```ts
// app/api/hello+api.ts
export function GET(request: Request) {
  return Response.json({ message: "Hello from Expo!" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ created: body }, { status: 201 });
}
```

## Dynamic Routes

```ts
// app/api/users/[id]+api.ts
export function GET(request: Request, { id }: { id: string }) {
  return Response.json({ userId: id });
}
```

## Request Handling

```ts
// Query params
const url = new URL(request.url);
const page = url.searchParams.get("page") ?? "1";

// Headers
const auth = request.headers.get("Authorization");

// JSON body
const { email, password } = await request.json();
```

## Environment Variables

Use `process.env` for secrets. Never expose in client.

- Local: `.env` (never commit)
- EAS: `eas env:create` or Expo dashboard

## CORS (for web clients)

```ts
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}
```

## EAS Hosting Limitations

- No Node.js fs or native modules
- Use Web Crypto, not Node crypto
- Cloud DBs: Cloudflare D1, Turso, PlanetScale, Supabase, Neon
- 30s execution timeout

## Deploy

```bash
eas deploy
```

## Rules

- NEVER expose API keys in client code
- ALWAYS validate/sanitize input
- Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
