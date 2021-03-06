const expres = require('express');
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  createIntent,
} = require('../../controllers/orders');

// const advancedResults = require('../../middleware/advancedResults');

const { protect, authorize } = require('../../middleware/auth');
const cleanCache = require('../../middleware/cleanCache');

const router = expres.Router();

router
  .route('/')
  .get(protect, cleanCache, getAllOrders)
  .post(protect, createOrder);

router
  .route('/:id')
  .get(protect, getSingleOrder)
  .put(protect, updateOrder)
  .delete(protect, deleteOrder);

router.route('/intent/:id').post(protect, createIntent);

module.exports = router;
