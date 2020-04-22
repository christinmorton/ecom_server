const mongoose = require('mongoose');

let future = new Date();

const ShoppingcartSchema = new mongoose.Schema({
  expireDate: {
    type: Date,
    default: future.setDate(future.getDate() + 30),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
  },
});

module.exports = mongoose.model('ShoppingCart', ShoppingcartSchema);
