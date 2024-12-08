/* Schema for Chat Conversation Data Object */

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be Patient or Doctor
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
