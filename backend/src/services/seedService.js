const Reading = require('../models/Reading');
const { generateHash } = require('../utils/hash');
const crypto = require('crypto');

class SeedService {
    async seedIfEmpty() {
        try {
            const count = await Reading.count();
            if (count > 0) {
                console.log(`📊 Database already contains ${count} readings. Skipping seed.`);
                return;
            }

            console.log('🌱 Seeding database with realistic baseline water quality telemetry...');

            const devices = [
                { id: 'AQUA-001', baseTurb: 3.2, basePh: 7.4, baseTemp: 24.5, baseDo: 7.2 },
                { id: 'ganga-kanpur', baseTurb: 24.5, basePh: 7.8, baseTemp: 24.5, baseDo: 6.8 },
                { id: 'arkavathi-bengaluru', baseTurb: 68.4, basePh: 6.1, baseTemp: 27.8, baseDo: 3.4 },
                { id: 'colorado-alpha', baseTurb: 12.1, basePh: 7.4, baseTemp: 18.2, baseDo: 8.1 },
                { id: 'mississippi-delta', baseTurb: 45.2, basePh: 7.6, baseTemp: 22.4, baseDo: 5.2 },
                { id: 'thames-central', baseTurb: 16.8, basePh: 7.5, baseTemp: 16.5, baseDo: 7.4 }
            ];

            const now = Date.now();
            const readingsToInsert = [];
            let blockNum = 108400;

            // Generate 36 data points (over past 36 hours) for each device
            for (const dev of devices) {
                for (let i = 36; i >= 0; i--) {
                    const timestamp = new Date(now - i * 3600 * 1000);
                    // Add subtle sinusoidal variation
                    const wave = Math.sin((36 - i) / 3);
                    const rand = () => (Math.random() - 0.5) * 0.4;

                    const pH = Number(Math.max(4.0, Math.min(10.0, dev.basePh + wave * 0.2 + rand())).toFixed(2));
                    const temperature = Number((dev.baseTemp + wave * 1.2 + rand() * 0.8).toFixed(1));
                    const turbidity = Number(Math.max(0.5, dev.baseTurb + wave * 2.5 + rand() * 3.0).toFixed(1));
                    const dissolvedOxygen = Number(Math.max(1.0, dev.baseDo - wave * 0.3 + rand() * 0.4).toFixed(1));

                    const dataPayload = {
                        deviceId: dev.id,
                        pH,
                        temperature,
                        turbidity,
                        dissolvedOxygen
                    };

                    const dataHash = generateHash(dataPayload);
                    blockNum += 1;
                    const txHash = '0x' + crypto.createHash('sha256').update(`${dev.id}-${dataHash}-${timestamp.getTime()}`).digest('hex');

                    readingsToInsert.push({
                        device_id: dev.id,
                        timestamp,
                        pH,
                        temperature,
                        turbidity,
                        dissolved_oxygen: dissolvedOxygen,
                        data_hash: dataHash,
                        blockchain_tx_hash: txHash,
                        block_number: blockNum,
                        is_verified: true,
                        signature: `SIG_${dataHash.slice(2, 18)}`
                    });
                }
            }

            await Reading.bulkCreate(readingsToInsert);
            console.log(`✅ Seeded ${readingsToInsert.length} historical water quality readings across ${devices.length} stations.`);
        } catch (error) {
            console.error('❌ Error seeding database:', error);
        }
    }
}

module.exports = new SeedService();
