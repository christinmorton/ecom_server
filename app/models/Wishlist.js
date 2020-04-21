const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'CartItem',
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
  },
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
