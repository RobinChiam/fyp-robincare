/* Load environment variables */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./src/config/session');
const connectDB = require('./src/db/atlas');
const path = require('path');

/* Route Imports */
const publicRoutes = require('./src/routes/publicRoutes');
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const billingRoutes = require('./src/routes/billingRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const medicalRecordsRoutes = require('./src/routes/medicalRecordsRoutes');
const insuranceClaimsRoutes = require('./src/routes/insuranceClaimsRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

/* Create Express app */
const app = express();

/* Middleware */
app.use(cors({
    origin: process.env.CLIENT_URL, // URL of your React frontend
    credentials: true,             // Allow cookies to be sent
  }));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware); // Use session middleware
app.use(cookieParser());

/* Make user Object available globally. */
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // If user is logged in, make user available globally
    next();
});

/* Serve Static Files */
app.use('/uploads',express.static(path.join(__dirname, './public/uploads/profile-picture')));
// Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, './src/public/uploads')));

/* Connect to MongoDB */
connectDB();

/* Route Handlers*/
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/billing', billingRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);
app.use('/medical-records', medicalRecordsRoutes);
app.use('/insurance-claims', insuranceClaimsRoutes);
app.use('/api', apiRoutes);

/* Start server */
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
