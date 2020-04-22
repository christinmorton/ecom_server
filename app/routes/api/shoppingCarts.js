const expres = require('express');
const {
  getShoppingcart,
  createShoppingCart,
  createCartItem,
  updateShoppingcart,
  deleteShoppingcart,
} = require('../../controllers/shoppingCarts');

// const advancedResults = require('../../middleware/advancedResults');

const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
// const reviewRouter = require('./reviews');

const router = expres.Router();

// Re-route to other resource routers
// router.use('/:productId/reviews', reviewRouter);

// protect, authorize('publisher', 'admin'),

router
  .route('/')
  .get(protect, getShoppingcart)
  .post(protect, createShoppingCart);

router
  .route('/:id')
  .post(protect, createCartItem)
  .put(protect, authorize, updateShoppingcart)
  .delete(protect, authorize, deleteShoppingcart); // Pass a cart item id to the delete request

module.exports = router;
