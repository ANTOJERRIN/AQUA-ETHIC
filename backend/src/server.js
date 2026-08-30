require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./config/database');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ===== TEST ROUTE =====
app.get('/', (req, res) => {
    res.json({
        status: '✅ AQUA-ETHIC Backend Running',
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
        console.log('✅ Database connected successfully');

        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synced');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API Base URL: http://localhost:${PORT}/api/sensor-data`);
            console.log(`⛓️ Blockchain service: MOCK mode`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();