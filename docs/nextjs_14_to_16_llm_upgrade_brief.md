# Next.js 14 to 16 Upgrade Brief for an LLM Coding Agent

**Audience:** An LLM or coding agent that will upgrade a complex production Next.js app from Next.js 14 to Next.js 16.

**Goal:** Upgrade safely, preserve behavior, and avoid common build/runtime regressions. Treat this as an executable migration spec: first inventory the app, then run codemods, then perform targeted fixes, then validate behavior with focused tests.

**Current research date:** 2026-05-23. Primary sources are official Next.js upgrade docs and release notes. Check the official docs again before implementation because canary/stable guidance may evolve.

## 0. Non-negotiable migration principles

1. **Do not do a blind dependency bump.** Next.js 14 to 16 crosses both the Next.js 15 and Next.js 16 breaking-change sets.
2. **Work in small commits.** Suggested commits: environment/dependencies, codemods, async request APIs, caching behavior, bundler/Turbopack, routing/proxy, images, removals/config cleanup, test fixes.
3. **Prefer behavior-preserving fixes over opportunistic refactors.** Do not enable React Compiler, Cache Components, or new features unless the app already needs them or the upgrade requires it.
4. **Never assume caching behavior.** Explicitly classify every important data path as dynamic, cached, revalidated, or client-cached.
5. **Run build and tests repeatedly.** After each major category, run TypeScript, lint, unit tests, integration tests, and at least one production build.
6. **Record unresolved risks.** If a fix is uncertain, leave a comment or TODO in the migration notes, not in application code unless necessary.

## 1. Source-of-truth links for the coding agent

Use these official sources first:

- Next.js 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js 15 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-15
- Next.js 16 release blog: https://nextjs.org/blog/next-16
- Next.js codemods: https://nextjs.org/docs/app/guides/upgrading/codemods
- Next.js DevTools MCP docs: https://nextjs.org/docs/app/guides/ai-coding-agents

The v16 upgrade guide explicitly recommends `next-devtools-mcp@latest` for AI coding assistants and says the v16 codemod can migrate `next.config.js` Turbopack config, `next lint`, `middleware` to `proxy`, stabilized APIs, and `experimental_ppr` route segment config.

## 2. Phase 1 - Inventory before changing code

The agent must first inspect the repository and produce an inventory. Do not modify code during this phase.

### 2.1 Package and runtime inventory

Check:

- Package manager and lockfile: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, or `bun.lockb`.
- Current versions of `next`, `react`, `react-dom`, `eslint-config-next`, `typescript`, `@types/react`, `@types/react-dom`.
- Node version sources: `.nvmrc`, `.node-version`, `engines.node`, Dockerfiles, CI config, Vercel/project settings, deployment scripts.
- Monorepo constraints: root `package.json`, workspace package overrides/resolutions, shared TypeScript config, shared ESLint config.

Required target constraints for Next.js 16:

- Node.js >= 20.9.0.
- TypeScript >= 5.1.0.
- React/React DOM compatible with the Next.js 16 release being installed.
- Browser support baseline: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+.

### 2.2 Router architecture inventory

Determine whether the app uses:

- App Router (`app/`).
- Pages Router (`pages/`).
- Both routers.
- Route Handlers (`app/**/route.ts` or `.js`).
- API Routes (`pages/api/**`).
- Middleware (`middleware.ts`, `middleware.js`, or under `src/`).
- Parallel routes (`app/@slotName`).
- Intercepting routes (`(..)`, `(.)`, `(...)`).
- Dynamic segments (`[slug]`, `[...slug]`, `[[...slug]]`).
- Metadata routes: `sitemap`, `robots`, `opengraph-image`, `twitter-image`, `icon`, `apple-icon`, `manifest`.

Output a short table with file paths and features found.

### 2.3 High-risk search patterns

Run repository-wide searches for these patterns before codemods, then again after codemods:

