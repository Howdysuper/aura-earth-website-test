# Security Audit Report — July 8, 2026

**Project**: Candle Home Decor Website (Aura & Earth)
**Framework**: Next.js 16 App Router + Firebase + Drizzle/PostgreSQL
**Files Reviewed**: All API routes, pages, components, config files, and dependencies
**Auditors**: 7 parallel Fable-model agents (828 tool calls, 513K tokens)

---

## Summary

| Severity | Count |
|----------|-------|
| **CRITICAL** | 6 |
| **HIGH** | 7 |
| **MEDIUM** | 5 |
| **LOW** | 4 |

**.gitignore Status**: Was missing — **CREATED** with comprehensive rules
**Git Status**: Not a git repository — run `git init` before any commits

---

## CRITICAL — Fix Immediately

### 1. Admin API Endpoint Has Zero Authentication
**File**: `src/app/api/admin/products/route.ts` (entire file)
**Category**: Broken Access Control
**Issue**: The PATCH endpoint that modifies product prices and stock has no authentication or authorization check. No call to `getCurrentUser()`, no admin role verification, nothing.
**Attack**: Anyone sends `PATCH /api/admin/products` with `{"id":"<product-id>","priceCents":1,"stock":99999}` — sets any product to $0.01 with unlimited stock. No login required.
**Impact**: Complete price manipulation, inventory destruction, fraudulent orders.
**Fix**:
```typescript
import { getCurrentUser } from "@/lib/auth";
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, error: "Not signed in." }, { status: 401 });
  if (!user.isAdmin) return Response.json({ ok: false, error: "Forbidden." }, { status: 403 });
  // ... rest of handler
}
```

---

### 2. Admin Dashboard Exposed Without Authentication
**File**: `src/app/admin/page.tsx` (line 23)
**Category**: Broken Access Control / Data Exposure
**Issue**: The `/admin` page is a Server Component that calls `getAdminData()` with zero auth checks. It renders: all product inventory with prices, 20 most recent customer orders (names, emails, addresses), all subscriber emails, and revenue statistics.
**Attack**: Anyone visits `https://site/admin` in their browser. Full dashboard loads. No login needed.
**Impact**: Complete exposure of all customer PII, business revenue data, and operational metrics. Violates GDPR/CCPA.
**Fix**: Add auth guard at the top of the component:
```typescript
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");
  // ... rest
}
```

---

### 3. Authentication Fallback Allows Complete Identity Forgery
**File**: `src/lib/auth.ts` (lines 35-42)
**Category**: Authentication Bypass
**Issue**: When Firebase Admin SDK is not configured, `getCurrentUser()` reads the `firebase-user` cookie as plain unsigned JSON — no cryptographic verification. The cookie is set by `setUserCookie()` which stores `JSON.stringify(user)` with no signature.
**Attack**: Attacker crafts a cookie `firebase-user` with `{"id":"<any-uid>","email":"admin@store.com","fullName":"Admin"}` and sends it with any request. Server trusts it as the authenticated user.
**Impact**: Complete authentication bypass. Any attacker impersonates any user.
**Fix**: When Admin SDK is not configured, refuse to serve authenticated routes. Or implement HMAC-signed cookies that the server can verify.

---

### 4. Session API Stores Unverified User Profiles
**File**: `src/app/api/auth/session/route.ts` (lines 5-24)
**Category**: Session Forgery
**Issue**: `POST /api/auth/session` accepts any `token` and/or `user` object from the request body and stores them in cookies via `setSessionCookie()` and `setUserCookie()` — never calls `verifyIdToken()`.
**Attack**: Attacker sends `POST /api/auth/session` with `{"user":{"id":"<admin-uid>","email":"admin@store.com","fullName":"Admin"}}`. Server stores it. Attacker is now "logged in" as admin.
**Impact**: Full account impersonation, including admin accounts. Can place orders, modify profiles, access all data.
**Fix**: Never accept raw user data from the client. Verify the Firebase token server-side before storing:
```typescript
const decoded = await getAdminAuth().verifyIdToken(body.token);
await setSessionCookie(body.token);
// Derive user from decoded token, not from client body
```

