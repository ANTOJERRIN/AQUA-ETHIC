// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WaterQuality {
    struct Record {
        string sensorId;
        string sourceType;
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(string => Record) public records;

    function recordData(string memory _sensorId, string memory _sourceType, bytes32 _dataHash) public {
        records[_sensorId] = Record(_sensorId, _sourceType, _dataHash, block.timestamp);
    }
}