const { getHash } = require("./blockchain");
const MedicalHistory = require("./src/models/medicalHistory-model"); // Import the MedicalHistory model
const mongoose = require("mongoose");
require("dotenv").config();

async function verifyMedicalHistoryHash(medicalHistoryId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Step 1: Retrieve MedicalHistory document from MongoDB
    const medicalHistory = await MedicalHistory.findById(medicalHistoryId);
    if (!medicalHistory) {
      console.log("Medical History record not found.");
      return;
    }
    console.log(`Stored Hash in Database: ${medicalHistory.hash}`);

    // Step 2: Retrieve Hash from Blockchain
    const blockchainHash = await getHash(medicalHistoryId);
    console.log(`Hash Retrieved from Blockchain: ${blockchainHash}`);

    // Step 3: Compare the Hashes
    if (medicalHistory.hash === blockchainHash) {
      console.log("✅ Hash verification successful: The hashes match!");
    } else {
      console.log("❌ Hash verification failed: The hashes do not match.");
    }
  } catch (error) {
    console.error("Error verifying hash:", error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Call the function with a specific MedicalHistory ID
verifyMedicalHistoryHash("67623380e21e7cddcd40bd24");
