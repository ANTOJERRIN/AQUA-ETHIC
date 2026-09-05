# 🌊 AQUA-ETHIC

**AQUA-ETHIC** is a water-quality monitoring and data-integrity platform that connects IoT telemetry, a backend API, local persistence, and blockchain-based verification into one pipeline.

The project is being developed as an IoT MVP for the **DECODE SIH Hackathon** by **Neeraj, Thulasi, Sudeeksha, and Jerrin Anto**.

## 🎯 What the project does

AQUA-ETHIC is designed to collect water-quality readings from sensor/buoy devices, process and store those readings through a backend service, generate a cryptographic hash for each reading, and anchor that hash to a blockchain registry. This creates a verifiable integrity trail for sensor data.

The current backend supports these water-quality parameters:

- **pH**
- **Temperature**
- **Turbidity**
- **Dissolved Oxygen**

The system can expose the latest reading, historical readings, and verification information through HTTP APIs.

## 🧩 System Architecture

```text
                ┌─────────────────────┐
                │  Water Quality IoT  │
                │ ESP32 / Buoy Device │
                └──────────┬──────────┘
                           │
                           │ POST telemetry
                           ▼
                ┌─────────────────────┐
                │ Express.js Backend  │
                │  REST API Layer     │
                └──────────┬──────────┘
                           │
              ┌────────────┼─────────────┐
              │            │             │
              ▼            ▼             ▼
        ┌──────────┐ ┌────────────┐ ┌─────────────┐
        │ Validate │ │ SHA-256    │ │ Blockchain  │
        │ Reading  │ │ Data Hash  │ │ Registry    │
        └────┬─────┘ └─────┬──────┘ └──────┬──────┘
             │              │               │
             └──────────────┴───────┬───────┘
                                    ▼
                           ┌────────────────┐
                           │ SQLite + ORM   │
                           │ Historical Data │
                           └───────┬────────┘
                                   │
                                   ▼
                           ┌────────────────┐
                           │ Flutter Client │
                           │ / Web UI       │
                           └────────────────┘
```

### Data flow

```text
ESP32 / Buoy
    ↓
POST /api/sensor-data/data
    ↓
Validation
    ↓
SHA-256 hash generation
    ↓
SQLite persistence
    ↓
Blockchain hash anchoring
    ↓
Transaction / block metadata saved
    ↓
Frontend requests latest/history data
    ↓
Optional hash verification
```

The backend also contains a **20-second telemetry simulator** for development/demo purposes. It generates realistic fluctuations for device `AQUA-001`, stores each generated reading, hashes it, and sends it through the same blockchain service path.

## ✨ Key Features

### IoT water-quality ingestion
The backend exposes an endpoint for receiving sensor readings from an ESP32 buoy/device.

### Data validation
Incoming readings are validated before persistence. The current API requires `deviceId`, `pH`, and `temperature`, and enforces a pH range of **0–14**.

### Cryptographic integrity
Each telemetry payload is converted to JSON and hashed using **SHA-256** with a `0x` prefix. The resulting hash becomes the integrity identifier for that reading.

### Local persistence
Readings are stored using **SQLite + Sequelize**, including timestamp, sensor values, data hash, blockchain transaction hash, block number, verification status, and signature fields.

### Blockchain anchoring
The blockchain layer is implemented around the `WaterQuality` Solidity contract. A reading stores the device ID, data hash, timestamp, verification status, and validator address. Duplicate hashes are rejected by the contract.

### Hybrid blockchain mode
The backend can attempt a real Web3 transaction when contract/RPC/account configuration is available. When it cannot perform a real transaction, it falls back to a high-fidelity local simulation so the application remains usable during demos and local development.

### Verification API
A data hash can be checked against both the database and the blockchain service, allowing the application to determine whether a corresponding reading exists and is marked verified.

### Historical telemetry
The API supports latest-reading and historical-reading queries for individual devices.

## 📁 Repository Structure

```text
AQUA-ETHIC/
├── aqua_ethic_probe/          # IoT / probe-side project area
├── backend/
│   ├── data/                  # SQLite/local data directory
│   ├── migrations/            # Database migration area
│   ├── src/
│   │   ├── abi/               # ABI-related resources
│   │   ├── abis/              # Smart-contract ABI files
│   │   ├── config/            # Database and blockchain configuration
│   │   ├── controllers/       # API request handling
│   │   ├── models/            # Sequelize models
│   │   ├── routes/             # Express routes
│   │   ├── services/          # Database, blockchain, seed and telemetry services
│   │   ├── utils/              # Hashing utilities and helpers
│   │   └── server.js           # Backend entry point
│   ├── remote_sensing_water_quality_screening.ipynb
│   ├── package.json
│   └── .env.example
├── blockchain/
│   ├── contracts/
│   │   └── WaterQuality.sol   # Water-quality registry smart contract
│   ├── scripts/                # Deployment scripts
│   ├── test/                   # Contract tests
│   ├── artifacts/              # Hardhat build artifacts
│   ├── contract-address.json
│   ├── hardhat.config.js
│   └── package.json
├── frontend/
│   ├── lib/
│   │   └── main.dart          # Flutter application entry point
│   ├── android/
│   ├── ios/
│   ├── linux/
│   ├── macos/
│   ├── windows/
│   ├── web/
│   └── package configuration files
├── resources/                  # Project resources
├── terminalDemo.js             # CLI demo for anchoring/verifying records
└── README.md
```

## 🔌 Backend API

Base URL by default:

```text
http://localhost:5000
```

### Health check

```http
GET /
```

Returns backend status, database information, telemetry simulator status, version, and a timestamp.

### Receive sensor data

```http
POST /api/sensor-data/data
Content-Type: application/json
```