---

### 5. Signup API Trusts Client-Provided UID
**File**: `src/app/api/auth/signup/route.ts` (lines 6-25)
**Category**: Identity Spoofing / Account Takeover
**Issue**: The signup endpoint accepts a `uid` from the POST body and creates a Firestore profile with that ID. It never verifies the UID against Firebase Auth's `verifyIdToken`.
**Attack**: Attacker sends `POST /api/auth/signup` with `{"uid":"<admin-uid>","email":"attacker@evil.com","fullName":"Hacker"}` to create a profile under an existing user's Firebase UID.
**Impact**: Account takeover of any user including admins. Profile data corruption.
**Fix**: Never trust a client-provided UID. Derive it from the verified Firebase ID token:
```typescript
const decoded = await getAdminAuth().verifyIdToken(token);
const user = await signup({ uid: decoded.uid, email: decoded.email!, fullName });
```

---

### 6. Orders Recorded as "Paid" Without Payment Processing
**File**: `src/app/api/checkout/route.ts` (line 123); `src/lib/firestore.ts` (line 359)
**Category**: Missing Payment Verification
**Issue**: The checkout flow creates an order with `status: "paid"` immediately. There is no payment provider integration (no Stripe, PayPal, Square). The checkout page says "Demo mode — no card is charged." Stock is decremented but no money changes hands.
**Attack**: Attacker places unlimited orders at any price. All are recorded as "paid," inventory is decremented, no payment is collected.
**Impact**: Total inventory loss without revenue. In production, this means giving away all products for free.
**Fix**: Integrate a real payment provider (e.g., Stripe). Initialize orders as `"pending"` and only change to `"paid"` after receiving a verified webhook with signature validation.

---

## HIGH — Fix Soon

### 7. No Admin Role System Exists
**File**: `src/lib/firestore.ts` (User type, line 59-64); `src/app/admin/page.tsx`
**Category**: Missing Authorization
**Issue**: The `User` type has only `id`, `email`, `fullName`, and `createdAt` — no `role` or `isAdmin` field. There is no mechanism to distinguish admin users from regular users.
**Attack**: Even if auth checks are added, there is no admin role to check against.
**Impact**: Cannot implement admin-only access controls.
**Fix**: Add a `role` field to the User type and Firestore schema. Use Firebase custom claims for the admin check.

---

### 8. Database Password Uses Default Value
**File**: `drizzle.config.json` (line 5)
**Category**: Weak Credentials
**Issue**: The database password is literally `postgres` — the default PostgreSQL superuser password.
**Attack**: Attacker scans for exposed PostgreSQL port 5432, tries `postgres:postgres`, gains immediate superuser access.
**Impact**: Complete database takeover.
**Fix**: Use a strong, randomly generated password. Store it in `DATABASE_URL` env var, not in the config file.

---

### 9. Hardcoded Database Credentials in Config
**File**: `drizzle.config.json` (line 5)
**Category**: Hardcoded Secret
**Issue**: PostgreSQL connection string `postgresql://postgres:postgres@127.0.0.1:5432/app_db` is hardcoded in plaintext. Not in `.gitignore`. If pushed to a repo, credentials are exposed.
**Attack**: Anyone with repo access gets database credentials.
**Fix**: Use environment variable:
```ts
import "dotenv/config";
url: process.env.DATABASE_URL!
```

---

### 10. Health Check Endpoint Exposes Internal Status
**File**: `src/app/api/health/route.ts` (lines 1-12)
**Category**: Information Disclosure
**Issue**: `/api/health` is publicly accessible and reveals whether the Firestore Admin SDK is configured and whether the service account is loaded.
**Attack**: Attacker uses it for reconnaissance before targeting the backend.
**Impact**: Aids targeted attacks. Low direct impact but lowers exploitation barrier.
**Fix**: Remove the endpoint, restrict to internal networks, or require an API key.

