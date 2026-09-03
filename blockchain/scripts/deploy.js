async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🚀 Deploying with account:", deployer.address);
    console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const WaterQuality = await ethers.getContractFactory("WaterQuality");
    const contract = await WaterQuality.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("✅ WaterQuality deployed to:", address);
    console.log("📦 Contract ABI saved in artifacts");

    // Save contract address for backend
    const fs = require('fs');
    const config = {
        contractAddress: address,
        deployerAddress: deployer.address,
        network: 'ganache',
        deployedAt: new Date().toISOString()
    };
    fs.writeFileSync('./contract-address.json', JSON.stringify(config, null, 2));
    console.log("💾 Contract address saved to contract-address.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });