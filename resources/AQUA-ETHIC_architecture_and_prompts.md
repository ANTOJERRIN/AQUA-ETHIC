# AQUA-ETHIC — Architecture & Build Prompts

App name in UI: **River** · Team: Neeraj K J, Jerrin Anto, Thulasi G T, Sudeeksha

---

## 1. How the three layers fit together

Your system has two *independent* data sources feeding one *unified, verified* pipeline — that's the actual innovation, not just "we used blockchain."

1. **Satellite screening layer** (your notebook) runs periodically over a wide area, computes NDTI/NDCI/TSS/CDOM from Sentinel-2 imagery, and flags anomalous water bodies. This answers *"where should we deploy buoys / pay attention?"* — it's a coarse, wide-area early warning system, not real-time ground truth.
2. **IoT buoy layer** (ESP32 + sensors) gets physically deployed at the flagged high-risk locations and gives continuous, real-time, ground-truth readings (pH, turbidity, temp, DO) over 2G.
3. **Backend** merges both streams, hash-chains every record for tamper-evidence, and optionally anchors batches to Polygon Amoy testnet.
4. **App (River)** shows both: satellite risk-history overlaid with live buoy readings, on a per-lake basis.

```
Satellite (GEE)  ──┐
  NDTI/NDCI/TSS/    ├──► Backend (FastAPI) ──► Hash-chain ledger ──► App (River)
  CDOM, scheduled    │      merges + verifies         │
                      │                          Polygon Amoy (optional anchor)
IoT buoy (ESP32) ──┘
  pH/turbidity/temp/DO
  over 2G, continuous
```

---

## 2. Hardware layer (buoy)

From your parts list — here's how they fit together functionally:

| Component | Role |
|---|---|
| ESP32 | Main controller, reads sensors, packages JSON, pushes over cellular |
| 2G/GPRS cellular module | Uplink where WiFi/4G isn't available on rivers/lakes |
| Analog pH sensor | Water pH |
| Turbidity sensor | Suspended sediment (cross-checks against satellite NDTI) |
| DS18B20 (waterproof) + 4.7kΩ resistor | Water temperature (needs pull-up resistor for 1-Wire protocol) |
| Solar panel (6V) + TP4056 + 18650 Li-ion + holder | Self-sustaining power loop: panel charges cell via TP4056, boost converter steps 18650's ~3.7V up to what ESP32/sensors need |
| Boost converter | Stabilizes voltage from the Li-ion cell to 5V for ESP32 |
| Waterproof container + swimming tube + mini rope | Buoyancy and enclosure — 3D-modelled housing keeps electronics dry, tube/rope keeps it floating and anchored |
| Breadboard, jumper wires | Prototyping before final soldered/3D-printed build |

**Power note for your pitch:** this is a genuinely solar-autonomous node — worth calling out explicitly since it's what makes "~₹10–15K per buoy, scalable to villages" credible.

