const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// @desc        Get shopping cart for current user/customer
// @route       GET /api/v1/shoppingcart/:customerId
// @access      Private
exports.getShoppingcart = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  res.status(201).json({
    success: true,
    data: shoppingcart,
  });
});

// @desc        Post add items to shopping cart
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
    shoppingcart = await ShoppingCart.find({
      customer: customerExist,
    });

    console.log(shoppingcart);
    res.status(201).json({
      success: true,
      data: shoppingcart,
    });
  }
});

// @desc        Post create cart item to shopping cart
// @route       POST /api/v1/shoppingcart/:id
// @access      Private
exports.createCartItem = asyncHandler(async (req, res, next) => {
  // declare and initailize a customer with user id
  let customer = await Customer.findOne({ user: req.user.id });
  let shoppingcart;

  if (!customer) {
    // declare and initailize a customer with user id
    customer = await Customer.create({ user: req.user.id });

    shoppingcart = await ShoppingCart.create({ customer: customer._id });

    req.body.shoppingCart = shoppingcart;
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

  const productMdl = await Product.findById(req.params.id);

  if (!productMdl) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // save items to shopping cart
  if (!shoppingcart) {
    shoppingcart = await ShoppingCart.findOne({
      customer,
    });
  }

  // store cart items
  cartItem = await CartItem.create(req.body);

  res.status(201).json({
    success: true,
    data: { shoppingcart, cartItem },
  });
});

// @desc        Updatet shopping cart items for current user/customer
// @route       PUT /api/v1/shoppingcart/
// @access      Private
exports.updateShoppingcart = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  const { product, quantity, saveItem } = req.body;

  const oldProduct = req.params.id;

  // Check if productId is array
  if (!oldProduct) {
    return next(
      new ErrorResponse(`Please add a product to your shopping cart`, 400)
    );
  }

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
  const oldProductMdl = await Product.findById(oldProduct);

  if (!productMdl) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  if (!oldProductMdl) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner
  if (customer.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this post ${post._id}`,
        401
      )
    );
  }

  let cartItems = await CartItem.find({ shoppingCart: shoppingcart });

  let changeCartItem = cartItems.filter(function (cartItem) {
    if (oldProduct === cartItem.product.toString()) {
      return cartItem;
    }
  });

  const newCartItem = await CartItem.findByIdAndUpdate(
    changeCartItem[0],
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    success: true,
    data: { shoppingcart, newCartItem },
  });
});

// @desc        Delete shopping cart for current user/customer
// @route       DELETE /api/v1/shoppingcart/:customerId
// @access      Private
exports.deleteShoppingcart = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  const cartItem = await CartItem.findById(req.params.id);

  if (!cartItem) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner
  if (customer.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this post ${post._id}`,
        401
      )
    );
  }

  await cartItem.remove();

  res.status(201).json({
    success: true,
    data: shoppingcart,
  });
});
