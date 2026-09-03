const databaseService = require('./databaseService');
const blockchainService = require('./blockchainService');
const { generateHash } = require('../utils/hash');

class TelemetrySimulator {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.intervalMs = 20000; // Emit reading every 20 seconds
        this.currentPh = 7.35;
        this.currentTemp = 24.8;
        this.currentTurb = 3.4;
        this.currentDo = 7.1;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        console.log('📡 Background Live Telemetry Simulator started (Interval: 20s)');

        this.timer = setInterval(async () => {
            try {
                await this.generateAndSaveReading('AQUA-001');
            } catch (err) {
                console.error('Simulator error:', err.message);
            }
        }, this.intervalMs);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isRunning = false;
        console.log('📡 Background Live Telemetry Simulator stopped');
    }

    async generateAndSaveReading(deviceId = 'AQUA-001') {
        // Random walk for smooth real-time telemetry fluctuations
        const jitter = (range) => (Math.random() - 0.5) * range;

        this.currentPh = Number(Math.max(6.5, Math.min(8.5, this.currentPh + jitter(0.08))).toFixed(2));
        this.currentTemp = Number(Math.max(18.0, Math.min(32.0, this.currentTemp + jitter(0.2))).toFixed(1));
        this.currentTurb = Number(Math.max(1.0, Math.min(15.0, this.currentTurb + jitter(0.3))).toFixed(1));
        this.currentDo = Number(Math.max(5.0, Math.min(9.0, this.currentDo + jitter(0.15))).toFixed(1));

        const data = {
            deviceId,
            pH: this.currentPh,
            temperature: this.currentTemp,
            turbidity: this.currentTurb,
            dissolvedOxygen: this.currentDo
        };

        const dataHash = generateHash(data);
        const recordId = await databaseService.saveReading(
            deviceId,
            this.currentPh,
            this.currentTemp,
            this.currentTurb,
            this.currentDo,
            dataHash
        );

        const timestamp = Math.floor(Date.now() / 1000);
        const tx = await blockchainService.storeHash(deviceId, dataHash, timestamp);

        if (tx && recordId) {
            await databaseService.updateBlockchainInfo(
                recordId,
                tx.txHash,
                tx.blockNumber
            );
        }

        return { recordId, dataHash, tx };
    }
}

module.exports = new TelemetrySimulator();
