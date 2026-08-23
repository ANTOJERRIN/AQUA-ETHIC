# Frontend — Architecture & Prompts

App: **River** (Flutter, iOS + Android)

---

## Architecture

### Screen flow

```
Splash (logo pop-in)
   │
Login / Signup ──────► JWT stored on device
   │
┌──┴─────────────────────────────────┐
│         Bottom nav (3 tabs)         │
├───────────┬───────────┬────────────┤
│ Location  │  Purity   │  Account   │
│ (Screen1) │ (Screen2) │ (Screen3)  │
└───────────┴───────────┴────────────┘
```

### What each screen actually talks to

| Screen | Backend calls | Notes |
|---|---|---|
| Splash/Login | `POST /auth/login`, `POST /auth/signup` | JWT stored securely (flutter_secure_storage) |
| Screen 1 — Location | device GPS → `GET /locations` (nearest match) → `GET /locations/{id}/current` | If GPS can't resolve a known monitored location, fall back to a location search/picker so Ganga/Arkavathi test cases are always reachable |
| Screen 2 — Purity | `GET /locations/{id}/history?range=` with a source toggle (satellite vs IoT) | Chart just renders whatever series the API returns — keep the chart component source-agnostic so it doesn't care which layer the data came from |
| Screen 3 — Account | `GET /account/me`, `GET /account/history` | History list reuses the Screen 2 navigation target |

### State & offline handling

- Use a simple state layer (Provider/Riverpod) with three stores: `auth`, `locations`, `readings`.
- Cache the last successful `/history` response per location locally — 2G-fed backend data can lag or drop, and the app shouldn't show a blank chart when that happens. Show a "last updated Xm ago" label instead of failing silently.
- Anomaly banner (Screen 2) is driven purely by the `anomaly_flag` field the backend already computes — don't duplicate threshold logic in the app.

### Design tokens (keep every Stitch screen consistent)

```
App name: River
Primary: blue (#2E7CD6-ish)
Status colors: green = safe, amber = caution, red = risk/anomaly
Full light + dark mode
Rounded cards, soft shadows, generous whitespace — premium, not playful
Typography: clean sans-serif, large numbers for readings, muted labels
Bottom nav, 3 tabs, outline icons (droplet, wave, leaf, map-pin, user)
Smooth scrolling, not cramped
```

---

## Google Stitch prompts

### Prompt 0 — Splash + login

```
Design a splash screen for a Flutter app called "River". Center a minimal
circular/droplet-shaped logo with a subtle pop-in scale animation on load,
app name "River" below it in clean sans-serif, tagline "Know your water" in
muted text. Background: soft gradient from light blue to white (dark mode:
deep navy to black). After ~1.5s, transition to a login screen: email field,
password field, "Log in" primary button (blue), "Create account" link below,
minimal and premium — think a fintech app's calm login screen, not a busy one.
```

### Prompt 1 — Screen 1: Location

```
Design screen 1 of "River", a water quality app. On load it requests location
permission with a clean system-style prompt. Once granted, show a full-width
map preview at the top (rounded corners) centered on the user's current
location, with a pin. Below the map: a card showing the identified lake/river
name in large text (e.g. "Ganga - Kanpur stretch"), a subtitle with district/
state, and a small "last scanned" timestamp. Below that: a horizontal chip
row showing quick status — safe / caution / risk — color-coded green/amber/
red. Include a search/picker affordance for choosing a different monitored
location manually. Bottom navigation bar with 3 tabs: Location (active,
map-pin icon), Purity (droplet icon), Account (user icon). Light and dark mode.
```

### Prompt 2 — Screen 2: Purity / history

```
Design screen 2 of "River", the purity testing screen for a selected water
body (test case: "Ganga - Kanpur stretch", second test case: "Arkavathi lake
- Bengaluru, flagged as one of India's most polluted lakes"). Top: location
name + a large primary "Purity Score" ring/gauge (0-100, color-coded green
to red). Below: a segmented toggle for "Remote sensing" vs "IoT sensor" data
source. Under it, a line/area chart showing the selected metric over time
(NDTI/NDCI for remote sensing mode; pH/turbidity/temperature/dissolved
oxygen for IoT mode), with a time range selector (week/month/year) and an
input for location + year/week. Below the chart: a scrollable list of
individual readings as cards, each with metric name, value, unit, and a
small colored status dot. Include an "anomaly flagged" banner (amber) when
a reading crosses the safe threshold. Show a subtle "last updated Xm ago"
label near the chart. Bottom nav bar, Purity tab active. Light and dark mode.
```

### Prompt 3 — Screen 3: Account dashboard

```
Design screen 3 of "River", an account dashboard. Top: user avatar circle,
name, email. Below: a "Monitoring history" section listing locations the
user has checked, each as a row with lake name, last purity score badge,
and date — tappable to revisit that location's purity screen. Below that:
a settings list (notification preferences, dark mode toggle, log out) using
simple rows with leading icons and trailing chevrons. Clean, minimal,
premium fintech-dashboard feel. Bottom nav bar, Account tab active. Light
and dark mode.
```
