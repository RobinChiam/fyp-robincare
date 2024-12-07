const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* ============== Schema for User Database Object ================ */

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ // Basic regex for email validation
      },
    password: {type: String, required: true},
    role: {type: String, default: 'user', enum:['user', 'admin']},
    healthrecords: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'healthrecords', // Reference to the HealthRecord collection
      default: null // Empty by default
  },
  appointments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'appointments', // Reference to the Appointment collection
      default: null // Empty by default
  }],
  billing: {
      type: Map, // A flexible key-value store for billing information
      of: String,
      default: {} // Empty by default
  },
  profilePicture: {
    type: String, // File path to the uploaded image
    default: '/img/placeholder.png' // Default file path if none is provided
  },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}
    },
    {timestamps: true });

/* ===== Password Hashing When .save() ===== */
    UserSchema.pre('save', async function(next) {
        if (this.isModified('password')) {
          this.password = await bcrypt.hash(this.password, 10);
        }
        next();
      });



//Password hashing middleware
/*UserSchema.pre('save', async function(next) 
{
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (password) 
{
    return bcrypt.compare(password, this.password);
};*/

module.exports = mongoose.model('User', UserSchema);
