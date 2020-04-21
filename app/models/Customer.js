const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  chargeToken: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
