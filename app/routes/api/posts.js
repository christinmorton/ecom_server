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

const router = expres.Router();

router.route('/').get(getPosts).post(createPost);

router.route('/:id').get(getSinglePost).put(updatePost).delete(deletePost);

module.exports = router;
