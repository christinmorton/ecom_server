const mongoose = require('mongoose');
const colors = require('colors');

const OrderSchema = new mongoose.Schema({
  totalprice: {
    type: Number,
    default: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'failed', 'return-requested', 'successful', 'saved'],
    default: 'pending',
    required: true,
  },
  orderStatusHistory: {
    type: [String],
  },
  closedOn: {
    type: Date,
  },
  createdAt: {
    date: Date,
  },
  saveOrder: Boolean,
  softDelete: Boolean,
  archiveOrder: Boolean,
  cartItems: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'CartItem',
      required: true,
    },
  ],
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
  },
});

// Encrypt password using bcrypt
OrderSchema.pre('save', async function (next) {
  this.createdAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