---

### 11. No Middleware for CSRF Protection or Rate Limiting
**File**: No `middleware.ts` exists in the project
**Category**: Missing Security Controls
**Issue**: No global request interception. POST endpoints have no CSRF validation, no rate limiting, no origin checking.
**Attack**: Attacker creates a malicious webpage that auto-submits forms to `/api/checkout`, `/api/subscribe`, `/api/contact`. Browser sends cookies automatically.
**Impact**: Mass spam, order flooding, contact form abuse, potential financial loss.
**Fix**: Create `src/middleware.ts` with CSRF validation, rate limiting, and origin checking.

---

### 12. No Rate Limiting on Any Endpoint
**File**: All API routes under `src/app/api/`
**Category**: Missing Abuse Prevention
**Issue**: No rate limiting on login, signup, checkout, contact, or subscribe endpoints.
**Attack**: Attacker brute-forces login, floods checkout with orders, spams contact form, or creates unlimited subscriber entries.
**Impact**: Account lockouts, resource exhaustion, spam, potential financial loss.
**Fix**: Implement rate limiting in middleware or at the route level (e.g., using `next-rate-limit` or Upstash Redis).

---

### 13. No Server-Side Validation on Checkout Input
**File**: `src/app/api/checkout/route.ts`
**Category**: Missing Input Validation
**Issue**: The checkout endpoint does not validate quantities (can be negative, zero, or absurdly large), prices (can be manipulated), or addresses (can be empty or contain injection payloads).
**Attack**: Attacker sends negative quantities to get "refunds," or sets `priceCents: 0` to get items free.
**Impact**: Financial loss, inventory corruption, data integrity issues.
**Fix**: Validate all input with Zod or manual checks. Validate quantities are positive integers, prices match the database, and addresses are well-formed.

---

## MEDIUM — Plan to Fix

### 14. No Content Security Policy (CSP) Headers
**File**: `next.config.ts`; `firebase.json`
**Category**: Missing Security Headers
**Issue**: No CSP headers configured in Next.js or Firebase Hosting. No `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` headers.
**Attack**: XSS attacks execute unimpeded. Clickjacking possible.
**Fix**: Add security headers in `next.config.ts`:
```ts
headers: async () => [{ source: '/(.*)', headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" },
]}]
```

---

### 15. No Subresource Integrity (SRI) on External Resources
**File**: Various `.tsx` files loading external scripts/stylesheets
**Category**: Supply Chain Risk
**Issue**: External CDN resources loaded without `integrity` and `crossorigin` attributes.
**Attack**: Compromised CDN serves malicious code.
**Fix**: Add `integrity` and `crossorigin` attributes to all external `<script>` and `<link>` tags.

---

### 16. No Cookie Security Attributes Verified
**File**: `src/app/api/auth/session/route.ts`; `src/lib/auth.ts`
**Category**: Cookie Security
**Issue**: Session cookies may not have `Secure`, `SameSite`, or `HttpOnly` flags properly configured in all environments.
**Attack**: Session hijacking via network interception or CSRF.
**Fix**: Ensure all auth cookies use `httpOnly: true`, `secure: true`, `sameSite: 'strict'` or `'lax'`.

---

### 17. PostCSS Has Known XSS Vulnerability
**File**: `node_modules/postcss` (versions < 8.5.10)
**Category**: Vulnerable Dependency
**Issue**: PostCSS has a reflected XSS vulnerability (GHSA-qx2v-qp2m-jg93, CVSS 6.1). Project uses postcss 8.5.8.
**Attack**: Crafted CSS input can inject scripts.
**Fix**: Run `npm audit fix` or update PostCSS to >= 8.5.10.

---

