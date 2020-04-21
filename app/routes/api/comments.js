const expres = require('express');
const {
  getComments,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
} = require('../../controllers/comments');

const Comment = require('../../models/Comment');
const advancedResults = require('../../middleware/advancedResults');

const { protect, authorize } = require('../../middleware/auth');

const router = expres.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Comment, {
      path: 'post',
      select: 'title author summary',
    }),
    getComments
  )
  .post(protect, authorize('user', 'admin'), createComment);

router
  .route('/:id')
  .get(getSingleComment)
  .put(protect, authorize('user', 'admin'), updateComment)
  .delete(protect, authorize('user', 'admin'), deleteComment);

module.exports = router;
