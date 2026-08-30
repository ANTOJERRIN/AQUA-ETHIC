const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting deployment of WaterQuality contract...");
    
    // Get the contract factory
    const WaterQuality = await hre.ethers.getContractFactory("WaterQuality");
    
    // Deploy the contract
    console.log("📦 Deploying WaterQuality...");
    const waterQuality = await WaterQuality.deploy();
    
    // Wait for deployment
    await waterQuality.waitForDeployment();
    
    // Get the deployed address
    const address = await waterQuality.getAddress();
    console.log(`✅ WaterQuality deployed to: ${address}`);
    
    // Save contract address and ABI to backend
    const backendDir = path.join(__dirname, "../../backend");
    const abiDir = path.join(backendDir, "src/abi");
    
    // Create ABI directory if it doesn't exist
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }
    
    // Save contract address
    const addressFile = path.join(abiDir, "contractAddress.json");
    fs.writeFileSync(
        addressFile,
        JSON.stringify({
            address: address,
            network: hre.network.name,
            deployedAt: new Date().toISOString(),
            chainId: hre.network.config.chainId || 1337
        }, null, 2)
    );
    console.log(`📁 Contract address saved to: ${addressFile}`);
    
    // Save ABI
    const artifact = await hre.artifacts.readArtifact("WaterQuality");
    const abiFile = path.join(abiDir, "WaterQualityABI.json");
    fs.writeFileSync(
        abiFile,
        JSON.stringify(artifact.abi, null, 2)
    );
    console.log(`📁 Contract ABI saved to: ${abiFile}`);
    
    // Save deployment info
    const deploymentInfo = {
        contractName: "WaterQuality",
        address: address,
        network: hre.network.name,
        chainId: hre.network.config.chainId || "unknown",
        deployedAt: new Date().toISOString(),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };
    
    const deployFile = path.join(__dirname, "../deployment-info.json");
    fs.writeFileSync(
        deployFile,
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`📁 Deployment info saved to: ${deployFile}`);
    
    console.log("🎉 Deployment complete!");
    
    // Print summary
    console.log("\n📊 Summary:");
    console.log(`   Contract: ${deploymentInfo.contractName}`);
    console.log(`   Address: ${deploymentInfo.address}`);
    console.log(`   Network: ${deploymentInfo.network}`);
    console.log(`   Chain ID: ${deploymentInfo.chainId}`);
    console.log(`   Block: ${deploymentInfo.blockNumber}`);
    
    return address;
}

// Execute deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });