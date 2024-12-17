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
    const tx = await contract.storeHash(recordId, ethers.encodeBytes32String(recordHash));
    await tx.wait();
    return tx.hash; // Transaction hash
}

async function getHash(recordId) {
    const hash = await contract.getHash(recordId);
    return ethers.decodeBytes32String(hash);
}

module.exports = { storeHash, getHash };
