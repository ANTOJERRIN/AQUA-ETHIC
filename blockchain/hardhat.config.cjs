require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../backend/.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    
    networks: {
        // Local Hardhat network
        hardhat: {
            chainId: 1337,
            loggingEnabled: false
        },
        
        // Local development network
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 1337
        },
        
        // Sepolia testnet
        sepolia: {
            url: process.env.RPC_URL || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111
        }
    },
    
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    
    mocha: {
        timeout: 40000
    }
};