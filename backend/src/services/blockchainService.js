import { ethers } from "ethers";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: new URL('../../.env', import.meta.url) });

// FIX: Read ABI with utf8 encoding
const abiPath = path.join(__dirname, "../abi/WaterQualityABI.json");
let contractAbi;

try {
    if (fs.existsSync(abiPath)) {
        // ✅ FIX: Added 'utf8' encoding
        contractAbi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
        console.log("✅ ABI loaded successfully");
    } else {
        console.warn("⚠️ ABI file not found at:", abiPath);
        throw new Error("ABI file not found");
    }
} catch (error) {
    console.error("❌ Error loading ABI:", error.message);
    throw error;
}

// ✅ FIX: Helper function with validation
function getContract() {
    // Validate environment variables
    if (!process.env.PRIVATE_KEY) {
        throw new Error("❌ PRIVATE_KEY not found in .env file");
    }
    if (!process.env.CONTRACT_ADDRESS) {
        throw new Error("❌ CONTRACT_ADDRESS not found in .env file");
    }
    
    const provider = new ethers.JsonRpcProvider(
        process.env.RPC_URL || "http://127.0.0.1:8545"
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log(`🔗 Connected to contract at: ${process.env.CONTRACT_ADDRESS}`);
    console.log(`👤 Signer address: ${wallet.address}`);
    
    return new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractAbi,
        wallet
    );
}

// ✅ FIX: Deterministic hash generation
function generateRecordHash(sensorData) {
    // Create deterministic JSON with recursively sorted keys
    const dataToHash = {
        id: sensorData.id,
        sourceType: sensorData.sourceType || "IOT",
        data: sensorData.data || sensorData
    };

    const sortKeysRecursively = (value) => {
        if (Array.isArray(value)) {
            return value.map(sortKeysRecursively);
        }
        if (value && typeof value === "object") {
            return Object.keys(value)
                .sort()
                .reduce((sorted, key) => {
                    sorted[key] = sortKeysRecursively(value[key]);
                    return sorted;
                }, {});
        }
        return value;
    };
    
    const canonicalData = JSON.stringify(sortKeysRecursively(dataToHash));
    const hash = crypto.createHash("sha256").update(canonicalData).digest("hex");
    return "0x" + hash;
}

// ✅ FIX: Main anchoring function with proper error handling
export async function processAndAnchorData(sensorData) {
    console.log("📡 1. Processing incoming data:", sensorData);
    
    // Validate input
    if (!sensorData.id) {
        throw new Error("❌ sensorData.id is required");
    }
    
    // Validate numbers
    if (sensorData.data) {
        if (sensorData.data.ph && isNaN(sensorData.data.ph)) {
            throw new Error("❌ pH must be a valid number");
        }
        if (sensorData.data.turbidity && isNaN(sensorData.data.turbidity)) {
            throw new Error("❌ Turbidity must be a valid number");
        }
    }
    
    const sourceType = sensorData.sourceType || "IOT";
    const dataHash = generateRecordHash(sensorData);
    console.log("🔐 2. Generated SHA-256 Hash:", dataHash);
    
    try {
        console.log("⏳ 3. Anchoring to blockchain...");
        const contract = getContract();
        
        // Call the contract
        const tx = await contract.recordData(
            sensorData.id,
            sourceType,
            dataHash
        );
        
        console.log(`⏳ Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        
        console.log("✅ 4. SUCCESS! Anchored to blockchain.");
        console.log(`🔗 Transaction Hash: ${receipt.hash}`);
        console.log(`📦 Block Number: ${receipt.blockNumber}`);
        
        return {
            success: true,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            sensorId: sensorData.id,
            dataHash: dataHash,
            sourceType: sourceType
        };
    } catch (error) {
        console.error("❌ Blockchain Error:", error.message);
        throw new Error(`Blockchain anchoring failed: ${error.message}`);
    }
}

// ✅ FIX: Verification function
export async function verifyRecord(sensorId, currentData) {
    console.log(`🔍 Verifying record: ${sensorId}`);
    
    try {
        const contract = getContract();
        const currentHash = generateRecordHash({
            id: sensorId,
            sourceType: currentData.sourceType || "IOT",
            data: currentData.data || currentData
        });
        
        const isValid = await contract.verifyRecord(sensorId, currentHash);
        const record = await contract.getRecord(sensorId);
        
        return {
            success: true,
            sensorId: sensorId,
            isValid: isValid,
            anchoredHash: record.dataHash,
            currentHash: currentHash,
            anchoredTimestamp: Number(record.timestamp),
            sourceType: record.sourceType
        };
    } catch (error) {
        console.error("❌ Verification Error:", error.message);
        throw new Error(`Verification failed: ${error.message}`);
    }
}

export default {
    processAndAnchorData,
    verifyRecord
};