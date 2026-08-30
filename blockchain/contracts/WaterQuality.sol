// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WaterQuality {
    address public owner;

    struct Record {
        string sensorId;
        string sourceType;
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(string => Record) public records;
    mapping(string => bool) public sensorExists;
    string[] public sensorIds;

    // ✅ FIX: Added event for auditing
    event DataAnchored(string indexed sensorId, bytes32 dataHash, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    // ✅ FIX: Added access control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized to anchor data");
        _;
    }

    // ✅ FIX: Added duplicate check
    function recordData(
        string memory _sensorId,
        string memory _sourceType,
        bytes32 _dataHash
    ) public onlyOwner {
        require(!sensorExists[_sensorId], "Sensor already exists");
        
        records[_sensorId] = Record({
            sensorId: _sensorId,
            sourceType: _sourceType,
            dataHash: _dataHash,
            timestamp: block.timestamp
        });
        
        sensorExists[_sensorId] = true;
        sensorIds.push(_sensorId);
        
        // ✅ FIX: Emit event for auditing
        emit DataAnchored(_sensorId, _dataHash, block.timestamp);
    }

    function verifyRecord(
        string memory _sensorId,
        bytes32 _currentHash
    ) public view returns (bool) {
        require(sensorExists[_sensorId], "Sensor does not exist");
        return records[_sensorId].dataHash == _currentHash;
    }

    function getRecord(
        string memory _sensorId
    ) public view returns (Record memory) {
        require(sensorExists[_sensorId], "Sensor does not exist");
        return records[_sensorId];
    }

    function getAllSensorIds() public view returns (string[] memory) {
        return sensorIds;
    }

    function getRecordCount() public view returns (uint256) {
        return sensorIds.length;
    }
}