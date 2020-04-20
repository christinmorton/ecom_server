const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'All products must have a title'],
    unique: true,
    trim: true,
    maxlength: [255, 'title cannot be more than 255 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Products must have a price'],
  },
  slug: String,
  allowComments: Boolean,
  publish: {
    type: Boolean,
  },
  publishDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create post slug from title
ProductSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

module.exports = mongoose.model('Product', ProductSchema);
