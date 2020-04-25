const mongoose = require('mongoose');
const colors = require('colors');
const uuidv4 = require('uuid/v4');

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

OrderSchema.statics.createIdempotencyKey = function () {
  this.idempotencyKey = uuidv4(); // V4 UUIDs
};

OrderSchema.post('save', function () {
  this.constructor.createIdempotencyKey();
});

// Encrypt password using bcrypt
OrderSchema.pre('save', async function (next) {
  this.createdAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
