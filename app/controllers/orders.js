const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Orders');
const Customer = require('../models/Customer');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ShoppingCart = require('../models/ShoppingCart');
const { internet } = require('faker');

// @desc        Get get all Orders for current user
// @route       GET /api/v1/orders
// @access      Private
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  if (!customer) {
    return next(
      new ErrorResponse(
        `Customer not found, please contact customer support`,
        500
      )
    );
  }

  // Check mongodb for customer orders
  const orders = await Order.find({ customer: customer }).cache({
    key: req.user.id,
  });

  if (!orders) {
    return next(
      new ErrorResponse(`Orders not found for customer of ${req.user.id}`, 400)
    );
  }

  res.status(201).json({
    success: true,
    data: orders,
  });
});

// @desc        Get get a single orders for current user
// @route       GET /api/v1/orders/:id
// @access      Private
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  // const customer = await Customer.findById(req.user.id);

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 400)
    );
  }

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc        Create orders for current user and purchase transaction
// @route       GET /api/v1/orders
// @access      Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });

  if (!customer) {
    return next(
      new ErrorResponse(
        `Custoemr not found, please contact custoemer support`,
        500
      )
    );
  }

  const shoppingcart = await ShoppingCart.findOne({ customer: customer });

  if (!shoppingcart) {
    return next(
      new ErrorResponse(
        `Shopping cart not found, please contact custoemer support`,
        500
      )
    );
  }

  let cartItemsList = await CartItem.find({ shoppingCart: shoppingcart });

  if (!cartItemsList) {
    return next(new ErrorResponse(`Cart items not found`, 400));
  }

  let totalPrice = 0;
  let costItems = [];
  let i = 0;
  let products = [];
  const statusMsg = 'pending';

  cartItemsList.forEach((cartItem) => {
    products[i] = cartItem.product;
    i++;
  });

  i = 0;
  let temp;
  products.forEach(async (product) => {
    temp = await Product.findById(product.toString());
    costItems[i] = temp.price; // Number(temp.price);
    totalPrice += costItems[i];
    i++;
  });

  const obj = {
    totalPrice,
    status: statusMsg,
    cartItems: cartItemsList,
    customer,
  };

  const order = await Order.create(obj);

  res.status(201).json({
    success: true,
    data: order,
  });
});

//TODO: Check for BUGS!!!
// @desc        Update a single order for current user
// @route       PUT /api/v1/orders/:id
// @access      Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 400)
    );
  }

  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc        Delete a single order for current user
// @route       DELETE /api/v1/orders/:id
// @access      Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 400)
    );
  }

  order.sofeDelete = true;
  // order.remove();

  res.status(200).json({
    success: true,
    data: { order: order.sofeDelete },
  });
});

// @desc        Create a payment intent for given individual order
// @route       POST /api/v1/orders/intent/:id
// @access      Private
exports.createIntent = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById({ user: req.user.id });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id ${req.user.id}`, 500)
    );
  }

  const order = await Order.findById({ _id: req.params.id });

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id ${req.params.id}`, 400)
    );
  }

  order.createIdempotencyKey();

  const { paymentMethodId, paymentIntentId, useStripeSdk } = req.body;

  try {
    let paymentIntent;
    if (paymentMethodId) {
      paymentIntent = await stripe.paymentIntents.create(
        {
          amount: order.totalPrice,
          currency: order.currency,
          paymentMethod: paymentMethodId,
          confirmation_method: 'manual',
          confirm: true,
          use_stripe_sdk: useStripeSdk,
          metadata: { integration_check: 'accept_a_payment' },
        },
        {
          idempotency_key: order.idempotencyKey,
        }
      );

      order.setPaymentIntentId(paymentIntent.id);
    } else if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    }

    res.status(200).json({
      success: true,
      data: generateResponse(paymentIntent, req.params.id),
    });
    // res.send(generateResponse(paymentIntent, req.params.id))
  } catch (err) {
    res.status(400).json({ error: err.message });
    // res.send({error: e.message});
  }
});

const generateResponse = asyncHandler(async (intent, id) => {
  // Generate a response based on the intent's status
  switch (intent.status) {
    case 'requires_action':
    case 'requires_source_action':
      // Card requires authentication
      await Order.findByIdAndUpdate(
        id,
        {
          $push: {
            orderStatusHistory:
              '🚫 Authentication failed, please provide to correct credentials!',
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return {
        requiresAction: true,
        clientSecret: intent.client_secret,
      };
    case 'requires_payment_method':
    case 'requires_source':
      // Card was not properly authenticated, suggest a new payment method
      await Order.findByIdAndUpdate(
        id,
        {
          $push: {
            orderStatusHistory:
              '🏧⚠️ Your card was denied, please provide a new payment method',
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return {
        error: '🏧⚠️ Your card was denied, please provide a new payment method',
      };
    case 'succeeded':
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log('💰 Payment received!');
      await Order.findByIdAndUpdate(
        id,
        {
          $push: { orderStatusHistory: '💰 Payment received!' },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return { clientSecret: intent.client_secret };
  }
});
