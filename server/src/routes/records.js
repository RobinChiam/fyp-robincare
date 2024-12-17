const express = require("express");
const crypto = require("crypto");
const { storeRecordHash, getRecordHash } = require("../..blockchain");

const router = express.Router();

// Endpoint to store a record's hash
router.post("/store", async (req, res) => {
    const { recordId, recordData } = req.body;

    // Hash the record data
    const recordHash = crypto.createHash("sha256").update(recordData).digest("hex");

    try {
        await storeRecordHash(recordId, `0x${recordHash}`);
        res.json({ success: true, message: "Record hash stored on blockchain" });
    } catch (err) {
        console.error("Error storing hash:", err);
        res.status(500).json({ success: false, error: "Failed to store hash" });
    }
});

// Endpoint to retrieve a record's hash
router.get("/:recordId", async (req, res) => {
    const { recordId } = req.params;
    try {
        const hash = await getRecordHash(recordId);
        res.json({ success: true, hash });
    } catch (err) {
        console.error("Error retrieving hash:", err);
        res.status(500).json({ success: false, error: "Failed to retrieve hash" });
    }
});

module.exports = router;
