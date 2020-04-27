const express = require('express');
const { pubKey } = require('../../controllers/store');
const { makePayment } = require('../../controllers/purchase');

const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
// const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
// router.use('/:bootcampId/courses', courseRouter);

router.route('/stripe-key').get(pubKey);

// router.route('/purchase/:orderId').post(protect, makePayment);

module.exports = router;
