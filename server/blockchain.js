const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = [
    "function storeHash(string recordId, bytes32 recordHash) public",
    "function getHash(string recordId) public view returns (bytes32)"
];

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function storeHash(recordId, recordHash) {
    const truncatedHash = `0x${recordHash.substring(0, 64)}`; // Ensure it fits into bytes32
    const tx = await contract.storeHash(recordId, truncatedHash);
    await tx.wait();
    return tx.hash; // Return the transaction hash
}

async function getHash(recordId) {
    const hash = await contract.getHash(recordId);
    return hash; // Return the raw hash
}

module.exports = { storeHash, getHash };