```bash
rg "from ['\"]next/headers['\"]|cookies\(|headers\(|draftMode\(" .
rg "params\.|searchParams\.|\{ *params|\{ *searchParams" app pages src
rg "generateMetadata|generateViewport|generateImageMetadata|generateSitemaps|sitemap\(" app src
rg "runtime *= *['\"]experimental-edge['\"]" .
rg "fetch\(" app pages src
rg "revalidateTag|unstable_cacheLife|unstable_cacheTag|unstable_cache|unstable_noStore|updateTag|refresh\(" .
rg "middleware" .
rg "next/legacy/image|images:|domains:|minimumCacheTTL|imageSizes|qualities|dangerouslyAllowLocalIP|maximumRedirects|localPatterns|remotePatterns" .
rg "@next/font|next/font" .
rg "next lint|eslint:|serverRuntimeConfig|publicRuntimeConfig|getConfig\(|next/config|next/amp|useAmp|amp:" .
rg "experimental\.ppr|experimental_ppr|cacheComponents|dynamicIO|unstable_rootParams" .
rg "experimental\.turbopack|turbopack:|webpack\(" .
rg "~[^\n;]*\.s[ac]ss|@import ['\"]~" .
rg "geo\b|ip\b" middleware.* src/middleware.* app pages src
```

For each hit, classify it as: must-fix, review manually, safe, or unrelated false positive.

## 3. Phase 2 - Upgrade dependencies and run official codemods

### 3.1 Baseline branch and green tests

Before upgrading, ensure the current app has a known baseline:

```bash
node --version
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Adapt commands to the repo. If baseline is not green, document existing failures before migrating.

### 3.2 Run codemods

For a pnpm app, the official upgrade codemod is:

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

For npm/yarn/bun, use the package manager equivalent from the official docs.

Then install/align packages, for example:

```bash
pnpm add next@latest react@latest react-dom@latest eslint-config-next@latest
pnpm add -D typescript@latest @types/react@latest @types/react-dom@latest
```

The v16 codemod is documented as being able to update Turbopack configuration, migrate `next lint`, migrate deprecated `middleware` convention to `proxy`, remove `unstable_` prefixes from stabilized APIs, and remove `experimental_ppr` from pages/layouts. Do not assume it fixed all call sites. Manually verify.

## 4. Phase 3 - Required breaking changes from Next.js 15

These are changes introduced in the Next.js 15 line that still matter when coming from 14.

### 4.1 React 19 migration

Next.js 15 requires React 19 minimums. Audit:

- `react`, `react-dom`, `@types/react`, `@types/react-dom`.
- Third-party packages with React peer dependencies.
- Form hooks: `useFormState` is deprecated/replaced by `useActionState`.
- `useFormStatus` has additional keys in React 19.
- Hydration-sensitive code and custom Suspense boundaries.

Agent instruction:

- Do not replace all form logic blindly.
- Where `useFormState` appears, inspect usage and migrate to `useActionState` when straightforward.
- If third-party packages block React 19, propose package upgrades or pinning strategy; do not force incompatible peer deps without documenting the risk.

### 4.2 Async Request APIs: introduced in 15, synchronous compatibility removed in 16

This is likely the most important source-level migration.

Previously synchronous request-time APIs are now asynchronous:

- `cookies()`
- `headers()`
- `draftMode()`
- `params` in layout, page, route handlers, default routes, Open Graph image, Twitter image, icon, and apple icon files
- `searchParams` in pages

In Next.js 15 these had temporary synchronous compatibility. In Next.js 16 synchronous access is fully removed. Therefore, every temporary cast such as `UnsafeUnwrappedCookies`, `UnsafeUnwrappedHeaders`, or `UnsafeUnwrappedDraftMode` must be removed.

#### 4.2.1 Server component or server function fix pattern

Before:

```ts
import { cookies } from 'next/headers'

const cookieStore = cookies()
const token = cookieStore.get('token')
```

After:

```ts
import { cookies } from 'next/headers'

