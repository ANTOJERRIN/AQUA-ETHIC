# 🌊 RIVER

**AQUA-ETHIC** is a water-quality monitoring and data-integrity platform that connects IoT telemetry, a backend API, local persistence, and blockchain-based verification into one pipeline.

The project is being developed as an IoT MVP for the **DECODE SIH Hackathon** by **Neeraj, Thulasi, Sudeeksha, and Jerrin Anto**.

## 🎯 What the project does

AQUA-ETHIC is designed to collect water-quality readings from sensor/buoy devices, process and store those readings through a backend service, generate a cryptographic hash for each reading, and anchor that hash to a blockchain registry. This creates a verifiable integrity trail for sensor data.

The current backend supports:

- **pH**
- **Temperature**
- **Turbidity**
- **Dissolved Oxygen**

The system exposes APIs for latest readings, historical readings, and hash verification.

## 🧩 System Architecture

```text
ESP32 / Water-Quality Buoy
          │
          │ POST telemetry
          ▼
   Express.js REST API
          │
    ┌─────┼──────────────┐
    ▼     ▼              ▼
Validation SHA-256     Blockchain
    │     Hash           │
    └─────┬──────────────┘
          ▼
   SQLite + Sequelize
          │
          ▼
     Flutter Client
```

### Data flow

```text
ESP32 / Buoy
    ↓
POST /api/sensor-data/data
    ↓
Validate reading
    ↓
Generate SHA-256 hash
    ↓
Store reading in SQLite
    ↓
Anchor hash through blockchain service
    ↓
Save transaction/block metadata
    ↓
Flutter requests latest/history data
    ↓
Optional hash verification
```

The backend also includes a **20-second telemetry simulator** for development and demos. It generates changing readings for `AQUA-001` and sends them through the same persistence and blockchain flow.

## ✨ Key Features

### IoT telemetry ingestion
The backend accepts water-quality readings from an ESP32 buoy/device through a REST endpoint.

### Data validation
Incoming readings are validated before persistence. `deviceId`, `pH`, and `temperature` are required, and pH must be between **0 and 14**.

### Cryptographic integrity
Each telemetry payload is serialized and hashed using **SHA-256**. The resulting `dataHash` is used as the integrity identifier for the reading.

### Local persistence
Readings are stored using **SQLite + Sequelize**, including sensor values, timestamps, data hashes, blockchain transaction metadata, and verification status.

### Blockchain anchoring
The Solidity `WaterQuality` contract stores the device ID, data hash, timestamp, verification status, and validator address. Duplicate hashes are rejected.

### Hybrid blockchain mode
When valid RPC, contract, account, and private-key configuration is available, the backend attempts a real Web3 transaction. If that cannot be completed, it falls back to a local simulated blockchain registry so the application remains usable during development and demos.

