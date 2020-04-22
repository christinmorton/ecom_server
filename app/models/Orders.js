const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  totalprice: Number,
  status: {
    type: String,
    enum: ['pending', 'failed', 'return-requested', 'successful', 'saved'],
  },
  closedOn: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    date: Date,
    default: Date.now,
  },
  shoppingCart: {
    type: mongoose.Schema.ObjectId,
    ref: 'ShoppingCart',
    required: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
