// ===== MOCK BLOCKCHAIN CONFIG =====
// REPLACE WITH REAL IMPLEMENTATION WHEN BLOCKCHAIN TEAM PROVIDES

require('dotenv').config();

class BlockchainConfig {
    constructor() {
        this.isMock = true; // Set to false when real blockchain is ready
        console.log('⚠️ Using MOCK blockchain service');
        console.log('✅ Blockchain config loaded (mock mode)');
    }

    // Mock function to simulate contract interaction
    getContract() {
        return {
            methods: {
                storeReading: (deviceId, dataHash, timestamp) => ({
                    encodeABI: () => '0x',
                    estimateGas: async () => 500000
                }),
                verifyReading: (dataHash) => ({
                    call: async () => ({
                        exists: true,
                        verified: true,
                        deviceId: 'AQUA-001',
                        timestamp: Math.floor(Date.now() / 1000)
                    })
                })
            }
        };
    }
}

module.exports = new BlockchainConfig();