### Verification
A reading can be verified by its hash against both the database and blockchain service.

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
│   │   ├── routes/            # Express routes
│   │   ├── services/          # Database, blockchain, seed and telemetry services
│   │   ├── utils/             # Hashing utilities
│   │   └── server.js          # Backend entry point
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
│   └── web/
├── resources/                 # Project resources
├── terminalDemo.js             # CLI anchoring/verification demo
└── README.md
```

## 🔌 Backend API

Default base URL:

```text
http://localhost:5000
```

### Health check

```http
GET /
```

Returns backend status, database information, telemetry simulator status, version, and timestamp.

### Receive sensor data

```http
POST /api/sensor-data/data
Content-Type: application/json
```

Example:

```json
{
  "deviceId": "AQUA-001",
  "pH": 7.35,
  "temperature": 24.8,
  "turbidity": 3.4,
  "dissolvedOxygen": 7.1
}
```

The response contains the database record ID, generated data hash, and blockchain transaction/block metadata when available.

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

Checks the hash against the local database and blockchain service. This endpoint is rate-limited to **30 requests per minute**.

## ⛓️ Blockchain Layer

The smart contract is located at:

```text
blockchain/contracts/WaterQuality.sol
```

Each blockchain record contains:

```text
deviceId
dataHash
timestamp
verified
validator
```

The contract supports:

- Storing a reading hash
- Rejecting duplicate hashes
- Verifying a reading by hash
- Getting the total number of readings
- Retrieving a reading by index

The Hardhat project includes compile, test, local-node, Ganache deployment, and Sepolia deployment scripts.

## 🧪 Development Telemetry

When the SQLite database is empty, the backend seeds baseline historical telemetry for multiple example stations. It then starts a background simulator that creates a new `AQUA-001` reading every **20 seconds**.

This allows the complete API/demo flow to work without physical buoy hardware being connected.

## 🖥️ Frontend

The frontend is a **Flutter** application targeting multiple platforms. The intended production architecture is for Flutter to communicate with the backend API rather than directly with the buoy.

The intended flow is:

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

> **Current repository state:** `frontend/lib/main.dart` is still the default Flutter starter counter implementation. The API-driven AQUA-ETHIC dashboard integration is therefore still an integration step, not something this README claims is already implemented.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| IoT | ESP32 / water-quality buoy |
| Frontend | Flutter / Dart |
| Backend | Node.js, Express.js |
| Database | SQLite |
| ORM | Sequelize |
| Blockchain integration | Web3.js |
| Smart contracts | Solidity `^0.8.19` |
| Blockchain tooling | Hardhat, Ethers |
| Security | Helmet, CORS, Express Rate Limit |
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
cp .env.example .env
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The default API runs on:

```text
http://localhost:5000
```

### 3. Run the blockchain project

```bash
cd blockchain
npm install
npm run compile
npm test
```

To start a local Hardhat node:

```bash
npm run node
```

Deployment scripts are provided for Ganache and Sepolia.

### 4. Run the Flutter frontend

```bash
cd frontend
flutter pub get
flutter run
```

## 🧰 CLI Demo

`terminalDemo.js` provides a command-line demonstration for anchoring and verifying sensor records.

Example usage:

```bash
node terminalDemo.js anchor AQ-001 7.2 2.1 27.8
node terminalDemo.js verify AQ-001 7.2 2.1 27.8
```

## 🔐 Environment Configuration

The backend uses environment variables for server and blockchain configuration. **Never commit real private keys or secrets.**

Important blockchain configuration includes:

```env
PORT=5000
NODE_ENV=development

CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
BLOCKCHAIN_RPC_URL=http://localhost:8545
DEPLOYER_ADDRESS=0x0000000000000000000000000000000000000000
```

The current database implementation uses SQLite by default. The checked-in `.env.example` still contains some legacy relational-database placeholders, so deployment-specific configuration should be reviewed before production use.

## 📊 Project Status

### Implemented

- Express REST backend
- Sensor-data ingestion API
- Required-field and pH validation
- SHA-256 data hashing
- SQLite persistence with Sequelize
- Latest and historical reading endpoints
- Hash verification endpoint
- Background telemetry simulator
- Seed data for demos
- Solidity water-quality registry
- Hardhat blockchain project
- Web3 integration with simulated fallback
- CLI anchoring/verification demo

### In progress

- Complete Flutter water-quality dashboard
- Connect Flutter API service to backend
- Connect live ESP32 buoy telemetry to production flow
- Production blockchain deployment/configuration
- Production hardening and deployment

## 🌍 Vision

AQUA-ETHIC aims to make water-quality data more **transparent, traceable, and trustworthy** by connecting physical sensing with software verification and tamper-evident blockchain anchoring.

The long-term goal is a pipeline where a water-quality observation can be traced from the physical sensor, through the application backend, to a verifiable blockchain record.

## 👥 Team

**AQUA-ETHIC — DECODE SIH Hackathon**

- Neeraj
- Thulasi
- Sudeeksha
- Jerrin Anto

## 📄 License

No repository-wide license is currently documented. Add an explicit `LICENSE` file before distributing the project under defined licensing terms.