const cookieStore = await cookies()
const token = cookieStore.get('token')
```

If this appears at module top level, move it into an async function, Server Component, Route Handler, Server Action, or request-scoped helper.

#### 4.2.2 `headers()` pattern

Before:

```ts
const headersList = headers()
const userAgent = headersList.get('user-agent')
```

After:

```ts
const headersList = await headers()
const userAgent = headersList.get('user-agent')
```

#### 4.2.3 `draftMode()` pattern

Before:

```ts
const { isEnabled } = draftMode()
```

After:

```ts
const { isEnabled } = await draftMode()
```

#### 4.2.4 `params` and `searchParams` in async pages/layouts

Before:

```tsx
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export default async function Page({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = params
  const { query } = searchParams
}
```

After:

```tsx
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}
```

Alternatively, after running `next typegen`, use the global helpers:

```tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const searchParams = await props.searchParams
}
```

#### 4.2.5 Synchronous/client component pattern using React `use()`

Before:

```tsx
'use client'

export default function Page({ params, searchParams }) {
  const { slug } = params
  const { query } = searchParams
}
```

After:

```tsx
'use client'

import { use } from 'react'

export default function Page(props) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}
```

Prefer converting Server Components to async where possible. Use `use()` primarily for Client Components or intentionally synchronous components.

#### 4.2.6 Route Handler pattern

Before:

```ts
type Params = { slug: string }

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = segmentData.params
  const slug = params.slug
}
```

After:

```ts
type Params = Promise<{ slug: string }>

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params
  const slug = params.slug
}
```

#### 4.2.7 Metadata and generated image routes

Special v16 changes:

- In `opengraph-image`, `twitter-image`, `icon`, and `apple-icon`, the image-generating function now receives `params` and `id` as promises.
- `generateImageMetadata` continues to receive synchronous `params`.
- In sitemap generation, `id` is now a promise in the default sitemap function.

Open Graph example:

```ts
export async function generateImageMetadata({ params }) {
  const { slug } = params
  return [{ id: '1' }, { id: '2' }]
}

export default async function Image({ params, id }) {
  const { slug } = await params
  const imageId = await id
}
```

Sitemap example:

```ts
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }]
}

export default async function sitemap({ id }) {
  const resolvedId = await id
  const start = Number(resolvedId) * 50000
}
```

### 4.3 Runtime config value `experimental-edge` removed

Search for:

```ts
export const runtime = 'experimental-edge'
```

Replace with:

```ts
export const runtime = 'edge'
```

### 4.4 `fetch` is not cached by default

Next.js 15 changed `fetch` requests to be uncached by default.

Before, a fetch in a layout/page may have implicitly behaved as cached. Now:

```ts
const a = await fetch('https://example.com') // not cached by default
const b = await fetch('https://example.com', { cache: 'force-cache' }) // cached
```

Agent task:

1. Inventory every server-side `fetch()` in App Router files.
2. Classify each call:
   - Authenticated/user-specific: should usually remain uncached or use private/user-specific caching patterns.
   - Public CMS/static content: likely needs `cache: 'force-cache'` or tag/time revalidation.
   - Frequently changing public data: likely `next: { revalidate: N }` or explicit dynamic behavior.
   - Mutations/webhooks: no caching.
3. Add explicit cache options to important fetches instead of relying on defaults.
4. Verify pages whose performance depended on implicit caching.

### 4.5 `GET` Route Handlers are not cached by default

Next.js 15 changed `GET` Route Handlers so they are no longer cached by default.

If a route handler should be static/cached, add:

```ts
export const dynamic = 'force-static'

export async function GET() {}
```

Agent task:

- Audit `app/**/route.ts` GET handlers.
- Classify each handler as static, dynamic, auth-sensitive, webhook, or proxy.
- Add `dynamic = 'force-static'` only when the output is safe to cache.

### 4.6 Client Router cache behavior changed

When navigating between pages via `<Link>` or `useRouter`, page segments are no longer reused from the client cache by default, though browser back/forward and shared layouts are still reused. If the app relied on client-side reuse, consider `staleTimes`.

Agent task:

- Test navigation-heavy flows.
- Watch for extra network requests and UI state loss.
- Do not add `staleTimes` globally unless behavior/performance evidence warrants it.

### 4.7 Removed `@next/font`

Replace:

```ts
import { Inter } from '@next/font/google'
```

with:

```ts
import { Inter } from 'next/font/google'
```

### 4.8 Stabilized/renamed config options from v15

Audit and migrate:

```js
experimental: {
  bundlePagesExternals: true,
  serverComponentsExternalPackages: ['package-name'],
}
```

To:

```js
bundlePagesRouterDependencies: true,
serverExternalPackages: ['package-name'],
```

### 4.9 Speed Insights auto-instrumentation removed

If the app relies on Vercel Speed Insights auto instrumentation, follow Vercel’s explicit setup. Do not assume metrics still appear automatically.

### 4.10 `NextRequest` geolocation and IP properties removed

Search middleware/proxy/request code for `request.geo`, `request.ip`, destructured `geo`, or destructured `ip` from `NextRequest`.

If hosted on Vercel, use `geolocation()` and `ipAddress()` from `@vercel/functions`. Otherwise use the hosting provider’s equivalent headers or APIs.

## 5. Phase 4 - Required breaking changes from Next.js 16

### 5.1 Node/browser/TypeScript baselines

Next.js 16 requires:

- Node.js 20.9+.
- TypeScript 5.1+.
- Chrome/Edge/Firefox 111+ and Safari 16.4+ browser baseline.

Agent task:

- Update Dockerfiles and CI to Node 20.9+ or a newer active LTS.
- Update `.nvmrc`, `.node-version`, `engines.node`.
- Check deployment platform runtime.
- Ensure TypeScript version and shared configs are compatible.

### 5.2 Turbopack default for dev and build

Starting in Next.js 16, Turbopack is stable and used by default with `next dev` and `next build`.

Critical implications:

- Scripts like `next dev --turbopack` and `next build --turbopack` no longer need the flag.
- If `next.config` contains a custom `webpack` config, `next build` fails by default to prevent misconfiguration.
- Temporary opt-out is `next build --webpack` or `next dev --webpack`.
- Long-term target should be migrating Webpack-specific config to Turbopack-compatible config where possible.

Agent task:

1. Search for `webpack(`, `config.webpack`, custom loaders, aliases, fallbacks, SVGR setup, MDX setup, CSS/Sass loaders, transpilation plugins.
2. If custom Webpack config exists, decide whether to:
   - Temporarily keep Webpack for production build with `next build --webpack`.
   - Migrate config to top-level `turbopack` options.
   - Remove obsolete config.
3. Do not silently remove Webpack config unless build and runtime behavior are verified.

### 5.3 Turbopack config moved from experimental

Before:

```ts
const nextConfig = {
  experimental: {
    turbopack: {
      // options
    },
  },
}
```

After:

```ts
const nextConfig = {
  turbopack: {
    // options
  },
}
```

### 5.4 Webpack `resolve.fallback` equivalents

If client code imports modules that reference Node native modules such as `fs`, Turbopack may report errors like `Module not found: Can't resolve 'fs'`.

Preferred fix: refactor so client bundles never import server-only modules.

Fallback compatibility pattern:

```ts
const nextConfig = {
  turbopack: {
    resolveAlias: {
      fs: {
        browser: './empty.ts',
      },
    },
  },
}
```

Use this only when refactoring is not practical.

### 5.5 Sass tilde imports

Webpack allowed legacy tilde imports; Turbopack does not.

Before:

```scss
@import '~bootstrap/dist/css/bootstrap.min.css';
```

After:

```scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

Search for `@import "~` and `@import '~` in `.scss`/`.sass`/`.css` files.

### 5.6 Async Request APIs fully enforced

This overlaps with section 4.2 but is a v16 enforcement point. In v16, synchronous access is fully removed. Temporary unsafe casts from v15 migration are not acceptable final code.

### 5.7 React 19.2 and React Compiler support

Next.js 16 App Router uses React 19.2-era features. React Compiler support is stable but not enabled by default. Do not enable `reactCompiler: true` during this migration unless specifically requested; it can increase compile times and introduces a broader behavior/performance validation surface.

### 5.8 Caching APIs

Important v16 changes:

- `revalidateTag()` has a new signature supporting a cache-life profile as the second argument.
- `updateTag()` is a Server Actions-only API for read-your-writes behavior.
- `refresh()` can refresh the client router from inside a Server Action.
- `cacheLife` and `cacheTag` are stable; remove `unstable_` prefixes.

Preferred patterns:

```ts
import { revalidateTag } from 'next/cache'

revalidateTag(`article-${articleId}`, 'max')
```

Use `revalidateTag` when stale-while-revalidate is acceptable. Use `updateTag` inside Server Actions when a user just changed data and expects immediate fresh UI.

```ts
'use server'

import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile)
  updateTag(`user-${userId}`)
}
```

Agent task:

- Search all `revalidateTag(` calls.
- If call has only one argument, determine whether to add `'max'` or a custom profile.
- Do not replace all `revalidateTag` with `updateTag`; the semantics differ.
- Replace `unstable_cacheLife` and `unstable_cacheTag` imports with stable imports.

### 5.9 Cache Components and PPR

Next.js 16 removes experimental PPR flags and route-level `experimental_ppr`. PPR now goes through `cacheComponents: true`, and the v16 docs warn that PPR in v16 works differently from Next.js 15 canaries.

Agent task:

- Search for `experimental.ppr`, `experimental_ppr`, `dynamicIO`, `cacheComponents`, and Suspense-heavy PPR code.
- Remove obsolete `experimental_ppr` route segment config.
- Do not enable `cacheComponents` merely because the old PPR flag existed. If the app was actively using PPR, create a separate migration plan for Cache Components.

### 5.10 `middleware.ts` renamed/deprecated in favor of `proxy.ts`

In Next.js 16, `middleware` naming is deprecated in favor of `proxy`. Important caveat: `proxy` runs on the Node.js runtime and cannot be configured for Edge runtime. If the app requires Edge runtime behavior, keep `middleware` for now despite deprecation.

Standard migration:

```bash
mv middleware.ts proxy.ts
```

Before:

```ts
export function middleware(request: Request) {}
```

After:

```ts
export function proxy(request: Request) {}
```

Also rename config flags:

```ts
skipMiddlewareUrlNormalize -> skipProxyUrlNormalize
skipMiddlewareTrailingSlashRedirect -> skipProxyTrailingSlashRedirect
```

Agent task:

1. Inspect middleware for Edge-specific assumptions: low latency at edge, region behavior, Web Crypto, unsupported Node APIs, geolocation/IP access, auth vendor requirements.
2. If Edge is required, do not rename to `proxy` yet; document reason.
3. If Node runtime is acceptable, rename file and export function and update config flags.
4. Re-run auth/redirect/i18n tests.

### 5.11 `next/image` breaking/default changes

Audit all image behavior and `next.config` image config.

#### 5.11.1 Local images with query strings

Local image sources with query strings require `images.localPatterns.search`.

Example needing config:

```tsx
<Image src="/assets/photo?v=1" alt="Photo" width="100" height="100" />
```

Config:

```ts
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
}
```

#### 5.11.2 `minimumCacheTTL` default changed

`images.minimumCacheTTL` default changed from 60 seconds to 4 hours / 14400 seconds. If upstream images change frequently and lack cache-control headers, set a lower value explicitly.

```ts
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
  },
}
```

#### 5.11.3 `imageSizes` default changed

`16` was removed from the default `images.imageSizes`. If the app needs 16px generated variants, add it explicitly:

```ts
const nextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

#### 5.11.4 `qualities` default changed

`images.qualities` now defaults to `[75]`. A `quality` prop not included in the configured list is coerced to the closest configured value. If the app uses multiple quality levels, configure them:

```ts
const nextConfig = {
  images: {
    qualities: [50, 75, 100],
  },
}
```

#### 5.11.5 Local IP restriction

Local IP image optimization is blocked by default. Only for private networks, use:

```ts
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
  },
}
```

Do not enable this for public/untrusted deployments without security review.

#### 5.11.6 Maximum redirects

`images.maximumRedirects` default changed from unlimited to 3. If image sources redirect more than 3 times, fix the upstream URL or configure:

```ts
const nextConfig = {
  images: {
    maximumRedirects: 5,
  },
}
```

#### 5.11.7 Deprecations

Replace `next/legacy/image` with `next/image` and `images.domains` with `images.remotePatterns`.

### 5.12 Concurrent `dev` and `build` output

`next dev` now writes to `.next/dev`, separate from production build output. Tooling that reads `.next/trace-turbopack` or `.next` internals must be adjusted. Turbopack tracing for dev should target `.next/dev/trace-turbopack`.

### 5.13 Parallel routes require explicit `default.js`

All parallel route slots now require explicit `default.js` files. Builds fail without them.

For every `app/@slotName`, ensure there is a default file:

```tsx
export default function Default() {
  return null
}
```

or:

```tsx
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

