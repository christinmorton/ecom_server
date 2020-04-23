const expres = require('express');
const {
  getShoppingcart,
  getCartItems,
  getSingleCartItem,
  createShoppingCart,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteShoppingcart,
} = require('../../controllers/shoppingCarts');

// const advancedResults = require('../../middleware/advancedResults');

const { protect, authorize } = require('../../middleware/auth');

const router = expres.Router();

// protect, authorize('publisher', 'admin'),

router
  .route('/')
  .get(protect, getShoppingcart)
  .post(protect, createShoppingCart);

router.route('/:id').delete(protect, deleteShoppingcart);

router
  .route('/cartitems')
  .get(protect, getCartItems)
  .post(protect, createCartItem);

router
  .route('/cartitems/:id')
  .get(protect, getSingleCartItem)
  .put(protect, updateCartItem)
  .delete(protect, deleteCartItem);

module.exports = router;
