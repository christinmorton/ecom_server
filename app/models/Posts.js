const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      unique: true,
      trim: true,
      maxlength: [255, 'title cannot be more than 255 characters'],
    },
    slug: String,
    summary: {
      type: String,
      required: [true, 'Please add a summary for this post'],
      maxlength: [600, 'Summary cannot be more than 600 characters'],
    },
    author: String,
    body: {
      type: String,
      required: [true, 'Please write your post content'],
    },
    quotes: {
      type: [String],
    },
    allowComments: Boolean,
    publish: {
      type: Boolean,
    },
    publishDate: {
      type: Date,
    },
    postLinks: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create post slug from title
PostSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

// Cascade delete comments when a post is deleted
PostSchema.pre('remove', async function (next) {
  await this.model('Comment').deleteMany({ post: this._id });

  next();
});

// Reverse populate with virtuals
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: __dirname,
  foreignField: 'post',
  justOne: false,
});

module.exports = mongoose.model('Post', PostSchema);
