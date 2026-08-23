# Hardware — Architecture & Prompts

Solar-powered floating buoy, ESP32 + 2G uplink

---

## Architecture

### Parts and roles

| Component | Role |
|---|---|
| ESP32 | Main controller — reads sensors, builds payload, signs it, sends over cellular |
| 2G/GPRS cellular module | Uplink where WiFi/4G isn't reliable on open water |
| Analog pH sensor | Water pH |
| Turbidity sensor | Suspended sediment — this is your ground-truth cross-check against the satellite NDTI value for the same location |
| DS18B20 (waterproof) + 4.7kΩ resistor | Water temperature; resistor is the required pull-up for the 1-Wire bus |
| Solar panel (6V) | Charges the system during daylight |
| TP4056 charge controller | Manages safe charging of the 18650 cell from the solar panel |
| 18650 Li-ion cell + holder | Energy storage for continuous overnight operation |
| Boost converter | Steps the cell's ~3.7V up to a stable 5V for ESP32 and sensors |
| Waterproof container (3D-modelled) | Keeps all electronics dry |
| Swimming tube + mini rope | Buoyancy and anchoring so the unit floats in place |
| Breadboard, jumper wires (M-M, M-F, F-F) | Prototyping before final soldered build |

### Power loop

```
Solar panel (6V) ──► TP4056 ──► 18650 Li-ion cell ──► Boost converter (5V) ──► ESP32 + sensors
                                       ▲
                          (charges during day, discharges at night —
                           this is what makes the buoy self-sustaining)
```

### Signal path

```
Sensors (pH, turbidity, DS18B20) ──► ESP32 (reads + timestamps)
                                          │
                                          ▼
                              Build JSON payload
                                          │
                                          ▼
                          HMAC-sign with per-device secret
                                          │
                                          ▼
                        2G module ──► POST /ingest (backend)
```

### Why sign on-device

2G can't reliably carry TLS, so the security has to live in the payload itself. Each device gets a unique secret key baked in at provisioning time; it computes an HMAC over the reading before sending. The backend recomputes the same HMAC using the device's stored key and rejects anything that doesn't match — so even over an insecure network, spoofed or altered readings get rejected before they ever reach your database or ledger.

### Reliability notes for the field

- 2G links drop. Buffer unsent readings locally (a small ring buffer in flash) and retry on the next successful connection rather than discarding failed sends.
- Deep-sleep the ESP32 between reads to conserve battery — you don't need continuous readings, a periodic interval (e.g. every 10–15 min) is plenty for a water body's rate of change and saves significant power.

---

## Firmware prompt

Paste into Claude Code or your AI coding tool (Arduino/ESP-IDF):

```
Write ESP32 (Arduino framework) firmware for a solar-powered water quality buoy.

Sensors:
- Analog pH sensor on an ADC pin, with a calibration function
  (two-point calibration using known buffer solutions, converting raw ADC to pH)
- Analog turbidity sensor on an ADC pin, converting voltage to NTU using a
  standard turbidity sensor calibration curve
- DS18B20 waterproof temperature sensor on a 1-Wire bus (OneWire + DallasTemperature
  libraries), with the 4.7k pull-up resistor already wired

Main loop (every 10 minutes, using deep sleep between cycles):
1. Wake, read all three sensors, average 5 samples per sensor to reduce noise
2. Build a JSON payload: {device_id, lat, lng, ph, turbidity, temp, timestamp}
   (lat/lng can be a fixed provisioned location if no GPS module is present)
3. Compute HMAC-SHA256 over the JSON string using a device secret key stored
   in flash (use mbedtls's HMAC functions, available on ESP32), add it as
   a "signature" field
4. Send the payload via the 2G/GPRS module (SIM800L-style AT commands) as an
   HTTP POST to a configurable ingestion URL
5. On send failure, store the reading in a small ring buffer (up to 10 readings)
   in flash and retry on the next wake cycle before sending the new one
6. Go back to deep sleep

Include a provisioning mode (triggered by a boot-time button hold) that lets
the device secret key and ingestion URL be set over serial, so each buoy can
be configured without reflashing firmware.
```

### 3D enclosure prompt (if using an AI CAD/description tool)

```
Design a waterproof buoy enclosure for an ESP32-based water quality sensor
node. Requirements: a sealed upper compartment for the ESP32, 2G module, and
18650 battery (IP65-equivalent seal, cable glands for sensor wires exiting
the bottom and the solar panel wire exiting the top), a flat mounting surface
on top for a 6V solar panel, and an attachment point on the side for tethering
to a swimming-tube float via rope. Bottom of the enclosure should have a
weighted keel or ballast point to keep the unit upright in water. Sensor
probes (pH, turbidity, DS18B20) mount through sealed bulkhead fittings on
the underside, fully submerged when floating.
```
