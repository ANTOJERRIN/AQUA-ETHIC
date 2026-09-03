// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract WaterQuality {
    struct Reading {
        string deviceId;
        string dataHash;
        uint256 timestamp;
        bool verified;
        address validator;
    }

    Reading[] public readings;
    mapping(string => bool) public existingHashes;
    mapping(string => uint256) public hashToIndex;

    address public owner;

    event ReadingStored(
        string deviceId,
        string dataHash,
        uint256 timestamp,
        uint256 index,
        address validator
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function storeReading(
        string memory _deviceId,
        string memory _dataHash,
        uint256 _timestamp
    ) public {
        require(!existingHashes[_dataHash], "Hash already exists");

        readings.push(Reading({
            deviceId: _deviceId,
            dataHash: _dataHash,
            timestamp: _timestamp,
            verified: true,
            validator: msg.sender
        }));

        existingHashes[_dataHash] = true;
        hashToIndex[_dataHash] = readings.length - 1;

        emit ReadingStored(_deviceId, _dataHash, _timestamp, readings.length - 1, msg.sender);
    }

    function verifyReading(string memory _dataHash) public view returns (
        bool exists,
        bool verified,
        string memory deviceId,
        uint256 timestamp,
        address validator
    ) {
        if (!existingHashes[_dataHash]) {
            return (false, false, "", 0, address(0));
        }

        uint256 index = hashToIndex[_dataHash];
        Reading storage reading = readings[index];

        return (true, reading.verified, reading.deviceId, reading.timestamp, reading.validator);
    }

    function getTotalReadings() public view returns (uint256) {
        return readings.length;
    }

    function getReading(uint256 index) public view returns (
        string memory deviceId,
        string memory dataHash,
        uint256 timestamp,
        bool verified,
        address validator
    ) {
        require(index < readings.length, "Index out of bounds");
        Reading storage reading = readings[index];
        return (
            reading.deviceId,
            reading.dataHash,
            reading.timestamp,
            reading.verified,
            reading.validator
        );
    }
}