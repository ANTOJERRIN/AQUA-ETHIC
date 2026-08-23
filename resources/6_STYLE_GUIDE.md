# River — Visual Style Guide (Implementation Spec for Antigravity)

Reference aesthetic: real-time tracking/telemetry dashboards — think **MarineTraffic**, **FlightRadar24**, the **boAt lifestyle app**, and **Apple Watch complications** (glanceable circular rings, bold big numbers, minimal chrome, glowing "live" accents on a near-black base). The current build (see screenshots) already has the right bones — dark surface, status colors, card layout. This spec pushes it from "good dark UI" to "feels like a live tracking instrument."

**Instruction for Antigravity:** apply this style guide globally, across every page (Login, Location, Purity, Account) and every shared component (header, footer, nav, buttons, cards, badges). Don't restyle one screen in isolation — the logo treatment, color tokens, and card system below must be identical everywhere they appear.

---

## 1. Logo treatment — italic bold "River" wordmark

The logo text itself must be styled consistently everywhere it appears (header, loading screen, footer), using this exact treatment:

```css
.river-logo {
  font-family: 'Georgia', 'Playfair Display', serif; /* elegant italic serif, not a generic sans */
  font-style: italic;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #60A5FA 0%, #2E7CD6 60%, #1E5FA8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Header / nav placement — small, static, no animation */
.river-logo--header {
  font-size: 1.75rem; /* ~28px */
}

/* Loading screen — large, hero, animated */
.river-logo--hero {
  font-size: 4rem; /* ~64px */
  animation: logo-pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes logo-pop-in {
  0%   { opacity: 0; transform: scale(0.7); }
  100% { opacity: 1; transform: scale(1); }
}
```

The pop-in animation is reserved for the loading screen only — every other instance is static. Keep the mark's blue gradient consistent whether on the light or dark surface.

---

## 2. Color tokens

```css
:root {
  /* Surfaces */
  --bg-primary: #0B0F17;
  --bg-surface: #131A26;
  --bg-surface-elevated: #1B2432;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-emphasis: rgba(255, 255, 255, 0.16);

  /* Text */
  --text-primary: #F5F7FA;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  /* Brand */
  --accent-blue: #2E7CD6;
  --accent-blue-light: #60A5FA;
  --accent-blue-glow: rgba(59, 130, 246, 0.35);

  /* Status */
  --status-safe: #22C55E;
  --status-safe-glow: rgba(34, 197, 94, 0.3);
  --status-caution: #F59E0B;
  --status-caution-glow: rgba(245, 158, 11, 0.3);
  --status-risk: #EF4444;
  --status-risk-glow: rgba(239, 68, 68, 0.3);

  /* Radii & shadow */
  --radius-card: 20px;
  --radius-pill: 999px;
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.35);
}

/* Light mode overrides */
[data-theme="light"] {
  --bg-primary: #F7F9FC;
  --bg-surface: #FFFFFF;
  --bg-surface-elevated: #F0F3F8;
  --border-subtle: rgba(15, 23, 42, 0.08);
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --shadow-card: 0 8px 32px rgba(15, 23, 42, 0.08);
}
```

---

## 3. Typography scale

Use full semantic hierarchy on every page — don't flatten everything to `<div>`s with font-size overrides.

```css
h1 { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em; }      /* page titles, e.g. "Ganga River — Kanpur Stretch" */
h2 { font-size: 1.375rem; font-weight: 700; }                              /* section headers, e.g. "Monitoring History" */
h3 { font-size: 1.125rem; font-weight: 600; }                              /* card titles */
h4 { font-size: 0.9375rem; font-weight: 600; }                             /* sub-card labels */

.eyebrow {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}                                                                            /* e.g. "PH LEVEL", "TURBIDITY (NTU)" */

.metric-value {
  font-size: 2.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}                                                                            /* e.g. "82", "24.5" */

.metric-unit { font-size: 1rem; font-weight: 500; color: var(--text-secondary); }

body { font-size: 0.9375rem; color: var(--text-primary); line-height: 1.5; }

i, em, .tagline {
  font-style: italic;
  color: var(--text-secondary);
}                                                                            /* taglines, subtitles, e.g. "Water Intelligence" */
```

---

## 4. Component styles