### 18. No Error Boundaries or Sanitized Error Responses
**File**: All API routes under `src/app/api/`
**Category**: Information Disclosure
**Issue**: API error responses may leak stack traces, database error messages, or internal file paths to clients.
**Attack**: Attacker triggers errors to learn about backend architecture.
**Impact**: Aids further exploitation.
**Fix**: Wrap all route handlers in try/catch and return generic error messages. Never expose `error.message` or `error.stack` to the client.

---

## LOW — Consider Fixing

### 19. No Audit Logging of Security Events
**File**: All API routes
**Category**: Missing Monitoring
**Issue**: No logging of failed logins, admin actions, payment attempts, or unauthorized access attempts.
**Attack**: Attacks go undetected.
**Fix**: Add structured logging for security-relevant events (failed auth, admin actions, order creation).

---

### 20. External Image Domains Not Restricted
**File**: `next.config.ts`
**Category**: Open Redirect / SSRF Risk
**Issue**: `images.remotePatterns` may not be configured, allowing Next.js Image component to fetch from any domain.
**Attack**: Attacker uses the app as an open proxy or for SSRF.
**Fix**: Configure `images.remotePatterns` to only allow your known image domains.

---

### 21. No `.env.local` in Git History Check
**File**: `.env.local`
**Category**: Secret Hygiene
**Issue**: `.env.local` contains Firebase API keys. Even though `.gitignore` now excludes it, it may have been committed previously (project is not a git repo so this is moot, but worth noting for when git is initialized).
**Attack**: If `.env.local` was ever committed, secrets remain in git history.
**Fix**: When initializing git, verify `.env.local` is excluded. If previously tracked, use `git filter-branch` or BFG Repo Cleaner.

---

### 22. Console.log May Leak Sensitive Data
**File**: Various files in `src/`
**Category**: Information Disclosure
**Issue**: `console.log()` statements in source code may dump sensitive data (user objects, tokens, request bodies) to server logs.
**Attack**: Attacker with log access gets sensitive data.
**Fix**: Remove or gate `console.log` statements behind a debug flag. Never log tokens, passwords, or full request bodies.

---

### 23. No X-Powered-By Header Removal
**File**: `next.config.ts`
**Category**: Information Disclosure
**Issue**: Next.js default `X-Powered-By: Next.js` header may be present, revealing the technology stack.
**Fix**: Add `poweredBy: false` to `next.config.ts`.

---

## Remediation Priority

### Fix Immediately (Critical — 6 findings)
1. **Admin API has no auth** — Add `getCurrentUser()` + admin check to `src/app/api/admin/products/route.ts`
2. **Admin page has no auth** — Add auth guard to `src/app/admin/page.tsx`
3. **Fallback auth allows identity forgery** — Remove unsigned cookie fallback or require Admin SDK
4. **Session API stores unverified profiles** — Verify Firebase token server-side before setting cookies
5. **Signup API trusts client UID** — Derive UID from verified token, not client body
6. **No payment processing** — Integrate Stripe or similar; orders should be "pending" until payment confirmed

### Fix Soon (High — 7 findings)
7. Add admin role system to User type
8. Change database password from default
9. Move DB credentials to environment variables
10. Restrict or remove health check endpoint
11. Create `src/middleware.ts` with CSRF protection
12. Add rate limiting to all API endpoints
13. Add input validation to checkout flow

### Plan to Fix (Medium — 5 findings)
14. Add CSP and security headers
15. Add SRI to external resources
16. Verify cookie security attributes
17. Update PostCSS to fix XSS vulnerability
18. Sanitize all error responses

### Consider Fixing (Low — 5 findings)
19. Add security event logging
20. Restrict external image domains
21. Verify .env.local was never in git history
22. Remove sensitive console.log statements
23. Remove X-Powered-By header

---

*Report generated by Ultimate Security Audit Workflow — 7 parallel Fable-model agents, 828 tool calls, 513K tokens*
