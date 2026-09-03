const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class BlockchainConfig {
    constructor() {
        this.contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
        this.account = process.env.DEPLOYER_ADDRESS || '0x0000000000000000000000000000000000000000';
        this.privateKey = process.env.DEPLOYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';
        this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
        this.isMock = false;

        try {
            this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcUrl, { timeout: 1500 }));
        } catch (err) {
            this.isMock = true;
        }

        console.log('⛓️ Blockchain Config loaded');
        console.log('Contract: ' + this.contractAddress);
        console.log('RPC URL: ' + this.rpcUrl);
    }

    getContract() {
        try {
            const abiPath = path.join(__dirname, '../abis/WaterQuality.json');
            if (fs.existsSync(abiPath)) {
                const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
                return new this.web3.eth.Contract(abi, this.contractAddress);
            }
        } catch (error) {
            // Fallback handled gracefully
        }
        return null;
    }
}

module.exports = new BlockchainConfig();