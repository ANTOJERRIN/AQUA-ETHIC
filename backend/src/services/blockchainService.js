const blockchainConfig = require("../config/blockchain");

class BlockchainService {
  constructor() {
    this.web3 = blockchainConfig.web3;
    this.contract = blockchainConfig.getContract();
    this.account = blockchainConfig.account;
    this.privateKey = blockchainConfig.privateKey;
    this.isMock = false;
    console.log("BlockchainService ready (REAL)");
  }

  async storeHash(deviceId, dataHash, timestamp) {
    try {
      console.log("Storing on REAL blockchain: " + dataHash);

      const tx = await this.contract.methods.storeReading(
        deviceId,
        dataHash,
        timestamp,
      );
      const gasEstimate = await tx.estimateGas({ from: this.account });
      const gasPrice = await this.web3.eth.getGasPrice();

      const signedTx = await this.web3.eth.accounts.signTransaction(
        {
          to: blockchainConfig.contractAddress,
          data: tx.encodeABI(),
          gas: gasEstimate,
          gasPrice: gasPrice,
          from: this.account,
          nonce: await this.web3.eth.getTransactionCount(this.account),
        },
        this.privateKey,
      );

      const receipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      );

      console.log("Blockchain stored! TX: " + receipt.transactionHash);
      return {
        txHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber), // Convert BigInt to Number
      };
    } catch (error) {
      console.error("Blockchain error:", error.message);
      return null;
    }
  }

  async verifyHash(dataHash) {
    try {
      console.log("Verifying: " + dataHash);
      const result = await this.contract.methods.verifyReading(dataHash).call();
      return {
        exists: result.exists,
        verified: result.verified,
        deviceId: result.deviceId,
        timestamp: result.timestamp,
        validator: result.validator,
      };
    } catch (error) {
      console.error("Verification error:", error.message);
      return { exists: false, verified: false };
    }
  }
}

module.exports = new BlockchainService();
