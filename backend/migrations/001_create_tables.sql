-- ===== DATABASE SCHEMA FOR AQUA-ETHIC (MySQL) =====

-- 1. Devices Table
CREATE TABLE IF NOT EXISTS devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'active',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Readings Table
CREATE TABLE IF NOT EXISTS readings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pH FLOAT,
    temperature FLOAT,
    turbidity FLOAT,
    dissolved_oxygen FLOAT,
    data_hash VARCHAR(66) NOT NULL,
    blockchain_tx_hash VARCHAR(66),
    block_number INT,
    is_verified BOOLEAN DEFAULT false,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(50),
    alert_type VARCHAR(50),
    severity VARCHAR(20),
    message TEXT,
    value FLOAT,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====
CREATE INDEX idx_readings_device_timestamp ON readings(device_id, timestamp DESC);
CREATE INDEX idx_readings_data_hash ON readings(data_hash);
CREATE INDEX idx_alerts_device ON alerts(device_id);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);