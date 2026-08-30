const crypto = require('crypto');

/**
 * Generates SHA-256 hash of data
 * @param {Object} data - The data to hash
 * @returns {string} - SHA-256 hash with '0x' prefix
 */
function generateHash(data) {
    const jsonString = JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
    return '0x' + hash;
}

/**
 * Verifies if a hash matches the data
 * @param {Object} data - The data to verify
 * @param {string} expectedHash - The hash to compare against
 * @returns {boolean} - True if hash matches
 */
function verifyHash(data, expectedHash) {
    const computedHash = generateHash(data);
    return computedHash === expectedHash;
}

module.exports = { generateHash, verifyHash };