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

// Include other resource routers
const commentRouter = require('./comments');

const router = expres.Router();

// Re-route to other resource routers
router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(advancedResults(Post, 'comments'), getPosts)
  .post(createPost);

router.route('/:id').get(getSinglePost).put(updatePost).delete(deletePost);

module.exports = router;
