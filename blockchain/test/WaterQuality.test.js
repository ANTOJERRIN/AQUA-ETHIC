const { expect } = require("chai");

describe("WaterQuality Contract", function () {
    let contract;
    let owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        const WaterQuality = await ethers.getContractFactory("WaterQuality");
        contract = await WaterQuality.deploy();
        await contract.waitForDeployment();
    });

    it("Should store a reading", async function () {
        const deviceId = "AQUA-001";
        const dataHash = "0x8f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2";
        const timestamp = Math.floor(Date.now() / 1000);

        await contract.storeReading(deviceId, dataHash, timestamp);
        
        const total = await contract.getTotalReadings();
        expect(total).to.equal(1);
    });

    it("Should verify a reading", async function () {
        const deviceId = "AQUA-001";
        const dataHash = "0x8f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2";
        const timestamp = Math.floor(Date.now() / 1000);

        await contract.storeReading(deviceId, dataHash, timestamp);
        
        const result = await contract.verifyReading(dataHash);
        expect(result.exists).to.equal(true);
        expect(result.verified).to.equal(true);
        expect(result.deviceId).to.equal(deviceId);
    });

    it("Should reject duplicate hash", async function () {
        const deviceId = "AQUA-001";
        const dataHash = "0x8f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2";
        const timestamp = Math.floor(Date.now() / 1000);

        await contract.storeReading(deviceId, dataHash, timestamp);
        
        await expect(
            contract.storeReading(deviceId, dataHash, timestamp)
        ).to.be.revertedWith("Hash already exists");
    });
});