Agent task:

- Enumerate all `app/**/@*` directories.
- For each slot without `default.tsx`/`default.js`, add the behavior-preserving default.
- Prefer `return null` when the previous missing-slot behavior was blank UI; prefer `notFound()` only when absence should be a 404.

### 5.14 ESLint changes and `next lint` removal

Next.js 16 removes `next lint`; `next build` no longer runs linting. The `eslint` option in `next.config` is also removed.

Before:

```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

After:

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

Also, `@next/eslint-plugin-next` now defaults to ESLint flat config format. If the repo uses `.eslintrc`, plan a flat-config migration or verify legacy config still works in the selected ESLint version.

### 5.15 Scroll behavior change

Next.js 16 no longer overrides global `scroll-behavior: smooth` during SPA route transitions by default. If the app relies on the old behavior, add:

```tsx
<html lang="en" data-scroll-behavior="smooth">
```

Agent task:

- Test route transitions in apps with global `html { scroll-behavior: smooth; }`.
- Add the attribute only if route scroll behavior regresses.

### 5.16 `next dev` config load change

During `next dev`, checking `process.argv.includes('dev')` inside `next.config` now returns false because config loading changed. `typegen` and `build` remain visible in `process.argv`.

Agent task:

- Search `process.argv` in `next.config.*` and config plugins.
- Replace dev detection with `process.env.NODE_ENV === 'development'` or use the Next config `phase`.

### 5.17 Build output metrics removed

Next.js 16 removes `size` and `First Load JS` metrics from `next build` output. CI scripts parsing these values must be updated. Use Lighthouse, Web Vitals, bundle analyzer, or deployment analytics for performance regression checks.

### 5.18 Modern Sass API

`sass-loader` is bumped to v16 with modern Sass syntax support. Test Sass compilation, especially custom Sass functions, `@import` deprecations, and package imports.

### 5.19 Removed features in v16

Remove or replace these:

- AMP support: `amp` config, `next/amp`, `useAmp`, `export const config = { amp: true }`.
- `next lint` command and `eslint` config option in `next.config`.
- Runtime configuration: `serverRuntimeConfig`, `publicRuntimeConfig`, and `getConfig()` from `next/config`.
- Some old dev indicator options, `experimental.dynamicIO`, and `unstable_rootParams` if present.

Runtime config replacement:

- Server-only values: read `process.env.SECRET` only in server code.
- Client-visible values: expose `NEXT_PUBLIC_*` variables.
- For runtime server env reads where build-time inlining would be wrong, review the official `connection()` guidance.

## 6. Suggested implementation workflow for the LLM agent

### Step A - Create migration notes

Create `NEXTJS_16_MIGRATION_NOTES.md` with:

- Current dependency versions.
- Runtime/CI/Docker constraints.
- Features found from inventory.
- Codemods run.
- Manual fixes made.
- Tests/build commands and results.
- Remaining risks.

### Step B - Environment and dependency commit

Modify only:

- `package.json`
- lockfile
- `.nvmrc` / `.node-version`
- Dockerfiles / CI runtime files
- TypeScript/react type packages

Run install and build. Commit.

### Step C - Codemod commit

Run official codemod. Review diff manually. Commit only codemod-generated and obviously equivalent changes.

### Step D - Async Request APIs commit

Fix `cookies`, `headers`, `draftMode`, `params`, `searchParams`, metadata image routes, and sitemap IDs. Remove unsafe temporary casts.

Validation:

```bash
pnpm typecheck
pnpm build
```

### Step E - Caching behavior commit

Audit `fetch`, `GET` route handlers, revalidation, and client navigation. Add explicit caching only where correct.

Validation:

- Run data-fetching unit/integration tests.
- Manually test pages with CMS/product/catalog/account data.
- Confirm authenticated data is never cached publicly.

### Step F - Turbopack/bundler commit

Attempt default `next build`. If custom Webpack config blocks build, either migrate to Turbopack config or temporarily use `--webpack` with a migration note.

Validation:

```bash
pnpm build
pnpm dev
```

Manually verify SVG imports, MDX, CSS Modules, Sass, transpiled packages, aliases, and any loader-dependent behavior.

### Step G - Routing/proxy commit

Handle `middleware` to `proxy` only if Node runtime is acceptable. Add parallel route defaults. Test redirects/auth/i18n.

### Step H - Images and removed APIs commit

Fix `next/image` config defaults/deprecations, remove `next/legacy/image`, remove `images.domains`, remove `@next/font`, remove AMP/runtime config/next lint.

### Step I - Final validation commit

Run full validation matrix and document results.

## 7. Validation matrix

Minimum commands:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

Recommended app-specific checks:

- Auth login/logout/session refresh.
- Middleware/proxy redirects and rewrites.
- Locale/i18n routing.
- Dynamic routes using `params` and `searchParams`.
- Server Actions and forms.
- Pages using cookies/headers/draft mode.
- CMS/product pages that rely on revalidation.
- Route Handlers and API routes.
- Open Graph image generation, icons, and metadata routes.
- Sitemap generation.
- Image-heavy pages, local images with query strings, remote images with redirects, quality-specific images.
- Parallel/intercepting route flows such as modals.
- Navigation and back/forward behavior.
- CI scripts parsing build output.
- Docker/deployment runtime.

Security checks:

- No user-specific data cached with public cache settings.
- No `dangerouslyAllowLocalIP` unless private network use is intended.
- No server secrets passed to Client Components.
- Runtime env values correctly separated between server-only and `NEXT_PUBLIC_*`.

## 8. Concrete review checklist

The migration is not complete until all checks are satisfied:

- [ ] Node runtime is >= 20.9 everywhere: local, CI, Docker, deployment.
- [ ] React/React DOM and TypeScript packages are upgraded and peer deps are resolved.
- [ ] Official codemod ran and diff was reviewed.
- [ ] No `UnsafeUnwrappedCookies`, `UnsafeUnwrappedHeaders`, or `UnsafeUnwrappedDraftMode` remains.
- [ ] No synchronous `cookies()`, `headers()`, or `draftMode()` access remains.
- [ ] All `params` and `searchParams` usages in App Router pages/layouts/routes are Promise-aware.
- [ ] Open Graph/Twitter/icon/apple-icon functions handle async `params` and `id` where required.
- [ ] Sitemap function handles async `id` where `generateSitemaps` is used.
- [ ] No `runtime = 'experimental-edge'` remains.
- [ ] Every important server `fetch()` has intentional cache behavior.
- [ ] Every `GET` Route Handler has intentional dynamic/static behavior.
- [ ] `revalidateTag` usage is reviewed and updated for v16 semantics.
- [ ] `unstable_cacheLife` and `unstable_cacheTag` imports are replaced where applicable.
- [ ] Custom Webpack config is either migrated or explicitly retained with `--webpack` and documented.
- [ ] `experimental.turbopack` is moved to top-level `turbopack` if used.
- [ ] Sass tilde imports are removed or aliased intentionally.
- [ ] `middleware` is renamed to `proxy` only if Node runtime is acceptable; Edge runtime cases are documented.
- [ ] Middleware/proxy config flags are renamed.
- [ ] Every parallel route slot has an explicit `default.js`/`default.tsx`.
- [ ] `next/image` local query-string config, TTL, sizes, qualities, local IP, redirects, legacy image, and domains/remotePatterns are reviewed.
- [ ] `next lint` is replaced with direct ESLint or Biome usage.
- [ ] `eslint` option is removed from `next.config`.
- [ ] Runtime config (`serverRuntimeConfig`, `publicRuntimeConfig`, `getConfig`) is removed.
- [ ] AMP APIs/config are removed or replaced.
- [ ] Build-output parsing scripts no longer depend on removed `size` or `First Load JS` metrics.
- [ ] Full test/build matrix is green.
- [ ] Migration notes document any intentional deviations.

## 9. Prompt to hand to a coding LLM

Use the following prompt as the task prompt for the coding agent:

```text
You are upgrading this repository from Next.js 14 to Next.js 16. Treat this as a safety-critical migration. Do not perform broad refactors. Work in small, reviewable changes. First inspect the repo and write NEXTJS_16_MIGRATION_NOTES.md with inventory findings. Then run the official Next.js codemod and manually complete the migration using the checklist below.

