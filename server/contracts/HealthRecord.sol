// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HealthRecord {
    mapping(string => bytes32) public recordHashes;

    function storeHash(string memory recordId, bytes32 recordHash) public {
        recordHashes[recordId] = recordHash;
    }

    function getHash(string memory recordId) public view returns (bytes32) {
        return recordHashes[recordId];
    }
}
