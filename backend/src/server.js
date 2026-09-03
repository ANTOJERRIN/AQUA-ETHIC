require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./config/database');
const sensorRoutes = require('./routes/sensorRoutes');
const seedService = require('./services/seedService');
const telemetrySimulator = require('./services/telemetrySimulator');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ===== ROOT HEALTH ROUTE =====
app.get('/', (req, res) => {
    res.json({
        status: '✅ AQUA-ETHIC Backend Running',
        database: 'SQLite (Zero-setup local persistence)',
        telemetry: 'Live background simulator active (20s cycle)',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// ===== API ROUTES =====
app.use('/api/sensor-data', sensorRoutes);

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// ===== START SERVER =====
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ SQLite database connected successfully');

        // Sync models (create tables if they don't exist)
        await sequelize.sync();
        console.log('✅ Database tables verified');

        // Seed initial telemetry data if empty
        await seedService.seedIfEmpty();

        // Start real-time background telemetry simulator
        telemetrySimulator.start();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API Base URL: http://localhost:${PORT}/api/sensor-data`);
            console.log(`🌊 Live Buoy Telemetry: http://localhost:${PORT}/api/sensor-data/latest/AQUA-001`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