Primary goals:
1. Upgrade Next.js, React, React DOM, TypeScript/react types, eslint-config-next, Node runtime config, and lockfile.
2. Apply official codemods, then manually verify every change.
3. Fix all async Request API changes: cookies(), headers(), draftMode(), params, searchParams, generated image params/id, and sitemap id. Remove all UnsafeUnwrapped* temporary casts.
4. Audit caching: fetch() default uncached behavior, GET Route Handler default uncached behavior, client cache changes, revalidateTag/updateTag/cacheLife/cacheTag semantics. Add explicit cache behavior only where correct.
5. Handle Turbopack default: migrate config or temporarily use --webpack with a documented reason. Fix Sass tilde imports and Node-native module imports in client bundles.
6. Handle routing changes: middleware to proxy only if Node runtime is acceptable; otherwise keep middleware for Edge runtime and document. Add default.tsx/default.js for all parallel route slots.
7. Audit next/image changes: local image query strings, minimumCacheTTL, imageSizes, qualities, local IP restriction, maximumRedirects, next/legacy/image, images.domains -> remotePatterns.
8. Remove deprecated/removed APIs: next lint, next.config eslint option, runtime config/getConfig, AMP, @next/font, experimental-edge runtime, deprecated experimental config keys.
9. Run typecheck, lint, tests, production build, and app-specific smoke tests. Document results in NEXTJS_16_MIGRATION_NOTES.md.

