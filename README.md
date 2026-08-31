# AQUA-ETHIC
This is the hardware iot mvp which we re building for decode sih hackathaon ---done by neeraj,thulasi ,sudeeksha and (myself ) Jerrin Anto

## Buoy data flow (frontend + backend)

- **Final flow uses real buoy data through the backend API** (not direct frontend-to-buoy access).
- ESP32 buoy posts telemetry to `POST /api/sensor-data/data`.
- Frontend reads processed/latest telemetry from `GET /api/sensor-data/latest/:deviceId` (and can use `/history/:deviceId` for trend views).
- Frontend keeps existing mock dataset as a **fallback** whenever backend/API data is unavailable, so demos/testing continue to work.
