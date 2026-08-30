import { ethers } from "ethers";
import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Load the clean ABI array you just saved
const contractAbi = JSON.parse(fs.readFileSync(new URL("../config/abi.json", import.meta.url)));

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, wallet);

export async function processAndAnchorData(sensorData) {
    console.log("📡 1. Processing incoming data:", sensorData);
    
    const dataString = JSON.stringify(sensorData);
    const hashHex = "0x" + crypto.createHash("sha256").update(dataString).digest("hex");
    console.log("🔐 2. Generated SHA-256 Hash:", hashHex);

    try {
        console.log("⏳ 3. Anchoring to blockchain...");
        
        // This will now work because the pure JSON ABI tells it exactly what recordData is
        const tx = await contract.recordData(sensorData.id, "TERMINAL_TEST", hashHex);
        const receipt = await tx.wait();
        
        console.log("✅ 4. SUCCESS! Anchored to network.");
        console.log("🔗 Transaction Hash:", receipt.hash);
        return receipt.hash;
    } catch (error) {
        console.error("❌ Blockchain Error:", error.message);
    }
}