Before editing, run repository searches for the high-risk patterns from this brief. After editing, run the same searches again and explain any remaining hits.

Do not enable React Compiler, Cache Components, or other new features unless required to preserve existing behavior or explicitly requested. Do not make user-specific data cacheable. Do not hide build failures by disabling TypeScript or ESLint checks unless explicitly approved and documented as a temporary workaround.
```

## 10. Source notes

The details in this brief are based primarily on:

- Next.js 16 upgrade guide, last updated 2026-03-31: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js 15 upgrade guide, last updated 2026-03-31: https://nextjs.org/docs/app/guides/upgrading/version-15
- Next.js 16 release blog: https://nextjs.org/blog/next-16

Key source claims reflected here:

- Next.js 16 requires Node.js 20.9+, TypeScript 5.1+, and modern browser baselines.
- Turbopack is default for `next dev` and `next build` in Next.js 16.
- Async Request APIs introduced in v15 lose synchronous compatibility in v16.
- `fetch` and `GET` Route Handlers became uncached by default in v15.
- `middleware` naming is deprecated in favor of `proxy`, but `proxy` uses Node.js runtime and does not support Edge runtime at the time of the cited v16 guide.
- Next.js 16 includes multiple `next/image` breaking/default changes.
- Next.js 16 removes AMP support, `next lint`, and runtime config.
