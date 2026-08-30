const Reading = require('../models/Reading');

class DatabaseService {
    /**
     * Save a reading to database
     */
    async saveReading(deviceId, pH, temperature, turbidity, dissolvedOxygen, dataHash) {
        try {
            const reading = await Reading.create({
                device_id: deviceId,
                pH: pH,
                temperature: temperature,
                turbidity: turbidity || 0,
                dissolved_oxygen: dissolvedOxygen || 0,
                data_hash: dataHash
            });
            return reading.id;
        } catch (error) {
            console.error('❌ Error saving reading:', error);
            throw error;
        }
    }

    /**
     * Update reading with blockchain transaction info
     */
    async updateBlockchainInfo(recordId, txHash, blockNumber) {
        try {
            await Reading.update(
                {
                    blockchain_tx_hash: txHash,
                    block_number: blockNumber,
                    is_verified: true
                },
                { where: { id: recordId } }
            );
            return true;
        } catch (error) {
            console.error('❌ Error updating blockchain info:', error);
            throw error;
        }
    }

    /**
     * Get latest reading for a device
     */
    async getLatestReading(deviceId) {
        try {
            const reading = await Reading.findOne({
                where: { device_id: deviceId },
                order: [['timestamp', 'DESC']]
            });
            return reading;
        } catch (error) {
            console.error('❌ Error getting latest reading:', error);
            return null;
        }
    }

    /**
     * Get historical readings for a device
     */
    async getHistory(deviceId, limit = 100) {
        try {
            const readings = await Reading.findAll({
                where: { device_id: deviceId },
                order: [['timestamp', 'DESC']],
                limit: limit
            });
            return readings;
        } catch (error) {
            console.error('❌ Error getting history:', error);
            return [];
        }
    }

    /**
     * Get reading by data hash
     */
    async getReadingByHash(dataHash) {
        try {
            const reading = await Reading.findOne({
                where: { data_hash: dataHash }
            });
            return reading;
        } catch (error) {
            console.error('❌ Error getting reading by hash:', error);
            return null;
        }
    }
}

module.exports = new DatabaseService();