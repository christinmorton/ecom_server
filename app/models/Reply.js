// const mongoose = require('mongoose');

// const ReplySchema = new mongoose.Schema({
//   thumbsUp: {
//     type: String,
//   },
//   thumbsDown: {
//     type: String,
//   },
//   message: {
//     type: String,
//     required: [true, 'Please write your post content'],
//     trim: true,
//     maxlength: [350, 'Replys cannot be more than 350 characters'],
//   },
//   userId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Reply', ReplySchema);
