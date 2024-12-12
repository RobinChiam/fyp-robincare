const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, required: true }, // Path to the thumbnail image
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Reference to Doctor
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
