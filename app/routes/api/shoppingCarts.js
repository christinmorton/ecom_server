const expres = require('express');
const { fillShoppingCart } = require('../../controllers/shoppingCarts');

// const advancedResults = require('../../middleware/advancedResults');

const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
// const reviewRouter = require('./reviews');

const router = expres.Router();

// Re-route to other resource routers
// router.use('/:productId/reviews', reviewRouter);

// protect, authorize('publisher', 'admin'),

router.route('/').post(protect, fillShoppingCart);

module.exports = router;
