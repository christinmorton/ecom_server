const express = require('express');
const { getStore } = require('../../controllers/store');

// const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
// const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
// router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getStore);

module.exports = router;