Example payload:

```json
{
  "deviceId": "AQUA-001",
  "pH": 7.35,
  "temperature": 24.8,
  "turbidity": 3.4,
  "dissolvedOxygen": 7.1
}
```

The API responds with the created database record ID, generated data hash, and blockchain transaction/block metadata when available.

### Latest reading

```http
GET /api/sensor-data/latest/:deviceId
```

Example:

```text
GET /api/sensor-data/latest/AQUA-001
```

### Reading history

```http
GET /api/sensor-data/history/:deviceId?limit=100
```

Returns historical readings for a device in reverse chronological order.

### Verify a reading

```http
GET /api/sensor-data/verify/:dataHash
```

This endpoint checks the reading in the local database and asks the blockchain service to verify the same hash. The verification endpoint is rate-limited to **30 requests per minute**.

## ⛓️ Blockchain Layer

The smart contract is located at:

```text
blockchain/contracts/WaterQuality.sol
```

The contract maintains a registry of readings containing:

```text
deviceId
 dataHash
timestamp
verified
validator
```

It provides functions to:

- Store a new reading hash
- Reject duplicate hashes
- Verify a reading by hash
- Get the total number of readings
- Retrieve a reading by index

The Hardhat project includes compile, test, local-node, Ganache deployment, and Sepolia deployment scripts.

## 🧪 Demo / Development Telemetry

On backend startup, the application can seed an empty SQLite database with baseline historical telemetry for multiple example stations. It then starts a background simulator that produces a new `AQUA-001` reading every **20 seconds**.

This is useful for local demonstrations because the frontend/API can show changing water-quality data even when physical hardware is not connected.

## 🖥️ Frontend

The frontend is a **Flutter** application targeting multiple platforms. The repository currently contains the generated Flutter starter implementation in `frontend/lib/main.dart`; the production AQUA-ETHIC dashboard integration is expected to consume the backend API rather than communicate directly with the buoy.

The intended application flow is:

```text
Flutter UI
   ↓
API Service
   ↓
HTTP Request
   ↓
Express Route
   ↓
Controller
   ↓
Database / Blockchain Services
   ↓
JSON Response
   ↓
Flutter UI
```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| IoT | ESP32 / water-quality buoy concept |
| Frontend | Flutter / Dart |
| Backend | Node.js, Express.js |
| Database | SQLite |
| ORM | Sequelize |
| Blockchain integration | Web3.js |
| Smart contracts | Solidity `^0.8.19` |
| Blockchain tooling | Hardhat, Ethers |
| Security middleware | Helmet, CORS, Express Rate Limit |
| Logging | Morgan |
| Configuration | dotenv |
| Hashing | Node.js `crypto` / SHA-256 |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ANTOJERRIN/AQUA-ETHIC.git
cd AQUA-ETHIC
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Then start the API:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The default backend runs on:

```text
http://localhost:5000
```

### 3. Run the blockchain project

```bash
cd blockchain
npm install
```

Compile contracts:

```bash
npm run compile
```

Run contract tests:

```bash
npm test
```

Start a local Hardhat node:

```bash
npm run node
```

Deployment scripts are available for Ganache and Sepolia through the package scripts.

### 4. Run the Flutter frontend

```bash
cd frontend
flutter pub get
flutter run
```

> **Current repository state:** the checked-in Flutter `main.dart` is still the default starter counter app, so the API-driven AQUA-ETHIC dashboard integration is not yet represented in that file.

## 🧰 CLI Blockchain Demo

The repository also contains `terminalDemo.js` for demonstrating anchoring and verification from the terminal.

Example usage shown by the project:

```bash
node terminalDemo.js anchor AQ-001 7.2 2.1 27.8
node terminalDemo.js verify AQ-001 7.2 2.1 27.8
```

The demo is intended to show the lifecycle of a sensor record from construction through blockchain anchoring and verification.

## 🔐 Environment Configuration

The backend uses environment variables for server and blockchain configuration. Never commit real private keys or secrets.

Important configuration includes:

```env
PORT=5000
NODE_ENV=development

CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BLOCKCHAIN_RPC_URL=http://localhost:8545
DEPLOYER_ADDRESS=0x0000000000000000000000000000000000000000
```

The backend's current database implementation uses SQLite by default and stores the database under the backend data directory, even though the example environment file still contains legacy relational-database placeholders. Configure deployment-specific values carefully before production use.

## 🔎 Project Status

### Implemented

- Express REST backend
- Sensor-data ingestion API
- pH/required-field validation
- SHA-256 data hashing
- SQLite persistence with Sequelize
- Latest and historical reading endpoints
- Hash verification endpoint
- Background telemetry simulator
- Seed data for demonstration
- Solidity water-quality registry
- Hardhat blockchain project
- Web3 integration with real-RPC attempt + fallback simulation
- CLI anchoring/verification demonstration

### In progress / integration work

- Complete Flutter dashboard implementation
- Connect the Flutter client to the backend API
- Replace/augment simulator data with live buoy telemetry from ESP32 hardware
- Production blockchain configuration and deployment
- Production hardening, observability, and deployment configuration

## 🌍 Vision

AQUA-ETHIC aims to make water-quality data more **transparent, traceable, and trustworthy** by connecting physical sensing with software verification and tamper-evident data anchoring.

The long-term goal is a pipeline where a water-quality observation can be traced from the physical sensor, through the application backend, to a verifiable blockchain record.

## 👥 Team

**AQUA-ETHIC — DECODE SIH Hackathon**

- Neeraj
- Thulasi
- Sudeeksha
- Jerrin Anto

## 📄 License

No repository-wide license is currently documented in the root README. Add an explicit license file before distributing the project publicly under defined licensing terms.
