const expres = require('express');
const {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
} = require('../../controllers/products');

const advancedResults = require('../../middleware/advancedResults');

const Product = require('../../models/Product');

const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
const reviewRouter = require('./reviews');

const router = expres.Router();

// Re-route to other resource routers
router.use('/:productId/reviews', reviewRouter);

// protect, authorize('publisher', 'admin'),
router.route('/:id/photo').put(productPhotoUpload);

router
  .route('/')
  .get(advancedResults(Product, 'reviews'), getProducts)
  .post(protect, authorize('publisher', 'admin'), createProduct);

router
  .route('/:id')
  .get(getSingleProduct)
  .put(protect, authorize('publisher', 'admin'), updateProduct)
  .delete(protect, authorize('publisher', 'admin'), deleteProduct);

module.exports = router;