**Firmware loop (ESP32):** read sensors → build JSON payload `{device_id, lat, lng, ph, turbidity, temp, timestamp}` → HMAC-sign it with a per-device secret key → POST over 2G to the ingestion endpoint → sleep/retry on failure (2G drops are common — buffer readings locally and retry, don't lose data).

---

## 3. Backend architecture

### Two ingestion paths, one verified store

**A. Satellite ingestion (scheduled, not real-time)**
- A cron job (or Cloud Scheduler) runs your GEE notebook logic as a script: pulls Sentinel-2 for each tracked AOI, computes NDTI/NDCI/TSS_ratio/CDOM_ratio, flags anomalies (mean + 2·std, exactly as your notebook does).
- Writes one row per AOI per scan into `satellite_scans`.
- If a scan is anomalous, it can trigger "recommend buoy deployment here" — this is your Detection → Verification → Alert → Action loop from the pitch.

**B. IoT ingestion (continuous, real-time)** — same as we designed earlier: device signs payload → API validates HMAC → writes to `sensor_readings` off-chain table → writes a linked block to `ledger_blocks` (hash-chain).

### Schema sketch

```
locations        (id, name, river_or_lake, lat, lng)  -- e.g. "Ganga - Kanpur", "Arkavathi"
satellite_scans   (id, location_id, date, ndti, ndci, tss_ratio, cdom_ratio, anomaly_flag)
sensor_readings   (id, device_id, location_id, timestamp, ph, turbidity, temp, dissolved_oxygen)
ledger_blocks     (index, timestamp, data_hash, previous_hash, hash)  -- one block per sensor_reading
users             (id, email, password_hash, role)
```

### API surface the app needs

```
POST /auth/login, /auth/signup
GET  /locations                          -> list + search (Ganga, Arkavathi test cases)
GET  /locations/{id}/current              -> latest lat/lng + name/details          (Screen 1)
GET  /locations/{id}/history?range=week   -> merged satellite + IoT purity series   (Screen 2)
GET  /ledger/verify                       -> chain integrity check ("intact" / "tampered at block N")
GET  /account/me, /account/history
```

### Backend build prompt (paste into Claude Code / your AI coding tool)

```
Build a FastAPI backend for a water quality monitoring system called AQUA-ETHIC.

Two ingestion sources write into a shared, tamper-evident store:
1. A scheduled satellite job that writes rows to `satellite_scans`
   (location_id, date, ndti, ndci, tss_ratio, cdom_ratio, anomaly_flag).
2. An IoT ingestion endpoint POST /ingest that receives HMAC-signed JSON from
   ESP32 buoys: {device_id, lat, lng, ph, turbidity, temp, timestamp, signature}.
   Verify the HMAC using a per-device secret stored in a `devices` table, reject
   on mismatch, then write to `sensor_readings` AND append a linked block to
   `ledger_blocks` where each block stores index, timestamp, sha256(reading),
   previous_hash, and hash = sha256(index+timestamp+data_hash+previous_hash).

Expose:
- GET /locations, GET /locations/{id}/current, GET /locations/{id}/history
- GET /ledger/verify (walks the chain, returns intact or the first broken index)
- POST /auth/login, /auth/signup (JWT)
- GET /account/me

Use PostgreSQL (SQLAlchemy models), Pydantic schemas, and structure it as
routers/models/services. Seed two test locations: "Ganga - Kanpur stretch" and
"Arkavathi lake". Include a stub service `satellite_ingest.py` that mirrors this
Earth Engine logic (I'll wire in real GEE calls myself): compute NDTI = 
normalized difference of B4/B3, NDCI = normalized difference of B5/B4,
TSS_ratio = B4/B3, CDOM_ratio = B2/B3, flag anomaly when value > mean + 2*std
over the AOI's scan history.
```

---

## 4. Frontend — Google Stitch prompts

Design tokens to reuse across every screen so Stitch stays consistent:

```
Design system: App name "River". Flutter-style mobile app, iOS + Android.
Color palette: primary blue (#2E7CD6-ish), success/safe green, alert/danger red,
neutral grays. Full light and dark mode support. Rounded cards, soft shadows,
generous whitespace, premium/professional feel — not playground-colorful.
Typography: clean sans-serif, clear hierarchy (large numbers for readings,
muted labels). Bottom navigation bar with 3 tabs. Smooth scrolling content,
not cramped. Icon style: outline icons, water/nature themed where relevant
(droplet, wave, leaf) — subtle, not cartoonish.
```

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
red. Bottom navigation bar with 3 tabs: Location (active, map-pin icon),
Purity (droplet icon), Account (user icon). Support light and dark mode.
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
a reading crosses the safe threshold, matching how the backend flags
anomalies. Bottom nav bar, Purity tab active. Light and dark mode.
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

---

## 5. Build order suggestion

Given hackathon time pressure, I'd sequence it: **hardcode the two test locations (Ganga, Arkavathi) with seeded/mocked history data first**, get all 3 Stitch screens wired to that mock data end-to-end, *then* wire in the real GEE scheduled job and live ESP32 ingestion last — that way you always have a working demo even if the live 2G buoy link is flaky on stage.

Want me to also draft the actual ESP32 firmware (Arduino/C++) for the sensor-read-and-post loop, or the Earth Engine scheduled-job script pulled straight from your notebook?
