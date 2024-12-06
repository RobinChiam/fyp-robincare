//Define MongoDB
const {MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

//MongoDB Connection String
//const uri = "mongodb+srv://jqchiamrobin:2GbuMzjw5ae7woOh@healthcare-system.7njvi.mongodb.net/fyp-db?retryWrites=true&w=majority&appName=healthcare-system";

const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
// /* ================= Declare MongoDB Client ================== */
//   async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }

// /* ==================== Run DB Connection =========================== */

//   const connectDB = () => {
//     run().catch(console.dir);

// };

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