/* session.js 
Session handling across multiple Express Applications
 */
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config(); 

const uri = process.env.MONGO_URI;

mongoose.connect(uri);

const sessionMiddleware = session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: uri, 
        collectionName: 'sessions',
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        domain: process.env.DOMAIN,
        maxAge: 1000 * 60 * 60, // 1 Hour Session
    }
});

module.exports = sessionMiddleware;