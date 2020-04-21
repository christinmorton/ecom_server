const mongoose = require('mongoose');

const OrderHistorySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
  },
});

module.exports = mongoose.model('OrderHistory', OrderHistorySchema);
