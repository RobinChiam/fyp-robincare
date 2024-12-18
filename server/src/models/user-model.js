/* ============== Schema for User Database Object ================ */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('./doctor-model');
const Patient = require('./patient-model');

const userSchema = new mongoose.Schema({
    icNumber: { type: String, sparse: true, required: true }, // Malaysian IC or Passport
    email: { type: String, sparse: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true },
    name: { type: String, required: true }, 
    dob: {type: String},
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },
    profilePicture: {
      type: String, // File path to the uploaded image
      default: '/profile/placeholder.png' // Default file path if none is provided
    },
    subscribedToEmails: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

/** Compare Password */
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

/** Password Hashing when .save() */
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
    next();
});

// Create or validate corresponding Patient record after saving a User
// userSchema.post('save', async function (doc, next) {
//   try {
//       if (doc.role === 'patient') {
//           // Check if a Patient record exists for this user
//           const existingPatient = await Patient.findOne({ user: doc._id });
//           if (!existingPatient) {
//               // Create a new Patient record with default values
//               await Patient.create({
//                   user: doc._id,
//                   address: '', // Default empty address
//                   medicalHistory: [] // Default empty medical history
//               });
//           }
//       }
//       next();
//   } catch (error) {
//       console.error('Error during Patient creation:', error);
//       next(error);
//   }
// });

// Pre-remove hook to delete corresponding Patient or Doctor record
userSchema.pre('remove', async function (next) {
  try {
    if (this.role === 'doctor') {
      // Delete associated Doctor record
      await Doctor.findOneAndDelete({ user: this._id });
    } else if (this.role === 'patient') {
      // Delete associated Patient record
      await Patient.findOneAndDelete({ user: this._id });
    }
    next();
  } catch (error) {
    console.error('Error during user removal:', error);
    next(error);
  }
});



module.exports = mongoose.model('User', userSchema);
