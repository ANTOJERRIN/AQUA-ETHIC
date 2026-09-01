const { generateHash } = require("../utils/hash");
const databaseService = require("../services/databaseService");
const blockchainService = require("../services/blockchainService");

class SensorController {
  /**
   * POST /api/sensor-data
   * Receive data from ESP32 buoy
   */
  async receiveData(req, res) {
    try {
      const { deviceId, pH, temperature, turbidity, dissolvedOxygen } =
        req.body;

      // Validate required fields
      if (!deviceId) {
        return res.status(400).json({ error: "deviceId is required" });
      }
      if (pH === undefined || pH === null) {
        return res.status(400).json({ error: "pH is required" });
      }
      if (temperature === undefined || temperature === null) {
        return res.status(400).json({ error: "temperature is required" });
      }

      // Validate pH range
      if (pH < 0 || pH > 14) {
        return res.status(400).json({ error: "pH must be between 0 and 14" });
      }

      // Prepare data for hashing
      const data = { deviceId, pH, temperature, turbidity, dissolvedOxygen };

      // Generate SHA-256 hash
      const dataHash = generateHash(data);
      console.log(`🔑 Generated hash: ${dataHash}`);

      // Save to database
      const recordId = await databaseService.saveReading(
        deviceId,
        pH,
        temperature,
        turbidity,
        dissolvedOxygen,
        dataHash,
      );
      console.log(`💾 Saved to database, ID: ${recordId}`);

      // Send to blockchain (MOCK)
      const timestamp = Math.floor(Date.now() / 1000);
      const tx = await blockchainService.storeHash(
        deviceId,
        dataHash,
        timestamp,
      );

      // Update database with blockchain info
      if (tx) {
        await databaseService.updateBlockchainInfo(
          recordId,
          tx.txHash,
          tx.blockNumber,
        );
        console.log(`⛓️ Blockchain stored, TX: ${tx.txHash}`);
      }

      res.status(201).json({
        status: "success",
        message: "Data received and stored",
        recordId: recordId,
        dataHash: dataHash,
        txHash: tx?.txHash ? tx.txHash.toString() : null,
        blockNumber: tx?.blockNumber ? Number(tx.blockNumber) : null,
      });
    } catch (error) {
      console.error("❌ Error in receiveData:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/sensor-data/latest/:deviceId
   * Get latest reading for a device
   */
  async getLatest(req, res) {
    try {
      const { deviceId } = req.params;

      if (!deviceId) {
        return res.status(400).json({ error: "deviceId is required" });
      }

      const reading = await databaseService.getLatestReading(deviceId);

      if (!reading) {
        return res.status(404).json({ error: "No data found for this device" });
      }

      res.json({
        status: "success",
        reading: reading,
      });
    } catch (error) {
      console.error("❌ Error in getLatest:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/sensor-data/history/:deviceId
   * Get historical readings for a device
   */
  async getHistory(req, res) {
    try {
      const { deviceId } = req.params;
      const { limit = 100 } = req.query;

      if (!deviceId) {
        return res.status(400).json({ error: "deviceId is required" });
      }

      const readings = await databaseService.getHistory(
        deviceId,
        parseInt(limit),
      );

      res.json({
        status: "success",
        count: readings.length,
        readings: readings,
      });
    } catch (error) {
      console.error("❌ Error in getHistory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/sensor-data/verify/:dataHash
   * Verify a reading by its hash
   */
  async verifyReading(req, res) {
    try {
      const { dataHash } = req.params;

      if (!dataHash) {
        return res.status(400).json({ error: "dataHash is required" });
      }

      // Check in database
      const reading = await databaseService.getReadingByHash(dataHash);

      // Check on blockchain (MOCK)
      const blockchainResult = await blockchainService.verifyHash(dataHash);

      res.json({
        status: "success",
        dataHash: dataHash,
        existsInDatabase: !!reading,
        blockchainVerified: blockchainResult.verified,
        reading: reading || null,
        blockchainResult: blockchainResult,
      });
    } catch (error) {
      console.error("❌ Error in verifyReading:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new SensorController();
