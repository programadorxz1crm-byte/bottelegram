const mongoose = require('mongoose');

const ButtonSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['url', 'callback'], // Por ahora, solo 'url'
  },
  url: {
    type: String,
    // Requerido solo si el tipo es 'url'
    required: function() { return this.type === 'url'; },
  },
});

module.exports = mongoose.model('Button', ButtonSchema);
