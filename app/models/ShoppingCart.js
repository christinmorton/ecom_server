const mongoose = require('mongoose');

let future = new Date();

const ShoppingCartSchema = new mongoose.Schema({
  expireDate: {
    date: Date,
    default: future.setDate(future.getDate() + 30),
  },
  createdAt: {
    date: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
  },
  cartItem: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'CartItem',
      required: true,
    },
  ],
});

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
