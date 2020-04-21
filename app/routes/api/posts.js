const expres = require('express');
const {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
} = require('../../controllers/posts');

const advancedResults = require('../../middleware/advancedResults');

const Post = require('../../models/Posts');

const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
const commentRouter = require('./comments');

const router = expres.Router();

// Re-route to other resource routers
router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(advancedResults(Post, 'comments'), getPosts)
  .post(protect, authorize('publisher', 'admin'), createPost);

router
  .route('/:id')
  .get(getSinglePost)
  .put(protect, authorize('publisher', 'admin'), updatePost)
  .delete(protect, authorize('publisher', 'admin'), deletePost);

module.exports = router;
