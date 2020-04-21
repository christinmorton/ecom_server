const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
  },
  saveItem: {
    type: Boolean,
    default: false,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = mongoose.model('CartItem', CartItemSchema);
