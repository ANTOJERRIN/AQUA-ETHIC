import { processAndAnchorData, verifyRecord } from "./backend/src/services/blockchainService.js";
import dotenv from "dotenv";

dotenv.config();

// Parse arguments
const args = process.argv.slice(2);

function showHelp() {
    console.log(`
🚀 AQUA-ETHIC Blockchain Terminal Demo

Usage:
  node terminalDemo.js anchor <SensorID> <pH> <Turbidity> [Temperature]
  node terminalDemo.js verify <SensorID> <pH> <Turbidity> [Temperature]
  node terminalDemo.js help

Examples:
  node terminalDemo.js anchor AQ-001 7.2 2.1 27.8
  node terminalDemo.js verify AQ-001 7.2 2.1 27.8
`);
}

async function anchorRecord(sensorId, ph, turbidity, temperature = null) {
    console.log("🚀 Starting Blockchain Anchoring...\n");
    
    // ✅ FIX: Validate numbers
    const phValue = parseFloat(ph);
    const turbidityValue = parseFloat(turbidity);
    const tempValue = temperature ? parseFloat(temperature) : null;
    
    if (isNaN(phValue) || isNaN(turbidityValue)) {
        console.error("❌ Error: pH and Turbidity must be valid numbers.");
        process.exit(1);
    }
    
    // Build sensor data
    const sensorData = {
        id: sensorId,
        sourceType: "IOT",
        data: {
            ph: phValue,
            turbidity: turbidityValue,
            temperature: tempValue,
            timestamp: new Date().toISOString()
        }
    };
    
    console.log("📊 Sensor Data:", JSON.stringify(sensorData, null, 2));
    console.log("");
    
    try {
        // ✅ FIX: Await the async function!
        const result = await processAndAnchorData(sensorData);
        
        console.log("\n📋 Result:");
        console.log(`   ✅ Success: ${result.success}`);
        console.log(`   🔗 Transaction: ${result.transactionHash}`);
        console.log(`   📦 Block: ${result.blockNumber}`);
        console.log(`   🆔 Sensor ID: ${result.sensorId}`);
        console.log(`   🔑 Hash: ${result.dataHash}`);
        console.log(`   📂 Source: ${result.sourceType}`);
        
        return result;
    } catch (error) {
        console.error("\n❌ Failed to anchor record:", error.message);
        throw error;
    }
}

// ✅ FIX: Verify function with proper async/await
async function verifyRecordDemo(sensorId, ph, turbidity, temperature = null) {
    console.log("🔍 Starting Verification...\n");
    
    const phValue = parseFloat(ph);
    const turbidityValue = parseFloat(turbidity);
    const tempValue = temperature ? parseFloat(temperature) : null;
    
    const sensorData = {
        id: sensorId,
        sourceType: "IOT",
        data: {
            ph: phValue,
            turbidity: turbidityValue,
            temperature: tempValue,
            timestamp: new Date().toISOString()
        }
    };
    
    console.log("📊 Current Data:", JSON.stringify(sensorData, null, 2));
    console.log("");
    
    try {
        // ✅ FIX: Await the async function!
        const result = await verifyRecord(sensorId, sensorData);
        
        console.log("\n📋 Verification Result:");
        console.log(`   ✅ Success: ${result.success}`);
        console.log(`   🔍 Valid: ${result.isValid ? "✅ VERIFIED" : "❌ TAMPERED"}`);
        console.log(`   🔑 Anchored Hash: ${result.anchoredHash}`);
        console.log(`   🔑 Current Hash: ${result.currentHash}`);
        console.log(`   📅 Anchored: ${new Date(result.anchoredTimestamp * 1000).toLocaleString()}`);
        console.log(`   📂 Source: ${result.sourceType}`);
        
        return result;
    } catch (error) {
        console.error("\n❌ Verification failed:", error.message);
        throw error;
    }
}

// Main execution
const command = args[0] || "help";

try {
    switch (command.toLowerCase()) {
        case "anchor":
            if (args.length < 4) {
                console.error("❌ Missing arguments! Usage: node terminalDemo.js anchor <SensorID> <pH> <Turbidity> [Temperature]");
                process.exit(1);
            }
            // ✅ FIX: Await the async function!
            await anchorRecord(args[1], args[2], args[3], args[4]);
            break;
            
        case "verify":
            if (args.length < 4) {
                console.error("❌ Missing arguments! Usage: node terminalDemo.js verify <SensorID> <pH> <Turbidity> [Temperature]");
                process.exit(1);
            }
            // ✅ FIX: Await the async function!
            await verifyRecordDemo(args[1], args[2], args[3], args[4]);
            break;
            
        case "help":
        default:
            showHelp();
            break;
    }
} catch (error) {
    console.error("\n💥 Error:", error.message);
    process.exit(1);
}