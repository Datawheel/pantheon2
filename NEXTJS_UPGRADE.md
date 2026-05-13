# Next.js 16 Upgrade Analysis

**Analysis Date:** February 2026
**Current Version:** Next.js 14.2.20
**Target Version:** Next.js 16.1.6 (LTS)

---

## Current State

- **Next.js**: 14.2.20
- **React**: 18.2.0
- **Architecture**: App Router (modern)

## Good News

- No legacy patterns (`getServerSideProps`, `getStaticProps`, `getInitialProps`)
- No `next/router` usage (using `next/navigation`)
- No `next/head` usage (using Metadata API)
- API routes use modern Route Handlers

---

## Required Changes for Upgrade

### 1. Async Params (BREAKING - ~12 files)

Next.js 15+ changed `params` and `searchParams` to be Promises. All page components need updating:

**Before:**
```javascript
export default async function Page({params: {id}}) {
  // use id directly
}
```

**After:**
```javascript
export default async function Page({params}) {
  const {id} = await params;
  // use id
}
```

**Files affected:**
- `app/[locale]/profile/country/[id]/page.jsx`
- `app/[locale]/profile/place/[id]/page.jsx`
- `app/[locale]/profile/person/[id]/page.jsx`
- `app/[locale]/profile/occupation/[id]/page.jsx`
- `app/[locale]/profile/era/[id]/page.jsx`
- `app/[locale]/profile/deaths/[id]/page.jsx`
- `app/[locale]/profile/born-on-this-day/[date]/page.jsx`
- `app/[locale]/profile/occupation/[id]/country/[countryId]/page.jsx`
- `app/[locale]/profile/deaths/[id]/country/[countryId]/page.jsx`
- `app/[locale]/profile/deaths/[id]/occupation/[occupationId]/page.jsx`
- `app/[locale]/game/yearbook/[year]/page.jsx`
- `app/[locale]/profile/born-on-this-day/page.jsx`

**Note:** `generateMetadata` functions also need the same treatment for their `params` argument.

### 2. React 19 Upgrade (MAJOR)

Next.js 16 requires React 19. Update in `package.json`:

```json
"react": "^19",
"react-dom": "^19"
```

### 3. Package Updates (Direct Next.js related)

```json
"@next/third-parties": "^16.1.6",
"eslint-config-next": "^16.1.6",
"next": "^16.1.6"
```

### 4. Packages to Check for React 19 Compatibility

| Package | Current | Risk | Notes |
|---------|---------|------|-------|
| `@blueprintjs/core` | 5.16.1 | Medium | Check React 19 support |
| `@blueprintjs/select` | 5.3.6 | Medium | Check React 19 support |
| `@tippyjs/react` | 4.2.6 | Medium | May need update |
| `react-redux` | 9.1.0 | Low | Usually quick to support |
| `react-table` | 7.8.0 | High | Old version, consider TanStack Table |
| `react-google-recaptcha-v3` | 1.10.1 | Medium | Check compatibility |
| `react-copy-to-clipboard` | 5.1.0 | Low | Simple package |
| `next-international` | 1.3.1 | Medium | Check Next.js 16 support |
| `nextjs-toploader` | 1.6.12 | Medium | Check compatibility |

### 5. next.config.js Updates

The config may need adjustments for Next.js 16:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack config may change
};

export default nextConfig; // ESM syntax preferred in Next.js 16
```

---

## Recommended Upgrade Path

### Option A: Incremental Upgrade (Safer)

Upgrade through major versions:

1. **14 → 15** first (handles async params breaking change)
2. **15 → 16** after stabilization

### Option B: Direct Upgrade (Faster, Riskier)

Jump directly to 16.1.6 with all changes at once.

---

## Effort Estimate

| Task | Files | Complexity |
|------|-------|------------|
| Async params migration | ~12 pages + generateMetadata functions | Medium |
| React 19 upgrade | package.json | Low |
| Package compatibility fixes | Unknown | Medium-High |
| Testing | All pages | High |

**Total estimated effort**: 2-4 days for a careful migration with testing.

---

## Resources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [React 19 Migration Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
