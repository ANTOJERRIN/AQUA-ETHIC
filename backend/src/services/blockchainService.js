// ===== MOCK BLOCKCHAIN SERVICE =====
// REPLACE WITH REAL IMPLEMENTATION WHEN BLOCKCHAIN TEAM PROVIDES

const blockchainConfig = require('../config/blockchain');

class BlockchainService {
    constructor() {
        this.isMock = true;
        console.log('⚠️ Using MOCK BlockchainService');
    }

    /**
     * Store hash on blockchain (MOCK)
     */
    async storeHash(deviceId, dataHash, timestamp) {
        console.log(`📝 [MOCK] Storing on blockchain:`);
        console.log(`   Device: ${deviceId}`);
        console.log(`   Hash: ${dataHash}`);
        console.log(`   Timestamp: ${timestamp}`);

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate mock transaction hash
        const mockTxHash = '0x' + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join('');

        return {
            txHash: mockTxHash,
            blockNumber: Math.floor(Math.random() * 1000000) + 1000000
        };
    }

    /**
     * Verify hash on blockchain (MOCK)
     */
    async verifyHash(dataHash) {
        console.log(`🔍 [MOCK] Verifying: ${dataHash}`);

        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            exists: true,
            verified: true,
            deviceId: 'AQUA-001',
            timestamp: Math.floor(Date.now() / 1000)
        };
    }
}

module.exports = new BlockchainService();