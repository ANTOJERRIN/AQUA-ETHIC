const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class BlockchainConfig {
    constructor() {
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.account = process.env.DEPLOYER_ADDRESS;
        this.privateKey = process.env.DEPLOYER_PRIVATE_KEY;
        this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL;

        this.web3 = new Web3(this.rpcUrl);
        this.isMock = false;

        console.log('Blockchain Config loaded');
        console.log('Contract: ' + this.contractAddress);
        console.log('Account: ' + this.account);
        console.log('RPC URL: ' + this.rpcUrl);
    }

    getContract() {
        try {
            const abiPath = path.join(__dirname, '../abis/WaterQuality.json');
            const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
            return new this.web3.eth.Contract(abi, this.contractAddress);
        } catch (error) {
            console.warn('ABI not found, using mock contract');
            return {
                methods: {
                    storeReading: function() {
                        return { encodeABI: function() { return '0x'; } };
                    },
                    verifyReading: function() {
                        return { call: async function() { return { exists: true, verified: true }; } };
                    }
                }
            };
        }
    }
}

module.exports = new BlockchainConfig();