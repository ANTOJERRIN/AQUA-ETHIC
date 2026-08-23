# Backend — Architecture & Prompts

FastAPI, PostgreSQL, hosted free-tier (Render/Railway/Supabase)

---

## Architecture

### Two ingestion paths into one store

```
Satellite job (scheduled)         IoT buoy (continuous, 2G)
   │ writes                            │ HMAC-signed POST
   ▼                                    ▼
satellite_scans table            /ingest endpoint
   │                                    │ verify signature
   │                                    ▼
   │                             sensor_readings table
   │                                    │
   │                                    ▼
   │                             ledger_blocks table (see blockchain file)
   │                                    │
   └──────────────┬─────────────────────┘
                   ▼
          Unified API layer (serves the app)
```

The backend's real job is to make satellite data and IoT data *interchangeable* to the app — both ultimately describe "how safe is this water body right now," just at different resolutions (wide-area/periodic vs. point/continuous). Screen 2's data-source toggle just switches which table the query hits.

### Schema

```
locations        (id, name, river_or_lake, lat, lng)
satellite_scans   (id, location_id, date, ndti, ndci, tss_ratio, cdom_ratio, anomaly_flag)
devices           (id, location_id, secret_key, registered_at)
sensor_readings   (id, device_id, location_id, timestamp, ph, turbidity, temp, dissolved_oxygen)
ledger_blocks     (index, timestamp, data_hash, previous_hash, hash)  -- see blockchain file
users             (id, email, password_hash, role)
```

### API surface

```
POST /auth/login, /auth/signup                    -> JWT
POST /ingest                                       -> IoT buoy writes (HMAC-verified)
GET  /locations                                     -> list/search (Ganga, Arkavathi seeded)
GET  /locations/{id}/current                        -> latest lat/lng + name/details   (Screen 1)
GET  /locations/{id}/history?source=&range=         -> satellite OR iot series          (Screen 2)
GET  /ledger/verify                                  -> chain integrity check
GET  /account/me, /account/history
```

### Why the satellite job is separate from the request path

Satellite scans are periodic (Sentinel-2 revisit is every few days) and computationally heavier (Earth Engine calls) — running that inline on a user request would make Screen 1/2 slow. Run it as a scheduled job (cron / Cloud Scheduler) that just writes rows; the app only ever reads pre-computed rows.

---

## Backend build prompt

Paste into Claude Code or your AI coding tool:

```
Build a FastAPI backend for a water quality monitoring system called AQUA-ETHIC.

Models (SQLAlchemy, PostgreSQL):
- Location(id, name, river_or_lake, lat, lng)
- SatelliteScan(id, location_id FK, date, ndti, ndci, tss_ratio, cdom_ratio, anomaly_flag)
- Device(id, location_id FK, secret_key, registered_at)
- SensorReading(id, device_id FK, location_id FK, timestamp, ph, turbidity, temp, dissolved_oxygen)
- User(id, email, password_hash, role)

Endpoints:
- POST /auth/signup, POST /auth/login -> JWT (passlib + python-jose)
- POST /ingest -> body {device_id, lat, lng, ph, turbidity, temp, dissolved_oxygen,
  timestamp, signature}. Look up the device's secret_key, recompute HMAC-SHA256 over
  the payload, reject with 401 on mismatch. On success, insert into SensorReading,
  then call a ledger service (I'll wire this separately) to append a chained block.
- GET /locations -> list, with optional ?search=
- GET /locations/{id}/current -> most recent known position + name/details for that location
- GET /locations/{id}/history?source=satellite|iot&range=week|month|year -> time series:
  for source=satellite, pull SatelliteScan rows; for source=iot, pull SensorReading rows.
  Return a uniform shape: [{timestamp, metric, value, unit, anomaly}].
- GET /account/me, GET /account/history (locations the authenticated user has viewed)

Structure as routers/models/schemas/services, use Pydantic v2 schemas, alembic for
migrations. Seed two Location rows: "Ganga - Kanpur stretch" and "Arkavathi lake -
Bengaluru". Add a stub `services/satellite_ingest.py` with a function
`run_scan(location_id)` that I'll wire to real Earth Engine calls later — for now
have it accept precomputed NDTI/NDCI/TSS/CDOM values and just insert the row with
anomaly_flag = value > mean + 2*std over that location's scan history.
```

### Satellite scheduled-job prompt (separate script, run via cron/Cloud Scheduler)

```
Write a Python script that runs the following Earth Engine logic on a schedule
(once daily) for each Location in the database, and writes results into the
SatelliteScan table via the backend's /ingest-satellite endpoint (or directly
via SQLAlchemy if run in the same environment):

For each location's AOI (bounding box around its lat/lng):
1. Load Sentinel-2 SR harmonized imagery, filter by AOI and date range (last
   scan date to today), filter CLOUDY_PIXEL_PERCENTAGE < 20.
2. Mask non-water pixels using NDWI = normalizedDifference(B3, B8) > 0.
3. Compute NDTI = normalizedDifference(B4, B3), NDCI = normalizedDifference(B5, B4),
   TSS_ratio = B4/B3, CDOM_ratio = B2/B3.
4. Reduce each index to a mean value over the AOI (reduceRegion, scale=10).
5. Compare against this location's historical mean + 2*std for each index;
   set anomaly_flag = True if any index exceeds its threshold.
6. Insert one SatelliteScan row per location per successful scene.

Use the earthengine-api and pandas. Log scenes skipped due to cloud cover.
```
