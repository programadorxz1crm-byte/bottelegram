const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponseSchema = new mongoose.Schema({
  command: {
    type: String,
    required: true,
    unique: true, // Cada comando debe ser único
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  buttonIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Button',
  }],
});

module.exports = mongoose.model('Response', ResponseSchema);
