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
  .post(createComment);

router
  .route('/:id')
  .get(getSingleComment)
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;
