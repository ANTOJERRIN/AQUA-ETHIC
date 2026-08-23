# AQUA-ETHIC — Full System Integration

How Hardware, Backend, Blockchain, and Frontend fit together end-to-end.

---

## The whole loop, in order

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. SATELLITE (periodic, wide-area)                                   │
│    GEE scheduled job scans AOIs → NDTI/NDCI/TSS/CDOM → flags         │
│    anomalies → writes satellite_scans rows                           │
│    "Tells you WHERE to pay attention"                                │
└───────────────────────────┬───────────────────────────────────────────┘
                             │ flags a high-risk location
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. HARDWARE (continuous, point location)                             │
│    Solar-powered ESP32 buoy deployed at flagged location             │
│    Reads pH / turbidity / temp every ~10 min                         │
│    HMAC-signs payload, sends over 2G                                 │
│    "Gives you ground-truth, real-time confirmation"                  │
└───────────────────────────┬───────────────────────────────────────────┘
                             │ POST /ingest
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. BACKEND (FastAPI)                                                  │
│    Verifies HMAC → writes sensor_readings                            │
│    Also runs the satellite job's writes into satellite_scans         │
│    Both feed the same /locations/{id}/history endpoint               │
│    "Merges both data sources into one queryable, verified store"     │
└───────────────────────────┬───────────────────────────────────────────┘
                             │ every write
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. BLOCKCHAIN / INTEGRITY LAYER                                       │
│    Each sensor_reading appended as a hash-chained block               │
│    Batches optionally anchored to Polygon Amoy testnet                │
│    GET /ledger/verify proves nothing's been tampered with            │
│    "Makes the record trustworthy, not just available"                │
└───────────────────────────┬───────────────────────────────────────────┘
                             │ GET requests from the app
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. FRONTEND (River — Flutter app)                                     │
│    Screen 1: current location + status chip                          │
│    Screen 2: purity chart, satellite/IoT toggle, anomaly banner      │
│    Screen 3: account + monitoring history                            │
│    "What the citizen or authority actually sees and acts on"         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## A single reading's journey (concrete walkthrough)

1. A buoy at **Arkavathi lake** wakes up, reads pH 6.1, turbidity 42 NTU, temp 26°C.
2. ESP32 builds `{device_id: "buoy-04", lat, lng, ph: 6.1, turbidity: 42, temp: 26, timestamp}`, computes an HMAC signature, sends it over 2G to `POST /ingest`.
3. Backend recomputes the HMAC using `buoy-04`'s stored secret key. Match → proceed. Mismatch → 401, discarded, never touches the DB.
4. Reading inserted into `sensor_readings`.
5. Ledger service fetches the last block's hash, computes `data_hash` of this reading, chains a new block into `ledger_blocks`.
6. Separately, that morning's satellite job already wrote a `satellite_scans` row for Arkavathi showing an NDTI anomaly — this is *why* a buoy is deployed there at all.
7. A user opens **River**, Screen 1 shows "Arkavathi lake — Bengaluru" with a red "risk" chip (driven by the satellite anomaly_flag).
8. They tap through to Screen 2, toggle to "IoT sensor" mode, see the pH 6.1 reading plotted, with an amber anomaly banner since it's below the safe threshold.
9. Judges ask "how do we know this data wasn't faked for the demo?" — you hit `GET /ledger/verify` live, it walks the chain and confirms every block, and you can point to the corresponding Polygon Amoy transaction hash for that batch.

---

## Deployment/hosting summary (budget-friendly)

| Layer | Where it runs | Cost |
|---|---|---|
| Backend + DB | Render/Railway free tier + Supabase/Neon free Postgres | Free |
| Satellite job | Same host, cron, or a free GitHub Actions scheduled workflow | Free |
| Blockchain anchoring | Polygon Amoy testnet + free faucet MATIC | Free |
| App | Built via Google Stitch design → implemented in Flutter → sideload/APK for demo | Free |
| Hardware | ESP32 + sensors + 2G module + solar/battery per buoy | ~₹10–15K one-time per unit (as in your pitch) |

---

## Demo script suggestion (for judges)

1. Open **River**, show Screen 1 auto-detecting a monitored location.
2. Switch to Screen 2, show the satellite anomaly history for Arkavathi (the "detection" story).
3. Toggle to IoT mode, show a live-ish buoy reading confirming it (the "verification" story).
4. Hit `/ledger/verify` live — show it returns "intact."
5. Manually tamper with one row in the DB in a second window, hit `/ledger/verify` again — show it now reports the exact broken block. This is the single most convincing 30 seconds of the demo.
6. Show the Polygon Amoy transaction on PolygonScan for that batch, if time allows.
7. Close on Screen 3 — the account/history view — to show this scales to many users tracking many locations.

---

## File index

- `1_FRONTEND_architecture.md` — web app architecture, pages, state, branding
- `1b_STITCH_WEB_DESIGN_PROMPTS.md` — standalone Google Stitch prompts (web)
- `2_BACKEND_architecture_and_prompts.md` — FastAPI, schema, API surface
- `3_BLOCKCHAIN_architecture_and_prompts.md` — hash-chain ledger + Amoy anchoring
- `4_HARDWARE_architecture_and_prompts.md` — buoy build + firmware
- `5_INTEGRATION_full_system.md` — this file

Note: the app is now a **web app** (React/Next.js-style, responsive), not a Flutter mobile app — the frontend files above reflect that. Backend, blockchain, and hardware are unaffected by this change.
