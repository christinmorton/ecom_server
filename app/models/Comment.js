const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Please write your post content'],
    maxlength: [350, 'Comments cannot be more than 350 characters'],
  },
  atUser: {
    type: String,
    trim: true,
  },
  thumbsUp: {
    type: String,
  },
  thumbsDown: {
    type: String,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
