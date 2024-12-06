// config.js
require('dotenv').config(); // Load environment variables
const MongoStore = require('connect-mongo');

module.exports = {
    port: process.env.PORT, // Default port if none is specified in .env
    billing_port: process.env.BILLING_PORT,
    admin_port: process.env.ADMIN_PORT,
    mongoURI: process.env.MONGO_URI,
    sessionSecret: process.env.SESSION
};


/* Backup
sessionConfig: {
        secret: process.env.SESSION,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Store sessions in MongoDB
        cookie: { maxAge: 30 * 60 * 1000, secure: false }, // 30 minutes session
    }
*/