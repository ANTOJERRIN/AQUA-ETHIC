# Frontend — Architecture

App: **River** (web app — responsive, desktop + tablet + mobile browser)

Assumption: React (or Next.js) + Tailwind, since that's what Google Stitch's web exports map onto most cleanly. Swap freely if you're using something else — the architecture below doesn't depend on the specific framework.

Design prompts for Google Stitch live in a separate file: **`1b_STITCH_WEB_DESIGN_PROMPTS.md`** — that file is meant to be handed straight to Stitch without any of this architecture context around it.

---

## Page flow

```
Loading screen (logo pop-in, first load only)
   │
Login / Signup ──────► JWT stored (httpOnly cookie preferred for web)
   │
┌──┴─────────────────────────────────────┐
│         Top nav / header bar             │
│   Logo · Location · Purity · Account     │
└───────────┬───────────┬──────────────────┘
   /location      /purity        /account
  (Page 1)        (Page 2)       (Page 3)
```

Web convention swap from a mobile app: **bottom tab bar → top nav/header bar** (or a left sidebar on wide viewports). Each page is a real route (`/location`, `/purity`, `/account`) so it's linkable, bookmarkable, and works with browser back/forward — unlike a mobile app's tab state.

## What each page talks to

| Page | Backend calls | Notes |
|---|---|---|
| Login/Signup | `POST /auth/login`, `POST /auth/signup` | JWT in httpOnly cookie — safer for web than localStorage |
| /location | browser Geolocation API → `GET /locations` (nearest match) → `GET /locations/{id}/current` | Browser prompts for location permission; handle "denied" with the manual search/picker so the app still works |
| /purity | `GET /locations/{id}/history?range=` with a source toggle (satellite vs IoT) | Chart renders whatever series the API returns — keep it source-agnostic |
| /account | `GET /account/me`, `GET /account/history` | History list links back to `/purity?location=` |

## State & offline handling

- Simple state layer (React Context or Zustand): `auth`, `locations`, `readings`.
- Cache the last successful `/history` response per location in memory/sessionStorage — 2G-fed backend data can lag, and a chart shouldn't go blank when that happens. Show a "last updated Xm ago" label instead of failing silently.
- Anomaly banner (/purity) is driven purely by the backend's `anomaly_flag` field — don't duplicate threshold logic client-side.

## Responsive behavior

- Desktop width: side-by-side panels — e.g. on /location, map on the left and details card on the right; on /purity, chart and reading-list side by side.
- Mobile/narrow width: everything stacks into a single column, header collapses to a compact bar (hamburger menu optional if you want the 3 nav links tucked away).
- Design both states in Stitch from the same prompt with an explicit responsive note — see the Stitch prompt file.

## Branding — logo usage

Final logo: cursive "River" wordmark in blue gradient, small leaf accent above the "i", wave flourish underneath.

- **Loading screen** (first visit / full page reload only): logo large and centered, alone, pop-in/scale-in animation — the one hero moment.
- **Every page after that** (login, /location, /purity, /account): small, static wordmark top-left of the header — standard website logo placement, ~28–32px tall, no animation.

Never replay the pop-in animation outside the loading screen — repeating it on every page is what makes a logo placement look like a gimmick instead of professional branding.

## Design tokens

```
App name: River
Primary: blue (#2E7CD6-ish)
Status colors: green = safe, amber = caution, red = risk/anomaly
Full light + dark mode
Rounded cards, soft shadows, generous whitespace — premium, not playful
Typography: clean sans-serif, large numbers for readings, muted labels
Top header bar with logo + 3 nav links (Location, Purity, Account)
Responsive: side-by-side desktop panels collapsing to single column on mobile width
```
