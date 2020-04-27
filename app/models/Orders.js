const mongoose = require('mongoose');
const colors = require('colors');
const { v4: uuidv4 } = require('uuid');

const OrderSchema = new mongoose.Schema({
  totalprice: {
    type: Number,
    default: 0,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  paymentIntentId: {
    type: String,
  },
  idempotencyKey: String,
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

OrderSchema.methods.setPaymentIntentId = function (id) {
  this.paymentIntentId = id; // V4 UUIDs
};

OrderSchema.methods.createIdempotencyKey = function () {
  this.idempotencyKey = uuidv4(); // V4 UUIDs
};

// Encrypt password using bcrypt
OrderSchema.pre('save', async function (next) {
  this.createdAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
