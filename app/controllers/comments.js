const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Comment = require('../models/Comment');
const Post = require('../models/Posts');

// @desc        Get comments
// @route       GET /api/v1/posts/:postId/comments
// @access      Public
exports.getComments = asyncHandler(async (req, res, next) => {
  if (req.params.postId) {
    const comments = await Comment.find({ post: req.params.postId });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc        Get a single comment
// @route       GET /api/v1/comments/:id
// @access      Public
exports.getSingleComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate({
    path: 'post',
    select: 'title author summary',
  });

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc        Add comment
// @route       POST /api/v1/posts/:postId/comments
// @access      Public
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.postId;
  // Add user to req.body for user id relationship
  req.body.user = req.user.id;

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.postId}`, 404)
    );
  }

  const comment = await Comment.create(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc        UPDATE comment
// @route       POST /api/v1/comments/:commentId
// @access      Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this comment ${comment._id}`,
        401
      )
    );
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc        DELETE comment
// @route       POST /api/v1/comments/:commentId
// @access      Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this comment ${comment._id}`,
        401
      )
    );
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
