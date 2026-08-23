# River — Google Stitch Web Design Prompts

Paste these directly into Google Stitch. Design system prompt first, then one prompt per page, in order. Each page prompt references the logo and colors so Stitch keeps them consistent — but pasting the design system prompt first (or at the top of each page prompt) helps lock that in across generations.

---

## Design system (paste first / reuse at the top of each prompt)

```
Design system for a web app called "River" — a water quality monitoring
platform. Desktop-first responsive web app (not mobile app), targeting
browser viewports from ~1440px wide down to ~375px mobile width.

Logo: a cursive, hand-lettered "River" wordmark in a blue gradient, with a
small leaf accent above the "i" and a two-line wave flourish underneath
the word.

Colors: primary blue (#2E7CD6-ish), status colors green = safe, amber =
caution, red = risk/anomaly. Full light and dark mode support.

Layout: top header bar (not a mobile bottom nav) with the logo on the
left and navigation links "Location", "Purity", "Account" to the right.
Rounded cards, soft shadows, generous whitespace, premium and professional
— think a clean fintech or environmental-dashboard web app, not a
consumer mobile app.

Typography: clean sans-serif, large numbers for key readings, muted
labels for secondary text.

Responsive behavior: on desktop width, use side-by-side panels (e.g. a
map next to a details card, or a chart next to a reading list). On
mobile width, collapse everything into a single stacked column and
condense the header nav into a hamburger menu.
```

---

## Prompt 0 — Loading screen + login

```
Design a loading screen for a web app called "River". Center the app's
logo — a cursive "River" wordmark in blue gradient with a leaf accent
above the "i" and a wave flourish underneath — large and alone in the
middle of the page, with a subtle pop-in/scale-in animation as the page
loads. Background: soft, near-white gradient (dark mode: deep navy to
black) so the logo's blue stands out clearly. No other content on this
screen — it's a brief loading state only, shown on first visit or full
page reload.

After it loads, transition to a login page: centered card on the page,
with the same "River" wordmark shown small and static at the top of the
card (no animation here — animation is reserved for the loading screen
only), then email field, password field, "Log in" primary button (blue),
"Create account" link below. Minimal, centered, premium — like a clean
SaaS login page, not a busy consumer app screen. Show this same layout
responsively centered on both desktop and mobile widths.
```

---

## Prompt 1 — Location page

```
Design the Location page of "River". Top header bar: small static "River"
wordmark logo on the left, nav links "Location" (active), "Purity",
"Account" on the right (collapse to a hamburger menu on mobile width).

On page load, the browser requests location permission via a clean
in-page prompt. Once granted, show a map panel taking up roughly the left
60% of the page on desktop (rounded corners, card-style border) centered
on the user's location with a pin. On the right 40%: a card showing the
identified lake/river name in large text (e.g. "Ganga - Kanpur stretch"),
a subtitle with district/state, and a small "last scanned" timestamp.
Below that card: a horizontal row of status chips — safe / caution / risk
— color-coded green/amber/red. Include a search/picker input above the
map for choosing a different monitored location manually (useful test
cases: "Ganga - Kanpur stretch", "Arkavathi lake - Bengaluru").

On mobile width, stack vertically: search bar, then map, then the details
card, then the status chips — all full width.
```

---

## Prompt 2 — Purity page

```
Design the Purity page of "River". Top header bar: small static "River"
wordmark logo on the left, nav links "Location", "Purity" (active),
"Account" on the right (hamburger on mobile).

Below the header: location name as a page title, next to a large primary
"Purity Score" ring/gauge (0-100, color-coded green to red) on desktop,
laid out side by side. Below that: a segmented toggle for "Remote
sensing" vs "IoT sensor" data source, and a time range selector (week /
month / year) plus a location + year/week input, laid out in a filter bar.

Main content area on desktop: a line/area chart on the left ~65% showing
the selected metric over time (NDTI/NDCI for remote sensing mode; pH,
turbidity, temperature, dissolved oxygen for IoT mode), and a scrollable
list of individual reading cards on the right ~35%, each showing metric
name, value, unit, and a small colored status dot. Include an "anomaly
flagged" banner (amber) above the chart when a reading crosses the safe
threshold, and a subtle "last updated Xm ago" label near the chart.

Test cases to reflect in sample data: "Ganga - Kanpur stretch" and
"Arkavathi lake - Bengaluru" (flagged as high-risk).

On mobile width: stack the gauge, filter bar, chart, then reading list —
all full width, chart height reduced to fit comfortably.
```

---

## Prompt 3 — Account page

```
Design the Account page of "River". Top header bar: small static "River"
wordmark logo on the left, nav links "Location", "Purity", "Account"
(active) on the right (hamburger on mobile).

Left column (desktop, ~30% width): a profile card with avatar circle,
name, email, and a "Log out" button. Right column (~70% width): a
"Monitoring history" section listing locations the user has checked, each
as a row/card with lake name, last purity score badge, and date —
clickable through to that location's Purity page. Below that: a settings
list (notification preferences, dark mode toggle) as simple rows with
leading icons and trailing chevrons/toggles.

Clean, minimal, premium dashboard feel — like an account settings page in
a professional SaaS product. On mobile width, stack the profile card
above the monitoring history and settings, all full width.
```
