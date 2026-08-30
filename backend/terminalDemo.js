import { processAndAnchorData } from "./src/services/blockchainService.js";

// Grab input arguments typed in the terminal
const args = process.argv.slice(2);

if (args.length < 3) {
    console.log("❌ Missing arguments!");
    console.log("👉 Usage: node terminalDemo.js <SensorID> <pH> <Turbidity>");
    process.exit(1);
}

// Build the data object
const mockData = {
    id: args[0],
    ph: parseFloat(args[1]),
    turbidity: parseFloat(args[2]),
    timestamp: new Date().toISOString()
};

console.log("🚀 Starting Blockchain Data Injection...");
processAndAnchorData(mockData);