const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

//              This route should be called by the front-end app
// @desc        Get shopping cart for current user/customer
// @route       GET /api/v1/shoppingcart/:customerId
// @access      Private
exports.getShoppingcart = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  // check if customer is empty or exist
  if (!customer) {
    return next(
      new ErrorResponse(`Customer Id not found please contect support`, 500)
    );
  }

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  // check if shopping cart empty or exist
  if (!shoppingcart) {
    return next(
      new ErrorResponse(`Shopping cart not found please contect support`, 500)
    );
  }

  res.status(201).json({
    success: true,
    data: shoppingcart,
  });
});

// @desc        Get all cart items with same shopping cart id
// @route       GET /api/v1/shoppingcart/cartitems
// @access      Private
exports.getCartItems = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  // check if customer is empty or exist
  if (!customer) {
    return next(
      new ErrorResponse(`Customer Id not found please contect support`, 500)
    );
  }

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  // check if shopping cart empty or exist
  if (!shoppingcart) {
    return next(
      new ErrorResponse(`Shopping cart not found please contect support`, 500)
    );
  }

  const cartItems = await CartItem.find({ shoppingCart: shoppingcart });

  res.status(201).json({
    success: true,
    data: cartItems,
  });
});

// @desc        Get Cart Item
// @route       GET /api/v1/shoppingcart/cartitems/:cartItemId
// @access      Private
exports.getSingleCartItem = asyncHandler(async (req, res, next) => {
  const cartItem = await CartItem.find({ _id: req.params.id });

  // check if shopping cart empty or exist
  if (!cartItem) {
    return next(
      new ErrorResponse(`Cart Item not found with id ${req.params.id}`, 400)
    );
  }

  res.status(201).json({
    success: true,
    data: cartItem,
  });
});

//              This route should be called by the front-end app automatically
//              If the front end does not create a shopping cart consider a application server error.
// @desc        Post create shopping cart and customer
// @route       POST /api/v1/shoppingcart
// @access      Private
exports.createShoppingCart = asyncHandler(async (req, res, next) => {
  const customerExist = await Customer.findOne({ user: req.user.id });
  let shoppingcart;

  if (!customerExist) {
    // declare and initailize a customer with user id
    const customer = await Customer.create({ user: req.user.id });

    shoppingcart = await ShoppingCart.create({ customer: customer._id });
    return res.status(201).json({
      success: true,
      data: shoppingcart,
    });
  } else {
    shoppingcart = await ShoppingCart.findOne({
      customer: customerExist,
    });

    if (!shoppingcart) {
      shoppingcart = null;
      shoppingcart = await ShoppingCart.create({ customer: customerExist._id });
    }

    res.status(201).json({
      success: true,
      data: shoppingcart,
    });
  }
});

// @desc        Post create cart item to shopping cart
// @route       POST /api/v1/shoppingcart/cartitems/
// @access      Private
exports.createCartItem = asyncHandler(async (req, res, next) => {
  // declare and initailize a customer with user id
  const customer = await Customer.findOne({ user: req.user.id });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer Id not found please contect support`, 500)
    );
  }

  const shoppingcart = await ShoppingCart.findOne({
    customer: customer,
  });

  // check if shopping cart exist
  if (!shoppingcart) {
    return next(
      new ErrorResponse(`Shopping cart not found please contect support`, 500)
    );
  }

  const { product, quantity, saveItem } = req.body;

  // Check if productId is array
  if (!product) {
    return next(
      new ErrorResponse(`Please add a product to your shopping cart`, 400)
    );
  }

  if (isNaN(quantity) || quantity <= 0) {
    return next(
      new ErrorResponse('Please add quantity to your shopping cart items', 400)
    );
  }

  if (typeof saveItem !== 'boolean') {
    return next(new ErrorResponse('Save item can only be true or false', 400));
  }

  const productMdl = await Product.findById(product);

  // check if product exist in database
  if (!productMdl) {
    return next(
      new ErrorResponse(`Product not found with id of ${product}`, 404)
    );
  }

  req.body.shoppingCart = shoppingcart;

  // store cart items
  const cartItem = await CartItem.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      msg: 'Item added to shopping cart',
      cartItem,
    },
  });
});

// @desc        Update shopping cart items for current user/customer
// @route       PUT /api/v1/shoppingcart/:oldCartItemId
// @access      Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  // check if customer is empty or exist
  if (!customer) {
    return next(
      new ErrorResponse(`Customer Id not found please contect support`, 500)
    );
  }

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  // check if shopping cart empty or exist
  if (!shoppingcart) {
    return next(
      new ErrorResponse(`Shopping cart not found please contect support`, 500)
    );
  }

  const oldCartItem = await CartItem.findOne({ _id: req.params.id });

  // check if shopping cart empty or exist
  if (!oldCartItem) {
    return next(
      new ErrorResponse(`Cart item not found with id ${req.params.id}`, 500)
    );
  }

  const newProduct = req.body.product;
  const newQuantity = req.body.quantity;
  const newSaveItem = req.body.saveItem;

  // Check if productId is array
  if (!newProduct) {
    return next(
      new ErrorResponse(`Please add a product to your shopping cart`, 400)
    );
  }

  if (isNaN(newQuantity) || newQuantity <= 0) {
    return next(
      new ErrorResponse('Please add quantity to your shopping cart items', 400)
    );
  }

  if (typeof newSaveItem !== 'boolean') {
    return next(new ErrorResponse('Save item can only be true or false', 400));
  }

  const productMdl = await Product.findById({ _id: newProduct });

  if (!productMdl) {
    return next(
      new ErrorResponse(`Product not found with id of ${newProduct}`, 404)
    );
  }

  // Make sure user is post owner
  // if (customer.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to delete this post ${post._id}`,
  //       401
  //     )
  //   );
  // }

  const newCartItem = await CartItem.findByIdAndUpdate(oldCartItem, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: { msg: 'Cart item updated', newCartItem },
  });
});

// @desc        Delete cart item from shopping cart
// @route       DELETE /api/v1/shoppingcart/cartItem/:cartItemId
// @access      Private
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cartItem = await CartItem.findById(req.params.id);

  if (!cartItem) {
    return next(
      new ErrorResponse(`Cart item not found with id of ${req.params.id}`, 404)
    );
  }

  await cartItem.remove();

  res.status(201).json({
    success: true,
    data: { msg: 'Cart item removed' },
  });
});

//              This route should be called by the front-end app automatically
//              If the front end does not delete a shopping cart consider a application server error.
// @desc        Delete shopping cart for current user/customer
// @route       DELETE /api/v1/shoppingcart/:customerId
// @access      Private
exports.deleteShoppingcart = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  // check if customer is empty or exist
  if (!customer) {
    return next(
      new ErrorResponse(`Customer Id not found please contect support`, 500)
    );
  }

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  // check if shopping cart empty or exist
  if (!shoppingcart) {
    return next(
      new ErrorResponse(`Shopping cart not found please contect support`, 500)
    );
  }

  // Make sure user is post owner
  // if (customer.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to delete this post ${post._id}`,
  //       401
  //     )
  //   );
  // }

  await shoppingcart.remove();

  res.status(201).json({
    success: true,
    data: { msg: 'Shopping Cart removed' },
  });
});
