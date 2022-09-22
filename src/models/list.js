const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      text: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('List', listSchema);