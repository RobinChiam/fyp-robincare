//Define MongoDB
const {MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// Connecting to MongoDB Atlas
const connectDB = () => {
  mongoose.connect(uri, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true // To ensure unique indexes are created
  })
    .then(() => console.log('🟢 Connected to Healthcare System : fyp-db'))
    .catch((err) => console.error('🔴 MongoDB connection error:', err));
  
}

/* ============== Export ConnectDB() ============== */
module.exports = connectDB;