### Card

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 24px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--border-emphasis);
}
```

### Status badge (pill, with matching glow)

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 600;
}
.badge--safe    { background: var(--status-safe-glow);    color: var(--status-safe); }
.badge--caution { background: var(--status-caution-glow); color: var(--status-caution); }
.badge--risk    { background: var(--status-risk-glow);    color: var(--status-risk); }
```

### Purity ring (Apple Watch–style activity ring)

```css
.purity-ring {
  --pct: 82; /* set dynamically */
  --ring-color: var(--status-safe);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(var(--ring-color) calc(var(--pct) * 1%), var(--bg-surface-elevated) 0);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 12px var(--status-safe-glow));
  animation: ring-fill 1s ease-out;
}
.purity-ring::before {
  content: '';
  width: 88%;
  height: 88%;
  border-radius: 50%;
  background: var(--bg-surface);
}
@keyframes ring-fill {
  from { --pct: 0; }
}
```

### Threshold bar (used under pH/turbidity/DO/temp readings)

```css
.threshold-bar {
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--bg-surface-elevated);
  overflow: hidden;
}
.threshold-bar__fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width 0.6s ease;
}
.threshold-bar__fill--safe    { background: linear-gradient(90deg, var(--status-safe), #4ADE80); }
.threshold-bar__fill--caution { background: linear-gradient(90deg, var(--status-caution), #FBBF24); }
.threshold-bar__fill--risk    { background: linear-gradient(90deg, var(--status-risk), #F87171); }
```

### Live pulse indicator (map station pins, "Telemetry Network Live" footer dot)

```css
.pulse-dot {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--status-safe);
}
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--status-safe);
  animation: pulse-ring 2s ease-out infinite;
}
@keyframes pulse-ring {
  0%   { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}
```

Use this exact pulse treatment on: map station markers (like ship-tracking pins), the "live" dot next to notification bell, and the footer's "Telemetry Network Live" status.

### Primary button

```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent-blue-light), var(--accent-blue));
  color: white;
  font-weight: 700;
  border-radius: 12px;
  padding: 14px 24px;
  box-shadow: 0 4px 20px var(--accent-blue-glow);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.btn-primary:hover {
  box-shadow: 0 6px 28px var(--accent-blue-glow);
  transform: translateY(-1px);
}
```

### Header / nav bar

```css
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(16px);
  background: rgba(11, 15, 23, 0.75); /* var(--bg-primary) at 75% */
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 32px;
}
.app-header__nav a {
  position: relative;
  color: var(--text-secondary);
  font-weight: 600;
  padding-bottom: 6px;
}
.app-header__nav a.active {
  color: var(--text-primary);
}
.app-header__nav a.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-blue-light);
  animation: underline-grow 0.25s ease-out;
}
@keyframes underline-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

---

## 5. Motion & micro-interactions

- **Metric numbers count up** from 0 to their value on page load (200–500ms, ease-out) rather than appearing instantly — this is what makes a dashboard feel "live" rather than static.
- **Charts draw in** left-to-right on load rather than popping in fully rendered.
- **Skeleton shimmer** while data loads (subtle gradient sweep on `--bg-surface-elevated`), not a spinner — keeps the instrument-panel feel.
- **Timestamps tick**: "Refreshed 10 mins ago" should actually recompute client-side rather than being a static string.
- Respect `prefers-reduced-motion`: disable pulse/pop/count-up animations, keep instant state changes, for users who've set that OS preference.

---

## 6. Apple Watch–style data density

Arrange secondary metrics (Turbidity, pH, Dissolved Oxygen, Water Temp) as a tight 2x2 grid of compact tiles — eyebrow label, big tabular number, unit, threshold bar — mirroring watch face complications rather than a long vertical list. Keep chrome minimal: no heavy borders between tiles, let spacing and the card boundary do the separation.

---

## 7. Map markers (tracking-app style)

Station pins on the Location page map should use the pulse-dot treatment above, color-coded by status (green/amber/red), with a small label callout on hover/active state — matching how MarineTraffic/FlightRadar24 render live vessel/aircraft positions rather than static map pins.

---

## 8. Accessibility guardrails

- Maintain WCAG AA contrast for text against `--bg-surface` even with glow effects layered behind it — glows are decorative, not load-bearing for legibility.
- Status must never be color-only: badges and threshold bars always pair color with an icon or text label (already true in the current build — keep it that way as styling gets richer).
