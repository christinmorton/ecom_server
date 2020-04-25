const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Customer = require('../models/Customer');
const Order = require('../models/Orders');
const e = require('express');

// @desc      POST create a purchase
// @route     POST /purchase/:orderId
// @access    Private
exports.makePayment = asyncHandler(async (req, res, next) => {
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
    } else if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    }

    res.status(200).json({
      success: true,
      data: generateResponse(paymentIntent, req.params.id),
    });
    // res.send(generateResponse(paymentIntent, req.params.id))
  } catch (err) {
    res.status(400).json({ error: e.message });
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
