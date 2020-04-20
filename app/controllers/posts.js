const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Post = require('../models/Posts');

// @desc        Get all posts
// @route       GET /api/v1/posts
// @access      Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({ success: true, count: posts.length, data: posts });
});

// @desc        Get single post
// @route       GET /api/v1/posts/:id
// @access      Public
exports.getSinglePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: post });
});

// @desc        Create single post
// @route       POST /api/v1/posts/:id
// @access      Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc        Update a single posts
// @route       PUT /api/v1/posts/:id
// @access      Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc        Delete a single posts
// @route       DELETE /api/v1/posts/:id
// @access      Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: {},
  });
});
