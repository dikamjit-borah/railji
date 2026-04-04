# TODO List

---

## Future Plan: Shareable Public Exam Preview Page

### Overview
Keep the current exam flow (`/exam/[examId]`) completely untouched. Add a separate public-facing page that shows exam metadata (instructions, stats) without requiring login and without fetching any questions or answers data.

### How it should work
- The **current** `/exam/[examId]` route stays as-is — full exam flow, login required.
- A **new public preview page** is added (e.g. `/exam/[examId]/info` or the same `/exam/[examId]` route opened to unauthenticated users via middleware relaxation).
- The preview page fetches **only** exam metadata: name, duration, total questions, passing %, negative marking, instructions. No questions, no answers.
- The **Start Exam button is replaced with a locked button** (lock icon) for unauthenticated users. Clicking it redirects to `/auth/signin?redirect=/exam/[examId]`.
- After successful login, the auth callback reads the `redirect` param and sends users directly back to the exam preview page.

### Implementation Steps
1. **Extract `ExamInfoPanel` server component** — pull the stats cards (questions/duration/passing %/negative marking) and instructions list out of `ExamInstructions.tsx` into a shared server component. Both pages use it.
2. **Create public SSR preview page** — new route with `fetch` for exam metadata only, rendered server-side. Add proper `<meta og:title>` and `<meta og:description>` tags for social sharing / SEO. Use `revalidate` for caching.
3. **Lock button component** — if `session === null`, render a locked Start button that redirects to `/auth/signin?redirect=/exam/${examId}`. If authenticated, render the current mode selector + Start button.
4. **Auth callback redirect handling** — ensure `/auth/callback` reads the `redirect` query param and uses `router.push(redirect)` instead of always going to `/`.
5. **Middleware update** — allow the preview route to be accessed without a session (currently middleware may block unauthenticated access to `/exam/*`).
6. **Attempt history** — shown only when user is authenticated (conditional server fetch or client-side hydration island).

### Key Constraints
- No changes to `ExamPageClient.tsx` or the live exam flow.
- Post-login redirect **must** work correctly — users who click the lock and log in must land back on the exam preview page, not home.
- The public page must not expose any question content or answers.

### Reference
- Industry precedent: Testbook, BYJU'S, Unacademy all use this pattern.
- Discussed on: 2026-03-07

---

- [ ] My stats page to aligned with current pramod user and update the overall design and info 
- [ ] Logo and home navbar(height)
- [ ] Department showcase icons align it with department list icons page
- [ ] Home exam cards icons change to appropriate departments currently all are same
- [ ] Update the footer with appropriate data and links
- [ ] Department list page overall design with animation
- [ ] On clicking on a department from the department list there is hold delay instead if need show the loading . Same when starting exam from papers selection page.
- [ ] Loading screen from department list to papers list is not good.
- [ ] Percentage logic to link and work from backend to frontend properly.
- [ ] A delay going from exam review to start even if the data is already preloaded.
- [ ] Department logic flow with refresh and cache check it properly all the cases.

---

## Future Plan: Stale-While-Revalidate + ETag Caching for Department Data

### Overview
Upgrade the current `sessionStorage`-based department cache to support background revalidation using HTTP ETags, so the UI always renders instantly from cache while staying in sync with server data after deployments or data changes — without any loading spinners.

### How it should work
- On page load, **render immediately from `sessionStorage`** — zero network wait, UI unaffected.
- **Simultaneously fire a background `GET /api/departments`** request with `If-None-Match: "<stored-etag>"` header.
- If server returns **304 Not Modified** → do nothing, cache is still fresh.
- If server returns **200 + new ETag** → silently update `sessionStorage` with new data + new ETag. Optionally re-render if data actually changed.
- User never sees a loading state for the background revalidation.

### Implementation Steps
1. **Backend** — Add ETag generation to the departments endpoint:
   - Generate ETag as `md5(JSON.stringify(departments))` or better, use `max(updatedAt)` from the DB.
   - Check `If-None-Match` header → return `304` if it matches, else return `200` with new `ETag` response header.
   - Set `Cache-Control: no-cache` (means revalidate before use, not "don't cache").

2. **`departmentCache.ts`** — Extend the cache to store and retrieve ETags:
   - Add `etag?: string` to `CachedDepartmentData` interface.
   - Update `set(data, etag?)` to persist the ETag alongside departments.
   - Add `getEtag(): string | null` method.

3. **`departments/page.tsx`** — Implement stale-while-revalidate:
   - If cache hit → render immediately, then call `revalidateInBackground(etag)` (fire and forget).
   - If cache miss → normal blocking fetch as today.
   - `revalidateInBackground` sends conditional request; on `304` exits silently; on `200` updates cache and optionally calls `setDepartments()`.

4. **`apiFetch` / raw `fetch`** — The background revalidation needs raw `fetch` (not the current `apiFetch` wrapper) to access response headers for the new ETag value. Either extend `apiFetch` to return headers or use `fetch` directly for this one call.

5. **`DepartmentDetailClient.tsx` and `useExamData.ts`** — These also use the cache; they benefit automatically once cache is updated by the background revalidation on the departments list page.

### What This Replaces / Augments
- Replaces the current hard 30-minute TTL expiry with server-authoritative invalidation.
- Combines with the existing logout cache clear (`departmentCache.clear()`) already in place.
- Makes the **Build-time Deploy ID** approach (option 2) unnecessary since ETag handles server-side changes automatically.

### Three Cache Tiers After Implementation
| Scenario | User Experience | Network |
|---|---|---|
| Cache hit, data unchanged (304) | Instant render, nothing updates | 1 lightweight request, empty body |
| Cache hit, data changed (200) | Instant render → silent update | 1 full request (background) |
| Cache miss (first visit / logout) | Loading spinner → render | 1 full request (blocking) |

### Key Constraints
- Background revalidation must **never block the UI** — fire and forget, no `await` on the render path.
- Only update `setDepartments()` state if the new data is actually different (compare by ETag, not deep equality).
- ETag must be stored in `sessionStorage` alongside the data, not in memory (survives page refreshes within session).
- This pattern is identical to what **SWR** (`stale-while-revalidate`) and **React Query** do internally.

### Reference
- HTTP ETag spec: RFC 9110 (HTTP Semantics)
- Stale-While-Revalidate directive: RFC 5861
- Production usage: GitHub API, Google APIs, Cloudflare CDN edge caching
- Discussed on: 2026-03-26
