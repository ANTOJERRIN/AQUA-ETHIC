require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// For testing, you can use a mnemonic
const TEST_MNEMONIC = "test test test test test test test test test test test junk";

module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {
            chainId: 31337,
            // Hardhat automatically gives 20 accounts with 10000 ETH each
        },
        ganache: {
            url: "http://127.0.0.1:8545",
            // Option A: Use mnemonic (recommended)
            accounts: {
                mnemonic: process.env.MNEMONIC || TEST_MNEMONIC,
                count: 10,  // Number of accounts to generate
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
            },
            chainId: 31337
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "",
            // Option B: Use private key for deployment only
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111
        }
    }
};