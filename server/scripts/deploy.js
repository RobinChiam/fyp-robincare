const { ethers } = require("hardhat");

async function main() {
    console.log("Starting deployment...");

    // Get the ContractFactory for the HealthRecord contract
    const HealthRecord = await ethers.getContractFactory("HealthRecord");
    console.log("ContractFactory loaded:", HealthRecord);

    // Deploy the contract
    const healthRecord = await HealthRecord.deploy();
    console.log("Deployment initiated:", healthRecord);

    // Wait for the deployment to complete
    await healthRecord.waitForDeployment();
    console.log("Contract deployed successfully!");

    console.log("HealthRecord deployed to:", healthRecord.target);
}

main().catch((error) => {
    console.error("Error in deployment script:", error);
    process.exitCode = 1;
});
